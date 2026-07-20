"""
관리자 계정 생성 스크립트
사용법: cd backend && python seed_admin.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    existing = User.query.filter_by(username='admin').first()
    if existing:
        print('이미 admin 계정이 존재합니다.')
    else:
        admin = User(
            username='admin',
            name='관리자',
            phone='031-000-0000',
            role='admin'
        )
        admin.set_password('admin1234')
        db.session.add(admin)
        db.session.commit()
        print('✅ 관리자 계정 생성 완료')
        print('   아이디: admin')
        print('   비밀번호: admin1234')
        print('   ⚠️  배포 전 반드시 비밀번호 변경하세요!')
