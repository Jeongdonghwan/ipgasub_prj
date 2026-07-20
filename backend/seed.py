"""배포 후 관리자 계정 생성용 (idempotent).
사용: (backend 디렉터리에서) python seed.py
"""
from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    if not User.query.filter_by(username='admin').first():
        u = User(username='admin', name='관리자', role='admin', is_approved=True)
        u.set_password('admin1234')
        db.session.add(u)
        db.session.commit()
        print('admin 계정 생성 완료 → 아이디: admin / 비밀번호: admin1234')
    else:
        print('admin 계정이 이미 존재합니다.')
