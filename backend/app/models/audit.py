from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AuditRecord(Base):
    __tablename__ = "audit_records"

    audit_id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
    )

    screening_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("screenings.screening_id"),
        nullable=False,
        index=True,
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    officer_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    checkpoint: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    risk_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    decision: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )