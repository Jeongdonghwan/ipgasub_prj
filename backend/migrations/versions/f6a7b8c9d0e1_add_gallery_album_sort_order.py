"""add sort_order column to gallery_albums

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-08-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f6a7b8c9d0e1'
down_revision = 'e5f6a7b8c9d0'
branch_labels = None
depends_on = None


def upgrade():
    # 기존 앨범은 0으로 backfill → 정렬 2순위(created_at desc)가 유지되어 노출 순서 변화 없음
    op.add_column(
        'gallery_albums',
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
    )


def downgrade():
    op.drop_column('gallery_albums', 'sort_order')
