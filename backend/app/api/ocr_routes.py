from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

import shutil
import os
import uuid

from app.database.db import SessionLocal
from app.models.prescription_model import Prescription
from app.models.user import User

from app.services.ocr_service import extract_text_from_image

from app.services.cloudinary_service import upload_file

from app.utils.pdf_generator import create_prescription_pdf

from app.auth.security import get_current_user

from app.services.drug_interaction_service import (
    check_interactions
)

router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/upload")
async def upload_prescription(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        unique_filename = (
            f"{uuid.uuid4()}_{file.filename}"
        )

        file_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )
            
        image_url = upload_file(
            file_path,
            "prescriptions"
        )

        extracted_text = extract_text_from_image(
            file_path
        )

        medicines = []

        for line in extracted_text.split("\n"):

            clean_line = line.strip()

            if len(clean_line) > 2:
                medicines.append(clean_line)

        # =====================================
        # DRUG INTERACTION CHECK
        # =====================================

        interaction_warnings = check_interactions(
            medicines
        )

        pdf_filename = (
            f"{uuid.uuid4()}.pdf"
        )

        pdf_path = os.path.join(
            UPLOAD_FOLDER,
            pdf_filename
        )

        create_prescription_pdf(
            extracted_text,
            medicines,
            pdf_path
        )

        pdf_url = upload_file(
            pdf_path,
            "prescription_pdfs"
        )

        prescription = Prescription(
            filename=unique_filename,
            extracted_text=extracted_text,
            medicines=", ".join(medicines),
            pdf_filename=pdf_filename,
            image_url=image_url,
            pdf_url=pdf_url,
            user_id=current_user.id
        )

        db.add(prescription)

        db.commit()

        db.refresh(prescription)

        return {

            "message":
                "Prescription uploaded successfully",

            "filename":
                unique_filename,

            "ocr_text":
                extracted_text,

            "medicines":
                medicines,

            "interaction_warnings":
                interaction_warnings,

            "pdf_download":
                pdf_url
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    prescriptions = db.query(
        Prescription
    ).filter(
        Prescription.user_id == current_user.id
    ).all()

    history = []

    for item in prescriptions:

        history.append({

            "id":
                item.id,

            "filename":
                item.filename,

            "medicines":
                item.medicines,

            "created_at":
                item.created_at,

            "image_url":
                item.image_url,

            "pdf_download":
                item.pdf_url
        })

    return history




@router.delete("/history/{prescription_id}")
def delete_history(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    prescription = db.query(
        Prescription
    ).filter(
        Prescription.id == prescription_id,
        Prescription.user_id == current_user.id
    ).first()

    if not prescription:

        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )

    db.delete(prescription)

    db.commit()

    return {
        "message": "Prescription deleted successfully"
    }




@router.get("/download/{filename}")
def download_pdf(filename: str):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    if not os.path.exists(file_path):

        raise HTTPException(
            status_code=404,
            detail="PDF not found"
        )

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/pdf"
    )