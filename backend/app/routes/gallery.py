from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity
from .. import db
from ..models.gallery import GalleryAlbum, GalleryPhoto
from ..utils.auth_helpers import admin_required
from ..utils.image_utils import save_image

gallery_bp = Blueprint('gallery', __name__)


@gallery_bp.route('/', methods=['GET'])
def list_albums():
    page = request.args.get('page', 1, type=int)
    per_page = 12
    pagination = GalleryAlbum.query.order_by(GalleryAlbum.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify({
        'success': True,
        'data': {
            'items': [a.to_dict() for a in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'page': page,
        }
    })


@gallery_bp.route('/<int:album_id>', methods=['GET'])
def get_album(album_id):
    album = GalleryAlbum.query.get_or_404(album_id)
    return jsonify({'success': True, 'data': album.to_dict(include_photos=True)})


@gallery_bp.route('/', methods=['POST'])
@admin_required
def create_album():
    data = request.get_json()
    album = GalleryAlbum(
        title=data['title'],
        description=data.get('description', ''),
        author_id=get_jwt_identity(),
    )
    db.session.add(album)
    db.session.commit()
    return jsonify({'success': True, 'data': album.to_dict()}), 201


@gallery_bp.route('/<int:album_id>/photos', methods=['POST'])
@admin_required
def upload_photos(album_id):
    album = GalleryAlbum.query.get_or_404(album_id)
    files = request.files.getlist('photos')
    if not files:
        return jsonify({'success': False, 'error': '사진을 선택하세요.'}), 400

    upload_folder = current_app.config['UPLOAD_FOLDER']
    saved = []
    for i, file in enumerate(files):
        orig, thumb = save_image(file, upload_folder)
        photo = GalleryPhoto(
            album_id=album_id,
            original=orig,
            thumbnail=thumb,
            caption=file.filename,
            sort_order=i,
        )
        db.session.add(photo)
        saved.append(photo)

    # 첫 사진을 커버로 설정 (커버 없을 때)
    if not album.cover_image and saved:
        album.cover_image = saved[0].thumbnail

    db.session.commit()
    return jsonify({'success': True, 'data': [p.to_dict() for p in saved]}), 201


@gallery_bp.route('/<int:album_id>', methods=['DELETE'])
@admin_required
def delete_album(album_id):
    album = GalleryAlbum.query.get_or_404(album_id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({'success': True, 'data': {}})
