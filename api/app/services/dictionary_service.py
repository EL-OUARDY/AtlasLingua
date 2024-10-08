from flask import jsonify
from sqlalchemy import or_, and_
from app.models.dictionary import Dictionary
from app.schemas.dictionary_schema import dictionaries_schema


class DictionaryService:
    @staticmethod
    def get_list(
        page, per_page, sort_by, sort_order, filters_dict, search, types_list
    ):
        query = Dictionary.query

        # Apply search
        if search:
            _filter = or_(
                # Dictionary.darija.ilike(f"{search}%"),
                Dictionary.english.ilike(f"{search}%"),
                # Dictionary.arabic.ilike(f"{search}%"),
            )
            query = query.filter(_filter)
        else:
            query = query.filter(
                and_(
                    Dictionary.group_id.is_(None),
                    Dictionary.word_type.isnot(None),
                )
            )

        # Apply filters
        for column, value in filters_dict.items():
            if hasattr(Dictionary, column):
                query = query.filter(
                    getattr(Dictionary, column).ilike(f"%{value}%")
                )

        # Filter by word types
        if types_list:
            query = query.filter(Dictionary.word_type.in_(types_list))

        # Apply sorting
        if hasattr(Dictionary, sort_by):
            order_column = getattr(Dictionary, sort_by)
            if sort_order == "desc":
                order_column = order_column.desc()
            query = query.order_by(order_column)

        # Apply pagination
        paginated_query = query.paginate(
            page=page, per_page=per_page, error_out=False
        )

        # Convert to dictionary
        result = dictionaries_schema.dump(paginated_query.items)

        return jsonify(
            {
                "page": paginated_query.page,
                "perPage": paginated_query.per_page,
                "total": paginated_query.total,
                "pageCount": paginated_query.pages,
                "data": result,
            }
        )

    @staticmethod
    def get_category(cat):
        return Dictionary.query.filter_by(category=cat, group_id=None)

    @staticmethod
    def get_word_writings(word_id):
        """This will return a word and its different ways of writing"""
        return Dictionary.query.filter(
            or_(Dictionary.id == word_id, Dictionary.group_id == word_id)
        ).all()
