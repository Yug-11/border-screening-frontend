from fastapi import APIRouter, Depends, Query

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user
from app.models.screening import Screening
from app.websocket.screening import manager

import asyncio


router = APIRouter(
    prefix="/api/monitoring",
    tags=["Monitoring"],
)


# ==========================================================
# HELPERS
# ==========================================================

def _get_checkpoint(screening):
    """
    Get checkpoint from the screening audit data.
    """

    result_data = screening.result_data or {}

    audit = result_data.get("audit") or {}

    return audit.get("checkpoint")


def _is_authorized(
    screening,
    current_user,
):
    """
    Check whether the current user can access
    this screening.
    """

    role = current_user.get("role")

    user_checkpoint = current_user.get("checkpoint")

    # Supervisors and admins can access all checkpoints.
    if role in (
        "SUPERVISOR",
        "ADMIN",
    ):
        return True

    return (
        _get_checkpoint(screening)
        == user_checkpoint
    )


def _serialize_screening(screening):
    """
    Convert a Screening database object into
    a dashboard-friendly response.
    """

    checkpoint = _get_checkpoint(screening)

    risk_score = (
        screening.risk_score
        if screening.risk_score is not None
        else 0
    )

    if risk_score >= 71:
        risk_level = "HIGH"

    elif risk_score >= 31:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    return {
        "screening_id": screening.screening_id,
        "passport_number": screening.passport_number,
        "status": screening.status,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "decision": screening.decision,
        "checkpoint": checkpoint,
        "started_at": (
            screening.started_at.isoformat()
            if screening.started_at
            else None
        ),
        "completed_at": (
            screening.completed_at.isoformat()
            if screening.completed_at
            else None
        ),
    }


# ==========================================================
# OVERVIEW
# ==========================================================

@router.get("/overview")
async def get_monitoring_overview(
    current_user: dict = Depends(
        get_current_user
    ),
):
    """
    Return screening statistics for the user's checkpoint.

    OFFICER / VIEWER:
        Only their assigned checkpoint.

    SUPERVISOR / ADMIN:
        All checkpoints.
    """

    db = SessionLocal()

    try:
        role = current_user.get("role")

        user_checkpoint = current_user.get(
            "checkpoint"
        )

        query = db.query(Screening)

        # --------------------------------------------------
        # Checkpoint isolation
        # --------------------------------------------------

        if role not in (
            "SUPERVISOR",
            "ADMIN",
        ):

            screenings = query.all()

            screenings = [
                screening
                for screening in screenings
                if _get_checkpoint(
                    screening
                ) == user_checkpoint
            ]

        else:
            screenings = query.all()

        # --------------------------------------------------
        # Calculate statistics
        # --------------------------------------------------

        total_screenings = len(
            screenings
        )

        completed = sum(
            1
            for screening in screenings
            if screening.status == "COMPLETED"
        )

        finalized = sum(
            1
            for screening in screenings
            if screening.status == "FINALIZED"
        )

        pending = sum(
            1
            for screening in screenings
            if screening.status == "PENDING"
        )

        high_risk = sum(
            1
            for screening in screenings
            if screening.risk_score >= 71
        )

        medium_risk = sum(
            1
            for screening in screenings
            if (
                31
                <= screening.risk_score
                <= 70
            )
        )

        low_risk = sum(
            1
            for screening in screenings
            if screening.risk_score <= 30
        )

        cleared = sum(
            1
            for screening in screenings
            if screening.decision == "CLEAR"
        )

        manual_review = sum(
            1
            for screening in screenings
            if screening.decision
            in (
                "MANUAL_REVIEW",
                "MANUAL REVIEW",
            )
        )

        escalated = sum(
            1
            for screening in screenings
            if screening.decision == "ESCALATE"
        )

        return {
            "success": True,

            "scope": {
                "checkpoint": (
                    "ALL"
                    if role in (
                        "SUPERVISOR",
                        "ADMIN",
                    )
                    else user_checkpoint
                ),
                "role": role,
            },

            "statistics": {
                "total_screenings": total_screenings,
                "completed": completed,
                "finalized": finalized,
                "pending": pending,

                "risk": {
                    "high": high_risk,
                    "medium": medium_risk,
                    "low": low_risk,
                },

                "decisions": {
                    "cleared": cleared,
                    "manual_review": manual_review,
                    "escalated": escalated,
                },
            },
        }

    finally:
        db.close()


# ==========================================================
# RECENT SCREENINGS
# ==========================================================

@router.get("/recent")
async def get_recent_screenings(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),

    offset: int = Query(
        default=0,
        ge=0,
    ),

    risk_level: str | None = Query(
        default=None,
    ),

    decision: str | None = Query(
        default=None,
    ),

    current_user: dict = Depends(
        get_current_user
    ),
):
    """
    Return recent screenings for the authorized
    checkpoint.

    Supports:

        limit
        offset
        risk_level
        decision
    """

    db = SessionLocal()

    try:
        role = current_user.get("role")

        user_checkpoint = current_user.get(
            "checkpoint"
        )

        # --------------------------------------------------
        # Validate risk filter
        # --------------------------------------------------

        if risk_level:

            risk_level = risk_level.upper()

            if risk_level not in (
                "LOW",
                "MEDIUM",
                "HIGH",
            ):
                return {
                    "success": False,
                    "message": (
                        "Invalid risk_level. "
                        "Use LOW, MEDIUM, or HIGH."
                    ),
                }

        # --------------------------------------------------
        # Normalize decision filter
        # --------------------------------------------------

        if decision:
            decision = decision.upper()

        # --------------------------------------------------
        # Get screenings
        # --------------------------------------------------

        screenings = (
            db.query(Screening)
            .order_by(
                Screening.started_at.desc()
            )
            .all()
        )

        # --------------------------------------------------
        # Checkpoint isolation
        # --------------------------------------------------

        if role not in (
            "SUPERVISOR",
            "ADMIN",
        ):

            screenings = [
                screening
                for screening in screenings
                if _get_checkpoint(
                    screening
                ) == user_checkpoint
            ]

        # --------------------------------------------------
        # Apply risk filter
        # --------------------------------------------------

        if risk_level:

            if risk_level == "HIGH":

                screenings = [
                    screening
                    for screening in screenings
                    if screening.risk_score >= 71
                ]

            elif risk_level == "MEDIUM":

                screenings = [
                    screening
                    for screening in screenings
                    if (
                        31
                        <= screening.risk_score
                        <= 70
                    )
                ]

            elif risk_level == "LOW":

                screenings = [
                    screening
                    for screening in screenings
                    if screening.risk_score <= 30
                ]

        # --------------------------------------------------
        # Apply decision filter
        # --------------------------------------------------

        if decision:

            screenings = [
                screening
                for screening in screenings
                if screening.decision
                == decision
            ]

        total = len(
            screenings
        )

        # --------------------------------------------------
        # Pagination
        # --------------------------------------------------

        paginated_screenings = screenings[
            offset : offset + limit
        ]

        return {
            "success": True,

            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": total,
                "returned": len(
                    paginated_screenings
                ),
            },

            "screenings": [
                _serialize_screening(
                    screening
                )
                for screening in paginated_screenings
            ],
        }

    finally:
        db.close()


# ==========================================================
# HIGH-RISK / ATTENTION ALERTS
# ==========================================================

@router.get("/alerts")
async def get_monitoring_alerts(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    current_user: dict = Depends(
        get_current_user
    ),
):
    """
    Return screenings that require attention.

    Alerts include:

        HIGH risk
        MANUAL_REVIEW
        ESCALATE
    """

    db = SessionLocal()

    try:
        role = current_user.get("role")

        user_checkpoint = current_user.get(
            "checkpoint"
        )

        screenings = (
            db.query(Screening)
            .order_by(
                Screening.started_at.desc()
            )
            .all()
        )

        # --------------------------------------------------
        # Checkpoint isolation
        # --------------------------------------------------

        if role not in (
            "SUPERVISOR",
            "ADMIN",
        ):

            screenings = [
                screening
                for screening in screenings
                if _get_checkpoint(
                    screening
                ) == user_checkpoint
            ]

        # --------------------------------------------------
        # Find attention cases
        # --------------------------------------------------

        alerts = []

        for screening in screenings:

            risk_score = (
                screening.risk_score
                if screening.risk_score is not None
                else 0
            )

            screening_decision = (
                screening.decision
                or ""
            ).upper()

            reasons = []

            # High-risk screening
            if risk_score >= 71:
                reasons.append(
                    "HIGH_RISK"
                )

            # Manual review
            if screening_decision in (
                "MANUAL_REVIEW",
                "MANUAL REVIEW",
            ):
                reasons.append(
                    "MANUAL_REVIEW"
                )

            # Escalation
            if screening_decision == "ESCALATE":
                reasons.append(
                    "ESCALATED"
                )

            if not reasons:
                continue

            alert = _serialize_screening(
                screening
            )

            alert["alert_reasons"] = reasons

            alerts.append(alert)

            if len(alerts) >= limit:
                break

        return {
            "success": True,

            "count": len(
                alerts
            ),

            "alerts": alerts,
        }

    finally:
        db.close()


# ==========================================================
# WEBSOCKET PROGRESS TEST
# ==========================================================

@router.post("/test-progress/{screening_id}")
async def test_screening_progress(
    screening_id: str,
):
    """
    Temporary development endpoint.

    Sends the nine screening stages through
    the WebSocket connection.

    This will be removed after the real
    screening pipeline is connected.
    """

    stages = [
        (
            "document-detection",
            "Document detected",
        ),
        (
            "ocr",
            "OCR completed",
        ),
        (
            "structure-analysis",
            "Document structure analyzed",
        ),
        (
            "document-validation",
            "Document validation completed",
        ),
        (
            "tampering-analysis",
            "Tampering analysis completed",
        ),
        (
            "mrz-validation",
            "MRZ validation completed",
        ),
        (
            "face-extraction",
            "Face extracted",
        ),
        (
            "face-verification",
            "Face verification completed",
        ),
        (
            "risk-assessment",
            "Risk assessment completed",
        ),
    ]

    total = len(stages)

    for index, (stage, message) in enumerate(
        stages,
        start=1,
    ):

        progress = int(
            (index / total) * 100
        )

        await manager.send_update(
            screening_id,
            {
                "type": "screening_progress",
                "screening_id": screening_id,
                "stage": stage,
                "status": "COMPLETED",
                "progress": progress,
                "message": message,
            },
        )

        await asyncio.sleep(1)

    return {
        "screening_id": screening_id,
        "status": "COMPLETED",
        "progress": 100,
    }