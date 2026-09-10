import json
from pathlib import Path


class IdentityService:
    def __init__(self):
        self.data_path = (
            Path(__file__).resolve().parents[2]
            / "data"
            / "reference_records.json"
        )

        self.records = self._load_records()

    def _load_records(self):
        if not self.data_path.exists():
            raise FileNotFoundError(
                f"Reference database not found: {self.data_path}"
            )

        with open(
            self.data_path,
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)

    def lookup(self, passport_number: str) -> dict:
        passport_number = passport_number.strip().upper()

        record = next(
            (
                item
                for item in self.records
                if item.get("passport_number", "").upper()
                == passport_number
            ),
            None,
        )

        if record is None:
            return {
                "found": False,
                "status": "NOT_FOUND",
                "passport_number": passport_number,
                "watchlist_status": "UNKNOWN",
                "identity": None,
            }

        document_status = record.get(
            "status",
            "UNKNOWN",
        )

        watchlist_status = record.get(
            "watchlist_status",
            "CLEAR",
        )

        if watchlist_status == "REVIEW":
            overall_status = "WATCHLIST_REVIEW"
        elif document_status == "EXPIRED":
            overall_status = "EXPIRED"
        else:
            overall_status = "VALID"

        return {
            "found": True,
            "status": overall_status,
            "passport_number": record.get(
                "passport_number"
            ),
            "document_status": document_status,
            "watchlist_status": watchlist_status,
            "identity": {
                "surname": record.get("surname"),
                "given_names": record.get("given_names"),
                "date_of_birth": record.get(
                    "date_of_birth"
                ),
                "nationality": record.get(
                    "nationality"
                ),
                "date_of_expiry": record.get(
                    "date_of_expiry"
                ),
            },
        }


identity_service = IdentityService()