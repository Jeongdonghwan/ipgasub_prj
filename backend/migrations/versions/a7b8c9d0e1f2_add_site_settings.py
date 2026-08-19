"""create site_settings table

Revision ID: a7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2026-08-19 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7b8c9d0e1f2'
down_revision = 'f6a7b8c9d0e1'
branch_labels = None
depends_on = None


def upgrade():
    # 값이 없는 키는 코드의 기본값이 사용되므로 초기 데이터 삽입은 불필요
    op.create_table(
        'site_settings',
        sa.Column('key', sa.String(length=50), nullable=False),
        sa.Column('value', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('key'),
    )


def downgrade():
    op.drop_table('site_settings')
