import json
from pathlib import Path
from datetime import datetime


REFERENCE_FILE = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "reference_records.json"
)


def load_reference_records() -> list[dict]:
    with open(REFERENCE_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize(value: str | None) -> str:
    if value is None:
        return ""

    return " ".join(value.strip().upper().split())


def find_reference_record(passport_number: str | None) -> dict | None:
    if not passport_number:
        return None

    target = normalize(passport_number)

    for record in load_reference_records():
        if normalize(record["passport_number"]) == target:
            return record

    return None


def validate_document(ocr_fields: dict) -> dict:
    passport_number = ocr_fields.get("passport_number")

    reference_record = find_reference_record(passport_number)

    if reference_record is None:
        return {
            "status": "NOT_FOUND",
            "database_match": False,
            "passport_number": passport_number,
            "field_mismatches": [],
            "reference_record": None,
        }

    fields_to_compare = {
        "surname": "surname",
        "given_names": "given_names",
        "date_of_birth": "date_of_birth",
        "nationality": "nationality",
        "date_of_expiry": "date_of_expiry",
    }

    mismatches = []

    for ocr_field, reference_field in fields_to_compare.items():
        ocr_value = normalize(ocr_fields.get(ocr_field))
        reference_value = normalize(reference_record.get(reference_field))

        if ocr_value != reference_value:
            mismatches.append(
                {
                    "field": ocr_field,
                    "ocr_value": ocr_fields.get(ocr_field),
                    "reference_value": reference_record.get(reference_field),
                }
            )

    expiry_status = check_expiry(reference_record.get("date_of_expiry"))

    if mismatches:
        status = "MISMATCH"
        database_match = False
    elif expiry_status == "EXPIRED":
        status = "EXPIRED"
        database_match = True
    else:
        status = "VALID"
        database_match = True

    return {
        "status": status,
        "database_match": database_match,
        "passport_number": passport_number,
        "field_mismatches": mismatches,
        "reference_record": reference_record,
    }


def check_expiry(expiry_date: str | None) -> str:
    if not expiry_date:
        return "UNKNOWN"

    try:
        expiry = datetime.strptime(expiry_date, "%d-%m-%Y").date()
        today = datetime.today().date()

        if expiry < today:
            return "EXPIRED"

        return "ACTIVE"

    except ValueError:
        return "UNKNOWN"