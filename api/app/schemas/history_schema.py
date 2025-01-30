from app import ma
from marshmallow import fields


class HistorySchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    arabic = ma.String(required=False)
    source_language = ma.String(required=True)
    created_at = ma.String(dump_only=True)
    shareable_link = ma.String(dump_only=True)


class PaginatedHistorySchema(ma.Schema):
    page = fields.Int()
    per_page = fields.Int()
    total = fields.Int()
    pages = fields.Int()
    items = fields.List(fields.Nested(HistorySchema))


history_schema = HistorySchema()
histories_schema = HistorySchema(many=True)
paginated_history_schema = PaginatedHistorySchema()
