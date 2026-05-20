from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token
)

password = "mypassword123"

hashed = hash_password(password)

print("Hashed Password:")
print(hashed)

print("\nPassword Match:")
print(
    verify_password(
        password,
        hashed
    )
)

token = create_access_token(
    {"sub": "test@example.com"}
)

print("\nJWT Token:")
print(token)