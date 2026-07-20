"""add board_type to board_posts, create registration/certificate request tables

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-07-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5f6a7b8c9d0'
down_revision = 'd4e5f6a7b8c9'
branch_labels = None
depends_on = None


def upgrade():
    # board_posts.board_type — server_default 로 기존 행 'ipga' backfill
    with op.batch_alter_table('board_posts') as batch:
        batch.add_column(sa.Column('board_type', sa.String(length=20), nullable=False, server_default='ipga'))
        batch.create_index('ix_board_posts_board_type', ['board_type'])

    op.create_table(
        'registration_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=True),
        sa.Column('birth', sa.String(length=20), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'certificate_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('cert_type', sa.String(length=30), nullable=False),
        sa.Column('purpose', sa.String(length=200), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade():
    op.drop_table('certificate_requests')
    op.drop_table('registration_requests')
    with op.batch_alter_table('board_posts') as batch:
        batch.drop_index('ix_board_posts_board_type')
        batch.drop_column('board_type')
