from datetime import timedelta

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.security import (
    verify_password,
    create_access_token,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# ============================================================
# Demo user
# ============================================================
#
# IMPORTANT:
# This is temporary prototype authentication.
# We will move users into PostgreSQL later.
#

DEMO_USER = {
    "username": "demo-officer-001",

    # This hash will be replaced with a properly generated
    # database-stored password hash in the next step.
    "password": "demo123",

    "role": "OFFICER",
    "checkpoint": "DELHI-DEMO-01",
}


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(
    request: LoginRequest,
):

    if request.username != DEMO_USER["username"]:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password.",
        )

    # Temporary prototype verification.
    #
    # We will replace this with bcrypt verification
    # against a PostgreSQL user record.
    if request.password != DEMO_USER["password"]:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password.",
        )

    access_token = create_access_token(
        data={
            "sub": DEMO_USER["username"],
            "role": DEMO_USER["role"],
            "checkpoint": DEMO_USER["checkpoint"],
        },
        expires_delta=timedelta(hours=1),
    )

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": DEMO_USER["username"],
            "role": DEMO_USER["role"],
            "checkpoint": DEMO_USER["checkpoint"],
        },
    }