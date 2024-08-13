from app import ma


class HistorySchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    source_language = ma.String(required=True)
    created_at = ma.String(dump_only=True)
    shareable_link = ma.String(dump_only=True)


history_schema = HistorySchema()
histories_schema = HistorySchema(many=True)
