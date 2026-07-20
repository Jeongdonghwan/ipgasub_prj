"""swap member fields (job/affiliation/position -> residence/age_group/gender) and add notice thumbnail

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-07-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # users: 직업/소속/직책 제거 → 거주지(구)/나이대/성별 추가 (SQLite 호환 위해 batch)
    with op.batch_alter_table('users') as batch:
        batch.add_column(sa.Column('residence', sa.String(length=50), nullable=True, server_default=''))
        batch.add_column(sa.Column('age_group', sa.String(length=20), nullable=True, server_default=''))
        batch.add_column(sa.Column('gender', sa.String(length=10), nullable=True, server_default=''))
        batch.drop_column('job')
        batch.drop_column('affiliation')
        batch.drop_column('position')
    # notices: 대표 썸네일 컬럼 추가
    op.add_column('notices', sa.Column('thumbnail', sa.String(length=500), nullable=True))


def downgrade():
    op.drop_column('notices', 'thumbnail')
    with op.batch_alter_table('users') as batch:
        batch.add_column(sa.Column('job', sa.String(length=50), nullable=True, server_default=''))
        batch.add_column(sa.Column('affiliation', sa.String(length=100), nullable=True, server_default=''))
        batch.add_column(sa.Column('position', sa.String(length=50), nullable=True, server_default=''))
        batch.drop_column('gender')
        batch.drop_column('age_group')
        batch.drop_column('residence')
