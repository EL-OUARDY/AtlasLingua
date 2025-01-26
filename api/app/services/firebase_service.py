from firebase_admin import auth, firestore

# Initialize Firestore
db_firestore = firestore.client()


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

    @staticmethod
    def set_user(user, update=False):
        try:
            doc_ref = db_firestore.collection("users").document(str(user.id))
            doc = doc_ref.get()

            if doc.exists and not update:
                # Document exists and update is not requested
                return

            db_firestore.collection("users").document(str(user.id)).set(
                {
                    key: value
                    for key, value in vars(user).items()
                    if not key.startswith("_") and key != "password"
                }
            )

        except Exception as e:
            print(f"Error saving user to Firebase: {e}")
