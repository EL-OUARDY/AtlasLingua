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
        {"file": "./files/semantic/family.csv", "category": "family"},
        {"file": "./files/semantic/education.csv", "category": "education"},
        {"file": "./files/semantic/clothes.csv", "category": "clothes"},
        {"file": "./files/semantic/food.csv", "category": "food"},
        {"file": "./files/semantic/colors.csv", "category": "colors"},
        {"file": "./files/semantic/sport.csv", "category": "sports"},
        {"file": "./files/semantic/numbers.csv", "category": "numbers"},
        {"file": "./files/semantic/health.csv", "category": "health"},
        {"file": "./files/semantic/animals.csv", "category": "animals"},
        {"file": "./files/semantic/places.csv", "category": "places"},
        {"file": "./files/semantic/religion.csv", "category": "religion"},
        {"file": "./files/semantic/time.csv", "category": "time"},
        {"file": "./files/semantic/emotions.csv", "category": "emotions"},
        {"file": "./files/semantic/environment.csv", "category": "environment"},
        {"file": "./files/semantic/economy.csv", "category": "economy"},
        {"file": "./files/semantic/professions.csv", "category": "professions"},
        {"file": "./files/semantic/body.csv", "category": "body"},
        {"file": "./files/semantic/plants.csv", "category": "plants"},
        {"file": "./files/semantic/art.csv", "category": "art"},
    ]

    for d in data:
        rown_inserted = 0
        csv_file = d["file"]
        file_category = d["category"]

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
                            word_type="noun",
                            category=file_category,
                            verified=True,
                            popularity=0,
                            source=f"initial_semantic_{file_category}",
                            group_id=f_id,
                        )
                        rown_inserted += 1
                    # get group_id from the first added record
                    f_id = id if f_id is None else f_id

        print(f"{rown_inserted} records has been inserted from {csv_file}")
