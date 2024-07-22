from app.models.dictionary import Dictionary
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
                    "id": entry["id"],
                    "translation": entry[destination],
                    "verified": entry["verified"],
                    "wordType": entry["word_type"],
                }
                for entry in entries
            ]

            # save in history
            if source == LanguagesEnum.ENGLISH.value:
                HistoryService.save(
                    source_language=source,
                    english=text,
                    darija=translation[0]["translation"],
                )
            else:
                HistoryService.save(
                    source_language=source,
                    english=translation[0]["translation"],
                    darija=text,
                )

            return translation

        # use language model
        # prepare helpfull data to the language model
        feed = TranslationService.get_llm_feed(text, source, destination)
        # call language model
        llm = LanguageModel()
        translation = llm.translate(
            text_to_translate=text,
            source=source,
            destination=destination,
            feed=feed,
        )
        if translation:
            return [{"translation": translation, "verified": False}]
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
