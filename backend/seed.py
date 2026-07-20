# -*- coding: utf-8 -*-
"""배포 후 초기 데이터 생성용 (idempotent).
사용: (backend 디렉터리에서) python seed.py
- admin 계정 + 테스트 회원 + 게시판별 샘플 글/대회안내 샘플
"""
from app import create_app, db
from app.models.user import User
from app.models.board import BoardPost
from app.models.notice import Notice

app = create_app()
with app.app_context():
    # 1) 계정
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', name='관리자', role='admin', is_approved=True)
        admin.set_password('admin1234')
        db.session.add(admin)
        db.session.commit()
        print('admin 계정 생성 → admin / admin1234')
    else:
        print('admin 계정 존재')

    if not User.query.filter_by(username='test').first():
        t = User(username='test', name='테스트회원', role='member', is_approved=True,
                 phone='010-0000-0000')
        t.set_password('test1234')
        db.session.add(t)
        db.session.commit()
        print('test 회원 생성 → test / test1234')

    # 2) 게시판 샘플 (게시판이 비어있을 때만)
    if BoardPost.query.count() == 0:
        member = User.query.filter_by(username='test').first() or admin
        samples = [
            ('ipga',   '2026년 IPGA 정기총회 개최 안내', 'IPGA 정기총회를 개최합니다. 회원 여러분의 많은 참석 바랍니다.', admin),
            ('ipga',   '협회 사무국 이전 안내', '협회 사무국이 이전하였습니다. 오시는 길을 확인해 주세요.', admin),
            ('news',   '국내 프로골프 투어 일정 발표', '2026 시즌 국내 프로골프 투어 일정이 발표되었습니다.', admin),
            ('news',   '골프 규칙 개정 사항 안내', '올해부터 적용되는 골프 규칙 개정 사항을 안내드립니다.', admin),
            ('jobs',   '골프연습장 프로 강사 모집', '주말 근무 가능한 프로 강사님을 모집합니다.', member),
            ('market', '드라이버 판매합니다', '시타만 한 드라이버 판매합니다. 상태 좋습니다.', member),
            ('tour',   '제주 골프투어 동반자 모집', '3박 4일 제주 골프투어 함께 하실 분 구합니다.', member),
            ('events', '회원 경조사 알림', '회원 경조사 소식을 알려드립니다.', member),
        ]
        for btype, title, content, author in samples:
            db.session.add(BoardPost(board_type=btype, title=title, content=content, author_id=author.id))
        db.session.commit()
        print(f'게시판 샘플 {len(samples)}건 생성')

    # 3) 대회안내 샘플 (없을 때만)
    if Notice.query.count() == 0:
        notices = [
            ('general', '정회원선발 테스트대회 안내', '정회원 선발 테스트대회 일정을 안내드립니다.', True),
            ('general', '전문인 골프대회 개최', '전문인 골프대회가 개최됩니다.', False),
            ('general', 'IPGA배 아마추어 골프대회', 'IPGA배 아마추어 골프대회 참가 접수를 받습니다.', False),
            ('general', '정회원 친선골프대회', '정회원 친선골프대회를 개최합니다.', False),
            ('event',   '2026 프로선수 선발전 공고', '2026년 프로선수 선발전 공고입니다.', True),
        ]
        for cat, title, content, pinned in notices:
            db.session.add(Notice(category=cat, title=title, content=content,
                                  author_id=admin.id, is_pinned=pinned))
        db.session.commit()
        print(f'대회안내 샘플 {len(notices)}건 생성')

    print('시드 완료')
