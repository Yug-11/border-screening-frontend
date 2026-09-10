from fastapi import Depends, HTTPException

from app.core.dependencies import get_current_user


def require_role(*allowed_roles: str):
    def role_checker(
        current_user: dict = Depends(get_current_user),
    ):
        role = current_user.get("role")

        if role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker


def require_checkpoint(
    checkpoint: str,
    current_user: dict = Depends(get_current_user),
):
    user_checkpoint = current_user.get("checkpoint")

    if user_checkpoint != checkpoint:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized for this checkpoint.",
        )

    return current_user