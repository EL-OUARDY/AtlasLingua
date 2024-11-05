from app.services.language_model import LanguageModel


class SummarizationService:
    @staticmethod
    def summarize(text):
        # call language model
        llm = LanguageModel()
        return llm.summarize(text_to_summarize=text)
