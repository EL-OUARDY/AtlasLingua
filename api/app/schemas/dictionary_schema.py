from app import ma


class DictionarySchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    type = ma.String()
    category = ma.String()
    verified = ma.Boolean(required=True)
    popularity = ma.Integer(required=True)
    source = ma.String()
    group_id = ma.Integer()


dictionary_schema = DictionarySchema()
dictionaries_schema = DictionarySchema(many=True)
