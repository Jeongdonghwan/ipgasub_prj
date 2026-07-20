"""add parent_id to board_comments (nested replies)

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-07-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c3d4e5f6a7b8'
down_revision = 'b2c3d4e5f6a7'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('board_comments') as batch:
        batch.add_column(sa.Column('parent_id', sa.Integer(), nullable=True))
        batch.create_foreign_key(
            'fk_board_comments_parent', 'board_comments',
            ['parent_id'], ['id'], ondelete='CASCADE',
        )


def downgrade():
    with op.batch_alter_table('board_comments') as batch:
        batch.drop_constraint('fk_board_comments_parent', type_='foreignkey')
        batch.drop_column('parent_id')
