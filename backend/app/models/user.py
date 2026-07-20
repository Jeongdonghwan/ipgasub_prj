from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .. import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), default='')
    residence = db.Column(db.String(50), default='')     # 거주지(구)
    age_group = db.Column(db.String(20), default='')     # 나이대
    gender = db.Column(db.String(10), default='')        # 성별
    role = db.Column(db.Enum('admin', 'member'), default='member', nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)  # 관리자 승인 여부
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'phone': self.phone,
            'residence': self.residence,
            'age_group': self.age_group,
            'gender': self.gender,
            'role': self.role,
            'is_active': self.is_active,
            'is_approved': self.is_approved,
            'created_at': self.created_at.strftime('%Y.%m.%d'),
        }
