from reportlab.lib.pagesizes import letter

from reportlab.pdfgen import canvas


def create_prescription_pdf(
    extracted_text,
    medicines,
    output_path
):

    c = canvas.Canvas(
        output_path,
        pagesize=letter
    )

    width, height = letter

    y = height - 50

    c.setFont(
        "Helvetica-Bold",
        18
    )

    c.drawString(
        50,
        y,
        "MedAssist AI Prescription Report"
    )

    y -= 40

    c.setFont(
        "Helvetica",
        12
    )

    c.drawString(
        50,
        y,
        "Extracted OCR Text:"
    )

    y -= 25

    text_object = c.beginText(
        50,
        y
    )

    for line in extracted_text.split("\n"):

        text_object.textLine(line)

    c.drawText(text_object)

    y = text_object.getY() - 40

    c.setFont(
        "Helvetica-Bold",
        14
    )

    c.drawString(
        50,
        y,
        "Detected Medicines:"
    )

    y -= 30

    c.setFont(
        "Helvetica",
        12
    )

    for medicine in medicines:

        c.drawString(
            70,
            y,
            f"- {medicine}"
        )

        y -= 20

    c.save()