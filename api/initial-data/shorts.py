from sqlalchemy import text
from db import engine
import csv
from datetime import datetime


def insert_into_dictionary(
    darija,
    english,
    arabic,
    word_type,
    category,
    verified,
    popularity=0,
    source=None,
    group_id=None,
):
    """Insert into dictionary table"""

    # Raw SQL insert query
    raw_query = text(
        """
        INSERT INTO dictionary (darija, english, arabic, word_type, category, verified, popularity, source, group_id, created_at, updated_at)
        VALUES (:darija, :english, :arabic, :word_type, :category, :verified, :popularity, :source, :group_id, :created_at, :updated_at)
        """
    )

    # Execute the raw SQL query
    with engine.connect() as connection:
        trans = connection.begin()
        try:
            result = connection.execute(
                raw_query,
                {
                    "darija": darija,
                    "english": english,
                    "arabic": arabic,
                    "word_type": word_type,
                    "category": category,
                    "verified": verified,
                    "popularity": popularity,
                    "source": source,
                    "group_id": group_id,
                    "created_at": datetime.now(),
                    "updated_at": datetime.now(),
                },
            )
            # Fetch the id of the inserted record
            inserted_id = result.lastrowid
            trans.commit()
            return inserted_id
        except:
            trans.rollback()
            raise


if __name__ == "__main__":

    rown_inserted = 0
    csv_file = "./files/x-tra/shorts.csv"

    with open(csv_file, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Insert a new dictionary entry
            id = insert_into_dictionary(
                darija=row["darija"],
                english=row["english"],
                arabic=row["darija_ar"],
                word_type=None,
                category=None,
                verified=True,
                popularity=0,
                source="initial",
                group_id=None,
            )
            rown_inserted += 1

    print(f"{rown_inserted} records has been inserted from {csv_file}")