import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
)

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf"
]


@router.post("/upload")
async def upload_prescription(
    file: UploadFile = File(...)
):

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type"
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }