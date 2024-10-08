"""Update dictionary add category column

Revision ID: c966e70b4760
Revises: a1804956e896
Create Date: 2024-07-13 14:30:40.970714

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c966e70b4760'
down_revision = 'a1804956e896'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dictionary', schema=None) as batch_op:
        batch_op.add_column(sa.Column('category', sa.Enum('family', 'education', 'clothes', 'food', 'colors', 'sports', 'numbers', 'health', 'animals', 'places', 'religion', 'time', 'emotions', 'nature', 'objects', 'planets', 'professions', 'body', 'plants'), nullable=True))
        batch_op.add_column(sa.Column('popularity', sa.Integer(), nullable=False))
        batch_op.drop_column('views_number')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dictionary', schema=None) as batch_op:
        batch_op.add_column(sa.Column('views_number', mysql.INTEGER(), autoincrement=False, nullable=False))
        batch_op.drop_column('popularity')
        batch_op.drop_column('category')

    # ### end Alembic commands ###
