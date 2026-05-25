import os
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_file(file_path, folder):

    if file_path.lower().endswith(".pdf"):

        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="raw",
            use_filename=True,
            unique_filename=True
        )

    else:

        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="image"
        )

    print("CLOUDINARY RESULT:", result)

    return result["secure_url"]