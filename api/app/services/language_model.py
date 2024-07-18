import anthropic

from app.models.dictionary import Dictionary
from app.utils.shared import LanguagesEnum


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

    def translate(self, text_to_translate, source, destination, feed):
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

        self.system_prompt = f"You are a highly skilled translator fluent in both English and Moroccan Darija. Your task is to translate any text provided to you from {source_language} to {destination_language}. Always provide only the direct translation (latin letters) without any additional explanations or commentary."

        # feed useful transaltion to the llm
        # if feed:
        #     self.system_prompt += f" You can utilize these pre-defined translations if you find it useful: {feed}"

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

        # Save in dictionary

        return response
