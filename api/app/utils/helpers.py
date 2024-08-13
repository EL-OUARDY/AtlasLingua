import re
import secrets
import string


def split_to_words(str):
    return " ".join(str.split()).split()


def is_rtl(text: str) -> bool:
    rtl_chars = re.compile(r"[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]")
    return bool(rtl_chars.search(text))


def generate_shareable_link_id():
    # define the character set for the random string
    characters = string.ascii_letters + string.digits + "_-"

    # generate a random string of 10 characters
    random_string = "".join(secrets.choice(characters) for _ in range(15))

    return random_string
