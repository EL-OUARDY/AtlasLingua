from app.services.history_service import HistoryService
from app.utils.helpers import is_rtl
from app.utils.shared import LanguagesEnum

import anthropic


class LanguageModel:
    def __init__(
        self,
        model="claude-3-5-sonnet-20240620",
        max_tokens=2000,
        temperature=0.2,
    ):
        self.client = anthropic.Anthropic()
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.system_prompt = ""

    def translate(self, text_to_translate, source, destination, feed=None):
        # check history before sending a request to the LLM
        result = HistoryService.get_from_history(
            text_to_translate=text_to_translate,
            source=source,
            destination=destination,
            processed_by=self.model,
        )

        # check if result is valid latin letters
        if result and not is_rtl(result):

            # save to history again
            if source == LanguagesEnum.ENGLISH.value:
                HistoryService.save(
                    source, text_to_translate, result, self.model
                )
            else:
                HistoryService.save(
                    source, result, text_to_translate, self.model
                )
            return result

        # use the language model
        source_language = (
            "English"
            if source == LanguagesEnum.ENGLISH.value
            else "Moroccan Darija"
        )
        destination_language = (
            "English"
            if destination == LanguagesEnum.ENGLISH.value
            else "Moroccan Darija"
        )

        self.system_prompt = f"You are a highly skilled translator fluent in both English and Moroccan Darija. Your task is to translate any text provided to you from {source_language} to {destination_language}. Always provide only the translation in Latin alphabet without any additional explanations or commentary."

        # feed useful transaltion to the llm
        # if feed:
        #     self.system_prompt += f" You can utilize these pre-defined translations if you find it useful: {feed}"

        # errors
        self.system_prompt += f" If there is an error in the text provided, don't do anything; just reply with 0"

        message = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            temperature=self.temperature,
            system=self.system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": text_to_translate,
                        }
                    ],
                }
            ],
        )
        response = message.content[0].text

        # handle potentiel errors
        if response == "0":
            return None

        # save in history
        if source == LanguagesEnum.ENGLISH.value:
            HistoryService.save(source, text_to_translate, response, self.model)
        else:
            HistoryService.save(source, response, text_to_translate, self.model)

        return response
