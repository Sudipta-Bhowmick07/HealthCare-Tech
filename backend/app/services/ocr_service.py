import os
import requests


OCR_SPACE_API_KEY = os.getenv(
    "OCR_SPACE_API_KEY"
)


def extract_text_from_image(
    image_path: str
):

    with open(
        image_path,
        "rb"
    ) as image_file:

        response = requests.post(
            "https://api.ocr.space/parse/image",
            files={
                "file": image_file
            },
            data={
                "apikey": OCR_SPACE_API_KEY,
                "language": "eng"
            }
        )

    result = response.json()
    print("OCR RESPONSE:")
    print(result)
    if (
        "ParsedResults" not in result
        or
        not result["ParsedResults"]
    ):
        return ""

    return result[
        "ParsedResults"
    ][0][
        "ParsedText"
    ]