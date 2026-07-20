from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.board import BoardPost, BoardComment, VALID_BOARD_TYPES, ADMIN_BOARDS
from ..models.user import User
from ..utils.image_utils import save_image

board_bp = Blueprint('board', __name__)


def _can_modify(user_id, author_id):
    user = User.query.get(user_id)
    return user and (user.role == 'admin' or user.id == author_id)


def _post_payload():
    """JSON / multipart 둘 다 지원. (필드 dict, 업로드된 이미지 파일 or None) 반환."""
    if request.content_type and 'multipart/form-data' in request.content_type:
        f = request.form
        return {
            'title': f.get('title', '').strip(),
            'content': f.get('content', '').strip(),
            'board_type': f.get('board_type', 'ipga'),
            'remove_image': f.get('remove_image', 'false').lower() == 'true',
        }, request.files.get('image')
    data = request.get_json() or {}
    return {
        'title': (data.get('title') or '').strip(),
        'content': (data.get('content') or '').strip(),
        'board_type': data.get('board_type', 'ipga'),
        'remove_image': bool(data.get('remove_image', False)),
    }, None


@board_bp.route('/', methods=['GET'])
def list_posts():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 15, type=int), 20)
    board_type = request.args.get('type')

    query = BoardPost.query
    if board_type:
        if board_type not in VALID_BOARD_TYPES:
            return jsonify({'success': False, 'error': '잘못된 게시판입니다.'}), 400
        query = query.filter_by(board_type=board_type)

    pagination = query.order_by(BoardPost.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify({
        'success': True,
        'data': {
            'items': [p.to_dict() for p in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'page': page,
        }
    })


@board_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = BoardPost.query.get_or_404(post_id)
    post.views += 1
    db.session.commit()
    return jsonify({'success': True, 'data': post.to_dict(include_comments=True)})


@board_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    payload, img = _post_payload()
    if not payload['title'] or not payload['content']:
        return jsonify({'success': False, 'error': '제목과 내용을 입력하세요.'}), 400
    board_type = payload['board_type']
    if board_type not in VALID_BOARD_TYPES:
        return jsonify({'success': False, 'error': '잘못된 게시판입니다.'}), 400
    user_id = get_jwt_identity()
    if board_type in ADMIN_BOARDS:
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'success': False, 'error': '관리자만 작성할 수 있는 게시판입니다.'}), 403
    post = BoardPost(
        board_type=board_type,
        title=payload['title'],
        content=payload['content'],
        author_id=user_id,
    )
    if img and img.filename:
        orig, _ = save_image(img, current_app.config['UPLOAD_FOLDER'])
        post.image = orig
    db.session.add(post)
    db.session.commit()
    return jsonify({'success': True, 'data': post.to_dict()}), 201


@board_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    post = BoardPost.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    if not _can_modify(user_id, post.author_id):
        return jsonify({'success': False, 'error': '권한이 없습니다.'}), 403
    payload, img = _post_payload()
    if payload['title']:
        post.title = payload['title']
    if payload['content']:
        post.content = payload['content']
    if img and img.filename:
        orig, _ = save_image(img, current_app.config['UPLOAD_FOLDER'])
        post.image = orig
    elif payload['remove_image']:
        post.image = None
    db.session.commit()
    return jsonify({'success': True, 'data': post.to_dict()})


@board_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    post = BoardPost.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    if not _can_modify(user_id, post.author_id):
        return jsonify({'success': False, 'error': '권한이 없습니다.'}), 403
    db.session.delete(post)
    db.session.commit()
    return jsonify({'success': True, 'data': {}})


@board_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    BoardPost.query.get_or_404(post_id)
    data = request.get_json()
    if not (data.get('content') or '').strip():
        return jsonify({'success': False, 'error': '내용을 입력하세요.'}), 400
    parent_id = data.get('parent_id')
    if parent_id:
        parent = BoardComment.query.filter_by(id=parent_id, post_id=post_id).first()
        if not parent:
            return jsonify({'success': False, 'error': '원본 댓글을 찾을 수 없습니다.'}), 404
        # 답글의 답글이면 최상위 부모로 평탄화 (대댓글은 1단계만)
        parent_id = parent.parent_id or parent.id
    comment = BoardComment(
        post_id=post_id,
        author_id=get_jwt_identity(),
        content=data['content'],
        parent_id=parent_id,
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'success': True, 'data': comment.to_dict()}), 201


@board_bp.route('/<int:post_id>/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(post_id, comment_id):
    comment = BoardComment.query.filter_by(id=comment_id, post_id=post_id).first_or_404()
    user_id = get_jwt_identity()
    if not _can_modify(user_id, comment.author_id):
        return jsonify({'success': False, 'error': '권한이 없습니다.'}), 403
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'success': True, 'data': {}})
