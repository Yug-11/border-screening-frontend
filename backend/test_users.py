from datetime import datetime, timezone
from uuid import uuid4

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.user import User


# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    users = [
        {
            "username": "demo-officer-001",
            "password": "demo123",
            "role": "OFFICER",
            "checkpoint": "DELHI-DEMO-01",
        },
        {
            "username": "demo-viewer",
            "password": "demo123",
            "role": "VIEWER",
            "checkpoint": "DELHI-DEMO-01",
        },
    ]

    for user_data in users:
        existing_user = (
            db.query(User)
            .filter(User.username == user_data["username"])
            .first()
        )

        if existing_user:
            print(
                f"User already exists: "
                f"{existing_user.username} "
                f"({existing_user.role})"
            )
            continue

        user = User(
            user_id=str(uuid4()),
            username=user_data["username"],
            password_hash=hash_password(user_data["password"]),
            role=user_data["role"],
            checkpoint=user_data["checkpoint"],
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )

        db.add(user)

        print(
            f"Created user: "
            f"{user_data['username']} "
            f"({user_data['role']})"
        )

    db.commit()

    print("\nUser setup complete.")

except Exception:
    db.rollback()
    raise

finally:
    db.close()