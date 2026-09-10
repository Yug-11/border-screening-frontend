from datetime import datetime

from sqlalchemy import DateTime, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Screening(Base):
    __tablename__ = "screenings"

    screening_id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True
    )

    passport_number: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    risk_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    decision: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    result_data: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )

    integrity_hash: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
        index=True
    )

    blockchain_transaction_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )