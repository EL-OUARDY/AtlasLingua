from flask import abort
from sqlalchemy import desc, or_
from app.models.dictionary import Dictionary
from app.models.favorite import Favorite
from app.models.user import User
from app import db
from app.schemas.favorite_schema import favorite_schema
from app.schemas.dictionary_schema import dictionary_schema


class FavoriteService:
    @staticmethod
    def get_user_favorites(user_id, search):
        user = User.query.get(user_id)
        if not user:
            abort(404, "User Not Found!")

        favorites = (
            Favorite.query.filter(
                Favorite.user_id == user_id,
                or_(
                    Favorite.darija.ilike(f"%{search}%"),
                    Favorite.english.ilike(f"%{search}%"),
                    Favorite.arabic.ilike(f"%{search}%"),
                ),
            )
            .order_by(desc(Favorite.created_at))
            .limit(50)  # pagination will be implemented later
            .all()
        )

        if not favorites:
            return []

        return favorites

    @staticmethod
    def add_favorite(english, darija, arabic, verified, word_type, user_id):
        try:
            favorite = Favorite(
                english=english,
                darija=darija,
                arabic=arabic,
                verified=verified,
                word_type=word_type,
                user_id=user_id,
            )
            db.session.add(favorite)
            db.session.commit()
            return favorite
        except:
            return abort(400, description="Bad Request")

    @staticmethod
    def add_favorite_from_dictionary(dictionary_id, user_id):
        dictionary = Dictionary.query.filter(
            Dictionary.id == dictionary_id
        ).first()

        if not dictionary:
            abort(404, description="Not Found")  # dictionary not found

        dictionary = dictionary_schema.dump(dictionary)

        try:
            favorite = Favorite(
                english=dictionary["english"],
                darija=dictionary["darija"],
                arabic=dictionary["arabic"],
                verified=dictionary["verified"],
                word_type=dictionary["word_type"],
                user_id=user_id,
                dictionary_id=dictionary_id,
            )
            db.session.add(favorite)
            db.session.commit()
            return favorite
        except:
            return abort(400, description="Bad Request")

    @staticmethod
    def remove_favorite(favorite_id, user_id):
        favorite = Favorite.query.get(favorite_id)

        if favorite:
            if favorite.user_id != user_id:
                abort(401, description="Unauthorized Action")

            # remove the favorite from the session
            db.session.delete(favorite)

            # commit the changes to the database
            db.session.commit()
            return True
        else:
            abort(404, description="Not Found")  # favorite not found

    @staticmethod
    def remove_dictionary_favorite(dictionary_id, user_id):
        favorite = Favorite.query.filter(
            Favorite.dictionary_id == dictionary_id,
        ).first()

        if favorite:
            if favorite.user_id != user_id:
                abort(401, description="Unauthorized Action")

            # remove the favorite from the session
            db.session.delete(favorite)

            # commit the changes to the database
            db.session.commit()
            return True
        else:
            abort(404, description="Not Found")  # favorite not found
