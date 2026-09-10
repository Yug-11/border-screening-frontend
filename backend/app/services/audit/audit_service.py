from datetime import datetime, timezone
from uuid import uuid4


class AuditService:
    def __init__(self):
        self.records = {}

    def create_record(
        self,
        screening_id: str,
        officer_id: str = "demo-officer-001",
        checkpoint: str = "DELHI-DEMO-01",
        risk_score: int = 0,
        decision: str = "CLEAR",
    ) -> dict:
        audit_id = str(uuid4())

        record = {
            "audit_id": audit_id,
            "screening_id": screening_id,
            "action": "SCREENING_COMPLETED",
            "officer_id": officer_id,
            "checkpoint": checkpoint,
            "risk_score": risk_score,
            "decision": decision,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        self.records[audit_id] = record

        return record

    def get_by_screening_id(self, screening_id: str) -> list[dict]:
        return [
            record
            for record in self.records.values()
            if record["screening_id"] == screening_id
        ]


audit_service = AuditService()