from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity
from .. import db
from ..models.notice import Notice
from ..utils.auth_helpers import admin_required
from ..utils.image_utils import save_image

notice_bp = Blueprint('notice', __name__)


def _notice_payload():
    """JSON / multipart 둘 다 지원. (필드 dict, 업로드된 썸네일 파일 or None) 반환."""
    if request.content_type and 'multipart/form-data' in request.content_type:
        f = request.form
        payload = {
            'category': f.get('category', 'general'),
            'title': f.get('title', '').strip(),
            'content': f.get('content', '').strip(),
            'is_pinned': f.get('is_pinned', 'false').lower() == 'true',
            'remove_thumbnail': f.get('remove_thumbnail', 'false').lower() == 'true',
        }
        return payload, request.files.get('thumbnail')
    data = request.get_json() or {}
    return {
        'category': data.get('category', 'general'),
        'title': (data.get('title') or '').strip(),
        'content': (data.get('content') or '').strip(),
        'is_pinned': bool(data.get('is_pinned', False)),
        'remove_thumbnail': bool(data.get('remove_thumbnail', False)),
    }, None


@notice_bp.route('/', methods=['GET'])
def list_notices():
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category')
    per_page = 15

    q = Notice.query.order_by(Notice.is_pinned.desc(), Notice.created_at.desc())
    if category:
        q = q.filter_by(category=category)

    pagination = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'success': True,
        'data': {
            'items': [n.to_dict() for n in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'page': page,
        }
    })


@notice_bp.route('/<int:notice_id>', methods=['GET'])
def get_notice(notice_id):
    notice = Notice.query.get_or_404(notice_id)
    notice.views += 1
    db.session.commit()
    return jsonify({'success': True, 'data': notice.to_dict()})


@notice_bp.route('/', methods=['POST'])
@admin_required
def create_notice():
    payload, thumb_file = _notice_payload()
    if not payload['title'] or not payload['content']:
        return jsonify({'success': False, 'error': '제목과 내용을 입력하세요.'}), 400
    notice = Notice(
        category=payload['category'],
        title=payload['title'],
        content=payload['content'],
        author_id=int(get_jwt_identity()),
        is_pinned=payload['is_pinned'],
    )
    if thumb_file and thumb_file.filename:
        _, thumb = save_image(thumb_file, current_app.config['UPLOAD_FOLDER'])
        notice.thumbnail = thumb
    db.session.add(notice)
    db.session.commit()
    return jsonify({'success': True, 'data': notice.to_dict()}), 201


@notice_bp.route('/<int:notice_id>', methods=['PUT'])
@admin_required
def update_notice(notice_id):
    notice = Notice.query.get_or_404(notice_id)
    payload, thumb_file = _notice_payload()
    notice.category = payload['category']
    if payload['title']:
        notice.title = payload['title']
    if payload['content']:
        notice.content = payload['content']
    notice.is_pinned = payload['is_pinned']
    if thumb_file and thumb_file.filename:
        _, thumb = save_image(thumb_file, current_app.config['UPLOAD_FOLDER'])
        notice.thumbnail = thumb
    elif payload['remove_thumbnail']:
        notice.thumbnail = None
    db.session.commit()
    return jsonify({'success': True, 'data': notice.to_dict()})


@notice_bp.route('/<int:notice_id>', methods=['DELETE'])
@admin_required
def delete_notice(notice_id):
    notice = Notice.query.get_or_404(notice_id)
    db.session.delete(notice)
    db.session.commit()
    return jsonify({'success': True, 'data': {}})
