from app import ma


class DictionarySchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    arabic = ma.String(required=True)
    word_type = ma.String(required=False)
    category = ma.String(required=False)
    verified = ma.Boolean(required=True)


dictionary_schema = DictionarySchema()
dictionaries_schema = DictionarySchema(many=True)
