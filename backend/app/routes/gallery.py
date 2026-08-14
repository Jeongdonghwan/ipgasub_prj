from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity
from .. import db
from ..models.gallery import GalleryAlbum, GalleryPhoto
from ..utils.auth_helpers import admin_required
from ..utils.image_utils import save_image, delete_image

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
        author_id=int(get_jwt_identity()),
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
    # 기존 사진 순서 뒤에 이어붙임 (배치마다 0부터 시작하면 순서 충돌)
    max_order = db.session.query(
        db.func.coalesce(db.func.max(GalleryPhoto.sort_order), -1)
    ).filter(GalleryPhoto.album_id == album_id).scalar()
    saved = []
    for i, file in enumerate(files):
        orig, thumb = save_image(file, upload_folder)
        photo = GalleryPhoto(
            album_id=album_id,
            original=orig,
            thumbnail=thumb,
            caption=file.filename,
            sort_order=max_order + 1 + i,
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
    upload_folder = current_app.config['UPLOAD_FOLDER']
    for p in album.photos:
        delete_image(p.original, upload_folder)
        delete_image(p.thumbnail, upload_folder)
    db.session.delete(album)
    db.session.commit()
    return jsonify({'success': True, 'data': {}})


@gallery_bp.route('/<int:album_id>/photos/<int:photo_id>', methods=['DELETE'])
@admin_required
def delete_photo(album_id, photo_id):
    photo = GalleryPhoto.query.filter_by(id=photo_id, album_id=album_id).first_or_404()
    album = photo.album
    upload_folder = current_app.config['UPLOAD_FOLDER']
    delete_image(photo.original, upload_folder)
    delete_image(photo.thumbnail, upload_folder)
    was_cover = (album.cover_image == photo.thumbnail)
    db.session.delete(photo)
    db.session.flush()
    if was_cover:
        remaining = GalleryPhoto.query.filter_by(album_id=album_id) \
            .order_by(GalleryPhoto.sort_order).first()
        album.cover_image = remaining.thumbnail if remaining else None
    db.session.commit()
    return jsonify({'success': True, 'data': {'cover_image': album.cover_image}})


@gallery_bp.route('/<int:album_id>/photos/order', methods=['PATCH'])
@admin_required
def reorder_photos(album_id):
    GalleryAlbum.query.get_or_404(album_id)
    order = (request.get_json() or {}).get('order')
    if not isinstance(order, list) or not all(isinstance(i, int) for i in order):
        return jsonify({'success': False, 'error': '잘못된 요청입니다.'}), 400
    photos = {p.id: p for p in GalleryPhoto.query.filter_by(album_id=album_id).all()}
    if set(order) != set(photos.keys()):
        return jsonify({'success': False, 'error': '사진 목록이 변경되었습니다. 새로고침 후 다시 시도하세요.'}), 409
    for idx, pid in enumerate(order):
        photos[pid].sort_order = idx
    db.session.commit()
    return jsonify({'success': True, 'data': {}})
