from typing import Literal

from pydantic import BaseModel, Field


class ScreeningDecisionRequest(BaseModel):
    decision: Literal[
        "CLEAR",
        "MANUAL_REVIEW",
        "ESCALATE",
    ]

    remarks: str | None = Field(
        default=None,
        max_length=1000,
    )