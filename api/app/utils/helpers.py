import re


def split_to_words(str):
    return " ".join(str.split()).split()


def is_rtl(text: str) -> bool:
    rtl_chars = re.compile(r"[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]")
    return bool(rtl_chars.search(text))
