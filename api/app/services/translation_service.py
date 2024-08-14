from app.models.dictionary import Dictionary
from app.models.history import History
from app.schemas.history_schema import history_schema
from app.schemas.dictionary_schema import dictionaries_schema, dictionary_schema
from app.services.history_service import HistoryService
from app.services.language_model import LanguageModel
from app.utils.helpers import split_to_words
from app.utils.shared import LanguagesEnum


class TranslationService:
    @staticmethod
    def translate(text, source, destination):

        # check if text is too long => process with summarization function

        # check verified entries from database
        entries = TranslationService.get_entries(
            text, source, verified=True, writing_variants=False
        )
        if entries:
            translation = [
                {
                    "translation": entry[destination],
                    "verified": entry["verified"],
                    "wordType": entry["word_type"],
                }
                for entry in entries
            ]

            # save in history
            if source == LanguagesEnum.ENGLISH.value:
                translation_id, shareable_link = HistoryService.save(
                    source_language=source,
                    english=text,
                    darija=TranslationService.stringify(translation),
                )
            else:
                translation_id, shareable_link = HistoryService.save(
                    source_language=source,
                    english=TranslationService.stringify(translation),
                    darija=text,
                )

            return {
                "id": translation_id,
                "link": shareable_link,
                "translation": translation,
            }

        # use language model
        # prepare helpful data to the language model
        # feed = TranslationService.get_llm_feed(text, source, destination)

        # call language model
        llm = LanguageModel()
        result = llm.translate(
            text_to_translate=text,
            source=source,
            destination=destination,
        )
        if result:
            return {
                "id": result["id"],
                "link": result["link"],
                "translation": [
                    {"translation": result["translation"], "verified": False}
                ],
            }
        return None

    @staticmethod
    def get_entry(text, source, verified=False):
        filter_attribute = (
            "english" if source == LanguagesEnum.ENGLISH.value else "darija"
        )
        filter = {filter_attribute: text}
        if verified:
            filter["verified"] = True

        result = Dictionary.query.filter_by(**filter).first()

        return dictionary_schema.dump(result)

    @staticmethod
    def get_entries(text, source, verified=False, writing_variants=True):
        filter_attribute = (
            "english" if source == LanguagesEnum.ENGLISH.value else "darija"
        )
        filter = {filter_attribute: text}
        if verified:
            filter["verified"] = True

        if not writing_variants:
            filter["group_id"] = None

        result = Dictionary.query.filter_by(**filter)

        return dictionaries_schema.dump(result)

    @staticmethod
    def get_feed_entries(text, source):
        filter_attribute = (
            "english" if source == LanguagesEnum.ENGLISH.value else "darija"
        )
        result = Dictionary.query.filter_by(
            **{filter_attribute: text}
        ).with_entities(Dictionary.english, Dictionary.darija)

        return dictionaries_schema.dump(result)

    @staticmethod
    def get_llm_feed(text, source, destination):
        # check if the target text exists in the database
        entry = TranslationService.get_entry(text, source)
        if entry:
            return {text: entry.get(destination)}

        # get word by word
        words = split_to_words(text)
        feed = {}

        for word in words:
            if word not in feed:  # avoid duplicates
                entries = TranslationService.get_feed_entries(word, source)
                if entries:
                    feed[word] = []
                    for entry in entries:
                        if entry.get(destination) not in feed[word]:
                            feed[word].append(entry.get(destination))

        return feed

    @staticmethod
    def get_shared_translation(shareable_link):
        result = history_schema.dump(
            History.query.filter_by(shareable_link=shareable_link).first()
        )

        return result

    @staticmethod
    def stringify(translation):
        result = []
        for curr in translation:
            item = curr["translation"]
            if curr.get("wordType"):
                item += f" ({curr['wordType']})"
            result.append(item)
        return " | ".join(result)
