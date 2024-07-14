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

    data = [
        {"file": "./files/syntactic/nouns.csv", "word_type": "noun"},
        {"file": "./files/syntactic/verbs.csv", "word_type": "verb"},
        {"file": "./files/syntactic/adjectives.csv", "word_type": "adjective"},
        {"file": "./files/syntactic/adverbs.csv", "word_type": "adverb"},
        {
            "file": "./files/syntactic/prepositions.csv",
            "word_type": "preposition",
        },
        {"file": "./files/syntactic/pronouns.csv", "word_type": "pronoun"},
    ]

    for d in data:
        rown_inserted = 0
        csv_file = d["file"]
        _type = d["word_type"]

        with open(csv_file, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Insert a new dictionary entry
                f_id = None
                for col in range(1, 10):
                    if row.get(f"n{col}"):
                        id = insert_into_dictionary(
                            darija=row[f"n{col}"],
                            english=row["eng"],
                            arabic=row["darija_ar"],
                            word_type=_type,
                            category="",
                            verified=True,
                            popularity=0,
                            source="initial",
                            group_id=f_id,
                        )
                        rown_inserted += 1
                    # get group_id from the first added record
                    f_id = id if f_id is None else f_id

        print(f"{rown_inserted} records has been inserted from {csv_file}")
