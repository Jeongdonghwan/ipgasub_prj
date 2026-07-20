from datetime import datetime
from .. import db


class GalleryAlbum(db.Model):
    __tablename__ = 'gallery_albums'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    cover_image = db.Column(db.String(500))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship('User', backref='albums')
    photos = db.relationship('GalleryPhoto', backref='album', cascade='all, delete-orphan',
                             order_by='GalleryPhoto.sort_order')

    def to_dict(self, include_photos=False):
        d = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'cover_image': self.cover_image,
            'author_id': self.author_id,
            'author_name': self.author.name if self.author else '',
            'photo_count': len(self.photos),
            'created_at': self.created_at.strftime('%Y.%m.%d'),
        }
        if include_photos:
            d['photos'] = [p.to_dict() for p in self.photos]
        return d


class GalleryPhoto(db.Model):
    __tablename__ = 'gallery_photos'

    id = db.Column(db.Integer, primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('gallery_albums.id', ondelete='CASCADE'), nullable=False)
    original = db.Column(db.String(500), nullable=False)
    thumbnail = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.String(200), default='')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'album_id': self.album_id,
            'original': self.original,
            'thumbnail': self.thumbnail,
            'caption': self.caption,
            'sort_order': self.sort_order,
            'created_at': self.created_at.strftime('%Y.%m.%d'),
        }
