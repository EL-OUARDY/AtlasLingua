from app import ma


class HistorySchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    source_language = ma.String(required=True)
    processed_by = ma.String(required=False)
    user_id = ma.Integer(required=False)


history_schema = HistorySchema()
histories_schema = HistorySchema(many=True)
