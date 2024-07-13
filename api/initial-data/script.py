from sqlalchemy import text
from db import engine


def insert_into_dictionary(
    darija,
    english,
    arabic,
    type_,
    verified,
    views_number=0,
    source=None,
    family_id=None,
):
    """Insert into dictionary table"""
    # Raw SQL insert query
    raw_query = text(
        """
        INSERT INTO dictionary (darija, english, arabic, type, verified, views_number, source, family_id)
        VALUES (:darija, :english, :arabic, :type, :verified, :views_number, :source, :family_id)
    """
    )

    # Execute the raw SQL query
    with engine.connect() as connection:
        trans = connection.begin()
        try:
            connection.execute(
                raw_query,
                {
                    "darija": darija,
                    "english": english,
                    "arabic": arabic,
                    "type": type_,
                    "verified": verified,
                    "views_number": views_number,
                    "source": source,
                    "family_id": family_id,
                },
            )
            # Fetch the id of the inserted record
            inserted_id = trans.lastrowid
            trans.commit()
            return inserted_id
        except:
            trans.rollback()
            raise


if __name__ == "__main__":
    # Insert a new dictionary entry
    insert_into_dictionary(
        darija="mi7fada",
        english="bag",
        arabic="",
        type_="noun",
        verified=False,
        views_number=10,
        source="initial",
        family_id=None,
    )
    print("Data inserted successfully.")
