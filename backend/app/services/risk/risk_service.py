from typing import Any


class RiskService:

    def calculate(
        self,
        identity: dict | None = None,
        validation: dict | None = None,
        cross_validation: dict | None = None,
        face: dict | None = None,
        tampering: dict | None = None,
    ) -> dict:

        score = 0
        reasons = []
        signals = []

        # --------------------------------------------------
        # Identity verification
        # --------------------------------------------------

        if identity:
            identity_status = identity.get("status")

            if identity_status == "NOT_FOUND":
                score += 35

                reasons.append(
                    {
                        "code": "IDENTITY_NOT_FOUND",
                        "points": 35,
                        "severity": "HIGH",
                        "message": (
                            "Passport number was not found "
                            "in the reference database."
                        ),
                    }
                )

            elif identity_status == "EXPIRED":
                score += 25

                reasons.append(
                    {
                        "code": "DOCUMENT_EXPIRED",
                        "points": 25,
                        "severity": "MEDIUM",
                        "message": (
                            "The document is marked as expired "
                            "in the reference database."
                        ),
                    }
                )

            elif identity_status == "WATCHLIST_REVIEW":
                score += 35

                reasons.append(
                    {
                        "code": "WATCHLIST_REVIEW",
                        "points": 35,
                        "severity": "HIGH",
                        "message": (
                            "The identity requires watchlist review."
                        ),
                    }
                )

            watchlist_status = identity.get(
                "watchlist_status"
            )

            if (
                watchlist_status == "REVIEW"
                and identity_status != "WATCHLIST_REVIEW"
            ):
                score += 35

                reasons.append(
                    {
                        "code": "WATCHLIST_REVIEW",
                        "points": 35,
                        "severity": "HIGH",
                        "message": (
                            "The identity has a watchlist review flag."
                        ),
                    }
                )

        # --------------------------------------------------
        # Document validation
        # --------------------------------------------------

        if validation:
            validation_status = validation.get("status")

            if validation_status == "MISMATCH":
                score += 25

                reasons.append(
                    {
                        "code": "REFERENCE_MISMATCH",
                        "points": 25,
                        "severity": "HIGH",
                        "message": (
                            "Document fields do not match "
                            "the reference record."
                        ),
                    }

                )

            elif validation_status == "NOT_FOUND":
                score += 35

                reasons.append(
                    {
                        "code": "VALIDATION_NOT_FOUND",
                        "points": 35,
                        "severity": "HIGH",
                        "message": (
                            "No matching identity record "
                            "was found during validation."
                        ),
                    }
                )

        # --------------------------------------------------
        # Cross validation
        # --------------------------------------------------

        if cross_validation:
            cross_status = cross_validation.get(
                "status"
            )

            if cross_status == "INCONSISTENT":
                score += 20

                reasons.append(
                    {
                        "code": "CROSS_VALIDATION_FAILED",
                        "points": 20,
                        "severity": "HIGH",
                        "message": (
                            "Document, OCR, and/or MRZ "
                            "information is inconsistent."
                        ),
                    }
                )

            elif cross_status == "REVIEW":
                score += 10

                reasons.append(
                    {
                        "code": "CROSS_VALIDATION_REVIEW",
                        "points": 10,
                        "severity": "MEDIUM",
                        "message": (
                            "Cross-document validation "
                            "requires review."
                        ),
                    }
                )

        # --------------------------------------------------
        # Face verification
        # --------------------------------------------------

        if face:
            face_status = face.get("status")

            if face_status == "MISMATCH":
                score += 35

                reasons.append(
                    {
                        "code": "FACE_MISMATCH",
                        "points": 35,
                        "severity": "HIGH",
                        "message": (
                            "The verification face does not "
                            "match the document face."
                        ),
                    }
                )

            elif face_status == "NO_FACE_IN_DOCUMENT":
                score += 20

                reasons.append(
                    {
                        "code": "DOCUMENT_FACE_NOT_FOUND",
                        "points": 20,
                        "severity": "MEDIUM",
                        "message": (
                            "No face could be detected "
                            "in the document."
                        ),
                    }
                )

            elif face_status == "NO_FACE_IN_VERIFICATION_IMAGE":
                score += 20

                reasons.append(
                    {
                        "code": "VERIFICATION_FACE_NOT_FOUND",
                        "points": 20,
                        "severity": "MEDIUM",
                        "message": (
                            "No face could be detected "
                            "in the verification image."
                        ),
                    }
                )

        # --------------------------------------------------
        # Tampering
        # --------------------------------------------------
        #
        # Placeholder.
        # The ML tampering model will be connected here later.
        #

        if tampering:
            if tampering.get("suspicious") is True:

                tampering_score = float(
                    tampering.get(
                        "tampering_score",
                        0,
                    )
                )

                tampering_points = min(
                    int(tampering_score * 0.35),
                    35,
                )

                score += tampering_points

                reasons.append(
                    {
                        "code": "TAMPERING_SUSPECTED",
                        "points": tampering_points,
                        "severity": "HIGH",
                        "message": (
                            "The document tampering analysis "
                            "reported suspicious characteristics."
                        ),
                    }
                )

        # --------------------------------------------------
        # Clamp score
        # --------------------------------------------------

        score = min(max(score, 0), 100)

        # --------------------------------------------------
        # Risk level
        # --------------------------------------------------

        if score <= 30:
            risk_level = "LOW"
            decision = "CLEAR"

        elif score <= 70:
            risk_level = "MEDIUM"
            decision = "MANUAL_REVIEW"

        else:
            risk_level = "HIGH"
            decision = "ESCALATE"

        # --------------------------------------------------
        # Signals summary
        # --------------------------------------------------

        if identity:
            signals.append(
                {
                    "category": "identity",
                    "status": identity.get("status"),
                }
            )

        if validation:
            signals.append(
                {
                    "category": "document_validation",
                    "status": validation.get("status"),
                }
            )

        if cross_validation:
            signals.append(
                {
                    "category": "cross_validation",
                    "status": cross_validation.get("status"),
                }
            )

        if face:
            signals.append(
                {
                    "category": "face",
                    "status": face.get("status"),
                    "similarity": face.get("similarity"),
                }
            )

        if tampering:
            signals.append(
                {
                    "category": "tampering",
                    "status": (
                        "SUSPICIOUS"
                        if tampering.get("suspicious")
                        else "CLEAR"
                    ),
                    "score": tampering.get(
                        "tampering_score"
                    ),
                }
            )

        return {
            "risk_score": score,
            "risk_level": risk_level,
            "decision": decision,
            "reasons": reasons,
            "signals": signals,
        }


risk_service = RiskService()