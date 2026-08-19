from .. import db

# 사이트 설정 기본값 — DB에 값이 없으면 이 값이 사용된다.
DEFAULT_SETTINGS = {
    'footer_org_name': '대한민국골프&파크기술협회',
    'footer_reg_number': '(2026-전남광주통합특별시-1호)',
    'footer_tagline': '건강한 골프 문화와 파크골프 기술의\n발전을 함께합니다.',
    'footer_address': '전남광주통합특별시 광산구 상무대로 104\n(도산동, 해송빌딩)',
    'footer_ceo': '김광만',
    'footer_phone': '062-945-9015',
    'footer_email': 'info@kgpta.or.kr',
    'footer_copyright': '© 2026 사단법인 대한민국골프&파크기술협회. All rights reserved.',
}


class SiteSetting(db.Model):
    """key-value 사이트 설정 (푸터 연락처 등)."""
    __tablename__ = 'site_settings'

    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.Text, default='')

    @staticmethod
    def all_as_dict():
        """기본값 위에 DB 저장값을 덮어써서 반환."""
        data = dict(DEFAULT_SETTINGS)
        for row in SiteSetting.query.all():
            if row.key in DEFAULT_SETTINGS:
                data[row.key] = row.value or ''
        return data
