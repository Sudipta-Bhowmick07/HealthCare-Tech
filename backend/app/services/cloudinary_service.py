import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="drbwrkdvd",
    api_key="774871754575135",
    api_secret="jOx6pDrnj8CaPc1oXohqr4WwxdM",
    secure=True
)


def upload_file(file_path, folder):

    result = cloudinary.uploader.upload(
        file_path,
        folder=folder,
        resource_type="auto"
    )

    return result["secure_url"]