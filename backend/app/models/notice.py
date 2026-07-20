from datetime import datetime
from .. import db


class Notice(db.Model):
    __tablename__ = 'notices'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Enum('general', 'event'), default='general', nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    thumbnail = db.Column(db.String(500), default=None)   # 대표 썸네일 (상대경로)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_pinned = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = db.relationship('User', backref='notices')

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'title': self.title,
            'content': self.content,
            'thumbnail': self.thumbnail,
            'author_id': self.author_id,
            'author_name': self.author.name if self.author else '',
            'is_pinned': self.is_pinned,
            'views': self.views,
            'created_at': self.created_at.strftime('%Y.%m.%d'),
            'updated_at': self.updated_at.strftime('%Y.%m.%d'),
        }
