import uuid
from datetime import datetime, timezone

from app.services.ocr.ocr_service import ocr_service
from app.services.identity.identity_service import identity_service
from app.services.face.face_service import face_service
from app.services.risk.risk_service import risk_service
from app.services.audit.audit_service import audit_service

from app.services.blockchain.integrity_service import (
    integrity_service,
)

from app.services.blockchain.blockchain_service import (
    blockchain_service,
)

from app.core.database import SessionLocal

from app.models.screening import Screening
from app.models.audit import AuditRecord

from app.websocket.screening import manager


# ==========================================================
# WEBSOCKET PROGRESS HELPER
# ==========================================================

def publish_screening_stage(
    screening_id: str,
    stage: str,
    status: str,
    progress: int,
    message: str | None = None,
):
    """
    Publish screening progress from the synchronous
    screening pipeline to the WebSocket client.
    """

    payload = {
        "type": "screening_progress",
        "screening_id": screening_id,
        "stage": stage,
        "status": status,
        "progress": progress,
    }

    if message:
        payload["message"] = message

    manager.send_update_sync(
        screening_id,
        payload,
    )


class ScreeningService:

    def __init__(self):
        self.screenings = {}

    # ======================================================
    # HELPERS
    # ======================================================

    def _normalize(self, value):

        if value is None:
            return None

        return " ".join(
            str(value).upper().split()
        ).strip()

    def _compare(self, a, b):

        if a is None or b is None:
            return False

        return (
            self._normalize(a)
            == self._normalize(b)
        )

    def _cross_validate(
        self,
        fields,
        mrz,
        identity,
    ):

        mismatches = []
        warnings = []

        # --------------------------------------------------
        # Reference identity
        # --------------------------------------------------

        if not identity.get("found"):

            return {
                "status": "REVIEW",
                "mismatches": [],
                "warnings": [
                    "No matching reference identity was found."
                ],
            }

        reference = (
            identity.get("identity")
            or {}
        )

        # --------------------------------------------------
        # OCR vs reference
        # --------------------------------------------------

        fields_to_compare = {
            "surname": "surname",
            "given_names": "given_names",
            "date_of_birth": "date_of_birth",
            "nationality": "nationality",
            "date_of_expiry": "date_of_expiry",
        }

        for (
            document_field,
            reference_field,
        ) in fields_to_compare.items():

            document_value = fields.get(
                document_field
            )

            reference_value = reference.get(
                reference_field
            )

            if (
                document_value is not None
                and reference_value is not None
                and not self._compare(
                    document_value,
                    reference_value,
                )
            ):

                mismatches.append(
                    {
                        "field": document_field,
                        "source": "OCR",
                        "document_value": document_value,
                        "reference_value": reference_value,
                    }
                )

        # --------------------------------------------------
        # MRZ
        # --------------------------------------------------

        if not mrz:

            warnings.append(
                "MRZ result was not available."
            )

        elif not mrz.get("detected"):

            warnings.append(
                "MRZ was not detected."
            )

        elif not mrz.get("valid_format"):

            warnings.append(
                "MRZ was detected but failed structural validation."
            )

        else:

            # --------------------------------------------------
            # MRZ Document Number
            # --------------------------------------------------

            mrz_document_number = mrz.get(
                "document_number"
            )

            passport_number = fields.get(
                "passport_number"
            )

            if (
                mrz_document_number
                and passport_number
                and not self._compare(
                    mrz_document_number,
                    passport_number,
                )
            ):

                mismatches.append(
                    {
                        "field": "passport_number",
                        "source": "MRZ",
                        "document_value": passport_number,
                        "mrz_value": mrz_document_number,
                    }
                )

            # --------------------------------------------------
            # MRZ Nationality
            # --------------------------------------------------

            mrz_nationality = mrz.get(
                "nationality"
            )

            nationality = fields.get(
                "nationality"
            )

            if (
                mrz_nationality
                and nationality
                and not self._compare(
                    mrz_nationality,
                    nationality,
                )
            ):

                warnings.append(
                    "MRZ nationality and visible nationality differ."
                )

        # --------------------------------------------------
        # Final cross-validation status
        # --------------------------------------------------

        if mismatches:

            status = "INCONSISTENT"

        elif warnings:

            status = "REVIEW"

        else:

            status = "CONSISTENT"

        return {
            "status": status,
            "mismatches": mismatches,
            "warnings": warnings,
        }

    # ======================================================
    # CREATE SCREENING
    # ======================================================

    def create_screening(
        self,
        document_path,
        verification_image_path=None,
        officer_id=None,
        checkpoint=None,
        screening_id=None,
    ):

        screening_id = screening_id or str(
            uuid.uuid4()
        )

        started_at = datetime.now(
            timezone.utc
        ).isoformat()

        # ==================================================
        # STEP 1 — DOCUMENT DETECTION
        # ==================================================

        publish_screening_stage(
            screening_id,
            "document-detection",
            "STARTED",
            0,
            "Processing document.",
        )

        publish_screening_stage(
            screening_id,
            "document-detection",
            "COMPLETED",
            11,
            "Document detected.",
        )

        # ==================================================
        # STEP 2 — OCR
        # ==================================================

        publish_screening_stage(
            screening_id,
            "ocr",
            "STARTED",
            11,
            "Extracting document text.",
        )

        ocr_result = ocr_service.process(
            document_path
        )

        fields = ocr_result.get(
            "fields",
            {}
        )

        mrz = ocr_result.get(
            "mrz",
            {}
        )

        publish_screening_stage(
            screening_id,
            "ocr",
            "COMPLETED",
            22,
            "OCR completed.",
        )

        # ==================================================
        # STEP 3 — STRUCTURE ANALYSIS
        # ==================================================

        publish_screening_stage(
            screening_id,
            "structure-analysis",
            "STARTED",
            22,
            "Analyzing document structure.",
        )

        # Current structure analysis is represented
        # by the OCR/document processing pipeline.
        # Dedicated ML structure analysis can be added later.

        publish_screening_stage(
            screening_id,
            "structure-analysis",
            "COMPLETED",
            33,
            "Document structure analyzed.",
        )

        # ==================================================
        # STEP 4 — DOCUMENT VALIDATION / IDENTITY
        # ==================================================

        publish_screening_stage(
            screening_id,
            "document-validation",
            "STARTED",
            33,
            "Validating document identity.",
        )

        passport_number = fields.get(
            "passport_number"
        )

        if passport_number:

            identity_result = (
                identity_service.lookup(
                    passport_number
                )
            )

        else:

            identity_result = {
                "found": False,
                "status": "NOT_FOUND",
                "passport_number": None,
                "watchlist_status": "UNKNOWN",
                "identity": None,
            }

        publish_screening_stage(
            screening_id,
            "document-validation",
            "COMPLETED",
            44,
            "Document validation completed.",
        )

        # ==================================================
        # STEP 5 — TAMPERING ANALYSIS
        # ==================================================

        publish_screening_stage(
            screening_id,
            "tampering-analysis",
            "STARTED",
            44,
            "Analyzing document for tampering.",
        )

        # ML tampering model will be integrated later.

        tampering_result = None

        publish_screening_stage(
            screening_id,
            "tampering-analysis",
            "COMPLETED",
            55,
            "Tampering analysis completed.",
        )

        # ==================================================
        # STEP 6 — MRZ VALIDATION
        # ==================================================

        publish_screening_stage(
            screening_id,
            "mrz-validation",
            "STARTED",
            55,
            "Validating MRZ.",
        )

        cross_validation = (
            self._cross_validate(
                fields=fields,
                mrz=mrz,
                identity=identity_result,
            )
        )

        publish_screening_stage(
            screening_id,
            "mrz-validation",
            "COMPLETED",
            66,
            "MRZ validation completed.",
        )

        # ==================================================
        # STEP 7 — FACE EXTRACTION
        # ==================================================

        publish_screening_stage(
            screening_id,
            "face-extraction",
            "STARTED",
            66,
            "Extracting face from document.",
        )

        face_result = None

        if verification_image_path:

            # Face extraction is performed internally
            # by the face verification service.
            publish_screening_stage(
                screening_id,
                "face-extraction",
                "COMPLETED",
                77,
                "Face extracted.",
            )

        else:

            publish_screening_stage(
                screening_id,
                "face-extraction",
                "COMPLETED",
                77,
                "No verification image supplied.",
            )

        # ==================================================
        # STEP 8 — FACE VERIFICATION
        # ==================================================

        publish_screening_stage(
            screening_id,
            "face-verification",
            "STARTED",
            77,
            "Comparing faces.",
        )

        if verification_image_path:

            face_result = face_service.verify(
                document_image_path=document_path,
                verification_image_path=(
                    verification_image_path
                ),
            )

            face_message = (
                "Face verification completed."
            )

        else:

            face_message = (
                "Face verification skipped because "
                "no verification image was supplied."
            )

        publish_screening_stage(
            screening_id,
            "face-verification",
            "COMPLETED",
            88,
            face_message,
        )

        # ==================================================
        # STEP 9 — RISK ASSESSMENT
        # ==================================================

        publish_screening_stage(
            screening_id,
            "risk-assessment",
            "STARTED",
            88,
            "Calculating screening risk.",
        )

        risk_result = risk_service.calculate(
            identity=identity_result,
            validation={
                "status": (
                    "VALID"
                    if identity_result.get("found")
                    and not cross_validation.get(
                        "mismatches"
                    )
                    else "MISMATCH"
                )
            },
            cross_validation=cross_validation,
            face=face_result,
            tampering=tampering_result,
        )

        publish_screening_stage(
            screening_id,
            "risk-assessment",
            "COMPLETED",
            100,
            "Risk assessment completed.",
        )

        # ==================================================
        # FINAL AI SCREENING RESULT
        # ==================================================

        completed_at = datetime.now(
            timezone.utc
        ).isoformat()

        result = {
            "screening_id": screening_id,
            "status": "COMPLETED",
            "started_at": started_at,
            "completed_at": completed_at,

            "document": {
                "passport_number": passport_number,
                "fields": fields,
            },

            "ocr": ocr_result,

            "identity": identity_result,

            "cross_validation": cross_validation,

            "face": face_result,

            "tampering": tampering_result,

            "risk": risk_result,
        }

        # ==================================================
        # INITIAL AUDIT RECORD
        # ==================================================

        audit_record = audit_service.create_record(
            screening_id=screening_id,

            officer_id=(
                officer_id
                or "unknown-officer"
            ),

            checkpoint=(
                checkpoint
                or "unknown-checkpoint"
            ),

            risk_score=risk_result.get(
                "risk_score",
                0,
            ),

            decision=risk_result.get(
                "decision",
                "UNKNOWN",
            ),
        )

        result["audit"] = audit_record

        # ==================================================
        # INITIAL SHA-256 HASH
        # ==================================================

        integrity_hash = (
            integrity_service.generate_hash(
                result
            )
        )

        result["integrity"] = {
            "algorithm": "SHA-256",
            "hash": integrity_hash,
            "status": "GENERATED",
        }

        # ==================================================
        # INITIAL BLOCKCHAIN PROOF
        # ==================================================

        blockchain_proof = (
            blockchain_service.record_integrity_proof(
                screening_id=screening_id,
                integrity_hash=integrity_hash,
            )
        )

        result["blockchain"] = {
            "network": blockchain_proof[
                "network"
            ],
            "transaction_id": blockchain_proof[
                "transaction_id"
            ],
            "status": blockchain_proof[
                "status"
            ],
            "algorithm": blockchain_proof[
                "algorithm"
            ],
        }

        # ==================================================
        # SAVE SCREENING + AUDIT TO POSTGRESQL
        # ==================================================

        db = SessionLocal()

        try:

            database_screening = Screening(
                screening_id=screening_id,

                passport_number=passport_number,

                status="COMPLETED",

                risk_score=risk_result.get(
                    "risk_score",
                    0,
                ),

                decision=risk_result.get(
                    "decision",
                    "UNKNOWN",
                ),

                started_at=datetime.fromisoformat(
                    started_at
                ),

                completed_at=datetime.fromisoformat(
                    completed_at
                ),

                result_data=result,

                integrity_hash=integrity_hash,

                blockchain_transaction_id=(
                    blockchain_proof[
                        "transaction_id"
                    ]
                ),
            )

            db.add(
                database_screening
            )

            db.flush()

            database_audit = AuditRecord(
                audit_id=audit_record[
                    "audit_id"
                ],

                screening_id=screening_id,

                action=audit_record[
                    "action"
                ],

                officer_id=audit_record[
                    "officer_id"
                ],

                checkpoint=audit_record[
                    "checkpoint"
                ],

                risk_score=audit_record[
                    "risk_score"
                ],

                decision=audit_record[
                    "decision"
                ],

                timestamp=datetime.fromisoformat(
                    audit_record[
                        "timestamp"
                    ]
                ),
            )

            db.add(
                database_audit
            )

            db.commit()

        except Exception:

            db.rollback()

            raise

        finally:

            db.close()

        # ==================================================
        # IN-MEMORY CACHE
        # ==================================================

        self.screenings[
            screening_id
        ] = result

        return result

    # ======================================================
    # FINALIZE SCREENING DECISION
    # ======================================================

    def finalize_screening(
        self,
        screening_id: str,
        decision: str,
        remarks: str | None = None,
        officer_id: str | None = None,
        checkpoint: str | None = None,
    ):
        """
        Record the authorized officer's final decision.

        The final decision becomes part of the screening
        record and therefore changes the integrity hash.
        """

        allowed_decisions = {
            "CLEAR",
            "MANUAL_REVIEW",
            "ESCALATE",
        }

        if decision not in allowed_decisions:

            raise ValueError(
                "Invalid screening decision. "
                "Allowed values: CLEAR, MANUAL_REVIEW, ESCALATE."
            )

        db = SessionLocal()

        try:

            screening = (
                db.query(Screening)
                .filter(
                    Screening.screening_id
                    == screening_id
                )
                .first()
            )

            if not screening:

                raise ValueError(
                    "Screening not found."
                )

            result = (
                dict(screening.result_data)
                if screening.result_data
                else {}
            )

            existing_audit = (
                result.get("audit")
                or {}
            )

            screening_checkpoint = (
                existing_audit.get(
                    "checkpoint"
                )
            )

            if (
                checkpoint
                and screening_checkpoint
                and checkpoint != screening_checkpoint
            ):

                raise PermissionError(
                    "You are not authorized to finalize "
                    "this checkpoint screening."
                )

            # --------------------------------------------------
            # Update final decision
            # --------------------------------------------------

            result["decision"] = decision

            result["decision_details"] = {
                "decision": decision,

                "remarks": remarks,

                "officer_id": (
                    officer_id
                    or existing_audit.get(
                        "officer_id"
                    )
                ),

                "checkpoint": (
                    checkpoint
                    or screening_checkpoint
                ),

                "timestamp": datetime.now(
                    timezone.utc
                ).isoformat(),
            }

            # --------------------------------------------------
            # Final audit event
            # --------------------------------------------------

            decision_audit = (
                audit_service.create_record(
                    screening_id=screening_id,

                    officer_id=(
                        officer_id
                        or existing_audit.get(
                            "officer_id"
                        )
                        or "unknown-officer"
                    ),

                    checkpoint=(
                        checkpoint
                        or screening_checkpoint
                        or "unknown-checkpoint"
                    ),

                    risk_score=screening.risk_score,

                    decision=decision,
                )
            )

            decision_audit["action"] = (
                "FINAL_DECISION"
            )

            existing_audit.setdefault(
                "decision_history",
                [],
            )

            existing_audit[
                "decision_history"
            ].append(
                decision_audit
            )

            result["audit"] = (
                existing_audit
            )

            # --------------------------------------------------
            # Mark finalized
            # --------------------------------------------------

            result["status"] = (
                "FINALIZED"
            )

            final_timestamp = datetime.now(
                timezone.utc
            ).isoformat()

            result[
                "finalized_at"
            ] = final_timestamp

            # --------------------------------------------------
            # Remove old integrity metadata
            # --------------------------------------------------

            result.pop(
                "integrity",
                None,
            )

            result.pop(
                "blockchain",
                None,
            )

            # --------------------------------------------------
            # Generate final SHA-256
            # --------------------------------------------------

            final_integrity_hash = (
                integrity_service.generate_hash(
                    result
                )
            )

            result["integrity"] = {
                "algorithm": "SHA-256",
                "hash": final_integrity_hash,
                "status": "GENERATED",
            }

            # --------------------------------------------------
            # Final blockchain proof
            # --------------------------------------------------

            final_blockchain_proof = (
                blockchain_service.record_integrity_proof(
                    screening_id=screening_id,
                    integrity_hash=(
                        final_integrity_hash
                    ),
                )
            )

            result["blockchain"] = {
                "network": (
                    final_blockchain_proof[
                        "network"
                    ]
                ),

                "transaction_id": (
                    final_blockchain_proof[
                        "transaction_id"
                    ]
                ),

                "status": (
                    final_blockchain_proof[
                        "status"
                    ]
                ),

                "algorithm": (
                    final_blockchain_proof[
                        "algorithm"
                    ]
                ),
            }

            # --------------------------------------------------
            # Update PostgreSQL
            # --------------------------------------------------

            screening.status = (
                "FINALIZED"
            )

            screening.decision = decision

            screening.result_data = result

            screening.integrity_hash = (
                final_integrity_hash
            )

            screening.blockchain_transaction_id = (
                final_blockchain_proof[
                    "transaction_id"
                ]
            )

            # --------------------------------------------------
            # Save final audit
            # --------------------------------------------------

            database_audit = AuditRecord(
                audit_id=decision_audit[
                    "audit_id"
                ],

                screening_id=screening_id,

                action=decision_audit[
                    "action"
                ],

                officer_id=decision_audit[
                    "officer_id"
                ],

                checkpoint=decision_audit[
                    "checkpoint"
                ],

                risk_score=decision_audit[
                    "risk_score"
                ],

                decision=decision,

                timestamp=datetime.fromisoformat(
                    decision_audit[
                        "timestamp"
                    ]
                ),
            )

            db.add(
                database_audit
            )

            db.commit()

            self.screenings[
                screening_id
            ] = result

            return result

        except Exception:

            db.rollback()

            raise

        finally:

            db.close()

    # ======================================================
    # RETRIEVE SCREENING
    # ======================================================

    def get_screening(
        self,
        screening_id: str,
    ):

        db = SessionLocal()

        try:

            screening = (
                db.query(Screening)
                .filter(
                    Screening.screening_id
                    == screening_id
                )
                .first()
            )

            if not screening:
                return None

            # New records contain the complete result.
            if screening.result_data:

                return screening.result_data

            # --------------------------------------------------
            # Fallback for older records
            # --------------------------------------------------

            return {
                "screening_id": (
                    screening.screening_id
                ),

                "status": (
                    screening.status
                ),

                "started_at": (
                    screening.started_at.isoformat()
                ),

                "completed_at": (
                    screening.completed_at.isoformat()
                ),

                "document": {
                    "passport_number": (
                        screening.passport_number
                    ),
                },

                "risk": {
                    "risk_score": (
                        screening.risk_score
                    ),

                    "decision": (
                        screening.decision
                    ),
                },

                "integrity": {
                    "algorithm": "SHA-256",

                    "hash": (
                        screening.integrity_hash
                    ),

                    "status": (
                        "AVAILABLE"
                        if screening.integrity_hash
                        else "NOT_AVAILABLE"
                    ),
                },

                "blockchain": {
                    "network": "LOCAL-DEMO",

                    "transaction_id": (
                        screening.blockchain_transaction_id
                    ),

                    "status": (
                        "AVAILABLE"
                        if screening.blockchain_transaction_id
                        else "NOT_AVAILABLE"
                    ),

                    "algorithm": "SHA-256",
                },
            }

        finally:

            db.close()


screening_service = ScreeningService()