from datetime import datetime
from .. import db

# 게시판 종류: ipga=IPGA게시판, news=골프뉴스(관리자 작성) / jobs·market·tour·events=커뮤니티(회원 작성)
VALID_BOARD_TYPES = {'ipga', 'news', 'jobs', 'market', 'tour', 'events'}
ADMIN_BOARDS = {'ipga', 'news'}


class BoardPost(db.Model):
    __tablename__ = 'board_posts'

    id = db.Column(db.Integer, primary_key=True)
    board_type = db.Column(db.String(20), nullable=False, server_default='ipga', index=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(500), default=None)   # 첨부 이미지 (상대경로)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = db.relationship('User', backref='posts')
    comments = db.relationship('BoardComment', backref='post', cascade='all, delete-orphan',
                               order_by='BoardComment.created_at')

    def to_dict(self, include_comments=False):
        d = {
            'id': self.id,
            'board_type': self.board_type,
            'title': self.title,
            'content': self.content,
            'image': self.image,
            'author_id': self.author_id,
            'author_name': self.author.name if self.author else '',
            'views': self.views,
            'comment_count': len(self.comments),
            'created_at': self.created_at.strftime('%Y.%m.%d'),
            'updated_at': self.updated_at.strftime('%Y.%m.%d'),
        }
        if include_comments:
            # 최상위 댓글만, 각 댓글에 답글(replies) 중첩
            top = [c for c in self.comments if c.parent_id is None]
            d['comments'] = [c.to_dict(with_replies=True) for c in top]
        return d


class BoardComment(db.Model):
    __tablename__ = 'board_comments'

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('board_posts.id', ondelete='CASCADE'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('board_comments.id', ondelete='CASCADE'), nullable=True)  # 대댓글 부모
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship('User', backref='comments')
    replies = db.relationship('BoardComment', backref=db.backref('parent', remote_side=[id]),
                              cascade='all, delete-orphan', order_by='BoardComment.created_at')

    def to_dict(self, with_replies=False):
        d = {
            'id': self.id,
            'post_id': self.post_id,
            'author_id': self.author_id,
            'author_name': self.author.name if self.author else '',
            'parent_id': self.parent_id,
            'content': self.content,
            'created_at': self.created_at.strftime('%Y.%m.%d'),
        }
        if with_replies:
            d['replies'] = [r.to_dict() for r in self.replies]
        return d
