"""add member fields (job/affiliation/position) and approval flag

Revision ID: a1b2c3d4e5f6
Revises: 5a89967ec597
Create Date: 2026-06-30 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '5a89967ec597'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('job', sa.String(length=50), nullable=True, server_default=''))
    op.add_column('users', sa.Column('affiliation', sa.String(length=100), nullable=True, server_default=''))
    op.add_column('users', sa.Column('position', sa.String(length=50), nullable=True, server_default=''))
    # server_default='0'(승인대기) 로 추가 — 신규 raw insert 시 안전 기본값.
    # ORM 가입은 모델 기본값(False)이 항상 전달되므로 동일하게 승인대기로 들어감.
    op.add_column('users', sa.Column('is_approved', sa.Boolean(), nullable=False, server_default=sa.text('0')))
    # 기존 가입 회원·관리자는 승인 완료 처리 (잠금 방지)
    op.execute('UPDATE users SET is_approved = 1')


def downgrade():
    op.drop_column('users', 'is_approved')
    op.drop_column('users', 'position')
    op.drop_column('users', 'affiliation')
    op.drop_column('users', 'job')
