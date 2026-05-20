from fastapi import APIRouter

from app.ai.medicine_parser import (
    parse_medicine_text
)

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.get("/parse")
def parse_text():

    sample_text = """
    Tab Paracetamol 500mg twice daily
    Cap Amoxicillin 250mg once daily
    """

    result = parse_medicine_text(
        sample_text
    )

    return result