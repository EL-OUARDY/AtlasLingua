from firebase_admin import auth


class FirebaseService:
    @staticmethod
    def create_custom_token(user_id):
        """
        Generate a Firebase custom token using the user's ID
        :param
            user_id: User ID
        """
        custom_token = auth.create_custom_token(user_id)
        return custom_token.decode("utf-8")
