from datetime import datetime
from .. import db


class RegistrationRequest(db.Model):
    """회원등록신청서 (비회원도 제출 가능 → 관리자 확인)"""
    __tablename__ = 'registration_requests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), default='')
    birth = db.Column(db.String(20), default='')       # 생년월일
    content = db.Column(db.Text, default='')           # 신청 내용/경력 등
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending|done|rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'birth': self.birth,
            'content': self.content,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y.%m.%d'),
        }


class CertificateRequest(db.Model):
    """증명서발급 신청 (로그인 회원 전용)"""
    __tablename__ = 'certificate_requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cert_type = db.Column(db.String(30), nullable=False)   # membership|career|award
    purpose = db.Column(db.String(200), default='')        # 발급 용도
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending|issued|rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='certificate_requests')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else '',
            'username': self.user.username if self.user else '',
            'cert_type': self.cert_type,
            'purpose': self.purpose,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y.%m.%d'),
        }
