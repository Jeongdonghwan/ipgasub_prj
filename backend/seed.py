# -*- coding: utf-8 -*-
"""배포 후 초기/데모 데이터 생성 (idempotent).
사용: (backend 디렉터리에서) python seed.py
"""
from app import create_app, db
from app.models.user import User
from app.models.board import BoardPost
from app.models.notice import Notice
from app.models.gallery import GalleryAlbum

app = create_app()
with app.app_context():
    # 1) 계정 ─────────────────────────────────────────────
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', name='관리자', role='admin', is_approved=True)
        admin.set_password('admin1234')
        db.session.add(admin)
        db.session.commit()
        print('admin 생성 → admin / admin1234')

    member = User.query.filter_by(username='test').first()
    if not member:
        member = User(username='test', name='테스트회원', role='member',
                      is_approved=True, phone='010-0000-0000')
        member.set_password('test1234')
        db.session.add(member)
        db.session.commit()
        print('test 회원 생성 → test / test1234')

    # 2) 게시판 ───────────────────────────────────────────
    BOARDS = {
        'ipga': (admin, [
            '2026년 협회 정기총회 개최 안내',
            '협회 사무국 이전 안내',
            '2026년도 정기이사회 결과 공고',
            '협회 정관 일부 개정 안내',
            '2026 상반기 회비 납부 안내',
            '신규 회원 가입 절차 변경 안내',
            '협회 로고 및 CI 사용 지침',
        ]),
        'news': (admin, [
            '국내 프로골프 투어 일정 발표',
            '골프 규칙 개정 사항 안내',
            '프로 투어 개막전 하이라이트',
            '골프 장비 트렌드 리포트',
            '해외 메이저 대회 결과',
            '국내 선수 세계랭킹 상승',
            '유망주 인터뷰',
        ]),
        'jobs': (member, [
            '골프연습장 프로 강사 모집',
            '파크골프장 관리 담당자 채용',
            '골프 아카데미 코치 모집',
            '대회 운영 스태프 단기 모집',
            '클럽하우스 프론트 직원 구인',
        ]),
        'market': (member, [
            '드라이버 판매합니다',
            '파크골프 클럽 세트 판매',
            '골프백 새제품 양도합니다',
            '퍼터 교환 원합니다',
            '연습장 회원권 양도',
        ]),
        'tour': (member, [
            '제주 골프투어 동반자 모집',
            '남해 파크골프 투어 동반자 모집',
            '가을 단풍 골프투어 안내',
            '주말 라운딩 조인 구합니다',
            '해외 골프투어 설명회',
        ]),
        'events': (member, [
            '회원 경조사 알림',
            '회원 자녀 결혼식 안내',
            '회원 승진 축하드립니다',
            '협회 창립기념 행사 안내',
            '정기 모임 일정 공지',
        ]),
    }
    added = 0
    for btype, (author, titles) in BOARDS.items():
        for t in titles:
            if not BoardPost.query.filter_by(board_type=btype, title=t).first():
                db.session.add(BoardPost(
                    board_type=btype, title=t,
                    content=f'{t}\n\n자세한 내용은 협회 사무국으로 문의 바랍니다.',
                    author_id=author.id))
                added += 1
    db.session.commit()
    if added:
        print(f'게시글 {added}건 생성')

    # 3) 대회안내(공지) ───────────────────────────────────
    NOTICES = [
        ('general', '정회원선발 테스트대회 안내', True),
        ('general', '전문인 골프대회 개최', False),
        ('general', '전국 아마추어 골프대회', False),
        ('general', '정회원 친선골프대회', False),
        ('general', '오픈 골프대회 참가 안내', False),
        ('general', '시니어부 골프대회 개최', False),
        ('general', '주니어 유망주 선발대회', False),
        ('general', '협회장배 골프대회', False),
        ('event', '2026 프로선수 선발전 공고', True),
        ('event', '프로선수 선발 실기평가 일정', False),
    ]
    n_added = 0
    for cat, title, pinned in NOTICES:
        if not Notice.query.filter_by(title=title).first():
            db.session.add(Notice(category=cat, title=title,
                                  content=f'{title}\n\n상세 일정 및 참가 방법은 사무국으로 문의 바랍니다.',
                                  author_id=admin.id, is_pinned=pinned))
            n_added += 1
    db.session.commit()
    if n_added:
        print(f'대회안내 {n_added}건 생성')

    # 4) 갤러리 앨범 ──────────────────────────────────────
    ALBUMS = [
        ('2026 정회원 선발전', '정회원 선발 테스트대회 현장'),
        ('협회장배 골프대회', '협회장배 대회 스케치'),
        ('파크골프 지도자 연수', '지도자 연수 과정'),
        ('전국 파크골프 페스티벌', '페스티벌 현장 사진'),
        ('아마추어 골프대회', '아마추어 대회 현장'),
    ]
    a_added = 0
    for t, d in ALBUMS:
        if not GalleryAlbum.query.filter_by(title=t).first():
            db.session.add(GalleryAlbum(title=t, description=d, author_id=admin.id))
            a_added += 1
    db.session.commit()
    if a_added:
        print(f'갤러리 앨범 {a_added}개 생성')

    print('시드 완료')
