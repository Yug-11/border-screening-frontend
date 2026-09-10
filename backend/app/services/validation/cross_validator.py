from app.services.validation.reference_validator import find_reference_record


def normalize(value: str | None) -> str:
    if value is None:
        return ""

    return " ".join(value.strip().upper().split())


def compare_field(
    field: str,
    ocr_value: str | None,
    reference_value: str | None,
    mismatches: list[dict],
):
    if normalize(ocr_value) != normalize(reference_value):
        mismatches.append(
            {
                "source": "ocr_vs_reference",
                "field": field,
                "ocr_value": ocr_value,
                "reference_value": reference_value,
            }
        )


def cross_validate(ocr_fields: dict, mrz: dict) -> dict:
    passport_number = ocr_fields.get("passport_number")

    reference_record = find_reference_record(passport_number)

    mismatches = []
    warnings = []

    # ---------------------------------------------------------
    # 1. OCR vs Reference Database
    # ---------------------------------------------------------

    if reference_record is None:
        warnings.append("Passport number was not found in the reference database.")
    else:
        compare_field(
            "surname",
            ocr_fields.get("surname"),
            reference_record.get("surname"),
            mismatches,
        )

        compare_field(
            "given_names",
            ocr_fields.get("given_names"),
            reference_record.get("given_names"),
            mismatches,
        )

        compare_field(
            "date_of_birth",
            ocr_fields.get("date_of_birth"),
            reference_record.get("date_of_birth"),
            mismatches,
        )

        compare_field(
            "nationality",
            ocr_fields.get("nationality"),
            reference_record.get("nationality"),
            mismatches,
        )

        compare_field(
            "date_of_expiry",
            ocr_fields.get("date_of_expiry"),
            reference_record.get("date_of_expiry"),
            mismatches,
        )

    # ---------------------------------------------------------
    # 2. MRZ validation
    # ---------------------------------------------------------

    mrz_detected = bool(mrz.get("detected"))
    mrz_valid = bool(mrz.get("valid_format"))

    if not mrz_detected:
        warnings.append("MRZ was not detected.")

    elif not mrz_valid:
        warnings.append(
            "MRZ was detected but failed structural/check-digit validation."
        )

    # ---------------------------------------------------------
    # 3. Compare MRZ with OCR only when MRZ is trustworthy
    # ---------------------------------------------------------

    if mrz_detected and mrz_valid:

        mrz_document_number = mrz.get("document_number")
        mrz_nationality = mrz.get("nationality")
        mrz_dob = mrz.get("date_of_birth")
        mrz_expiry = mrz.get("expiry_date")

        if normalize(mrz_document_number) != normalize(
            ocr_fields.get("passport_number")
        ):
            mismatches.append(
                {
                    "source": "mrz_vs_ocr",
                    "field": "passport_number",
                    "mrz_value": mrz_document_number,
                    "ocr_value": ocr_fields.get("passport_number"),
                }
            )

        if normalize(mrz_nationality) != normalize(
            ocr_fields.get("nationality")
        ):
            mismatches.append(
                {
                    "source": "mrz_vs_ocr",
                    "field": "nationality",
                    "mrz_value": mrz_nationality,
                    "ocr_value": ocr_fields.get("nationality"),
                }
            )

        # MRZ DOB is YYMMDD, while OCR uses DD-MM-YYYY.
        ocr_dob = ocr_fields.get("date_of_birth")

        if ocr_dob and mrz_dob and len(mrz_dob) == 6:
            day = mrz_dob[4:6]
            month = mrz_dob[2:4]
            year = mrz_dob[0:2]

            # Demo convention: 00-49 => 2000-2049, 50-99 => 1950-1999.
            full_year = (
                f"20{year}" if int(year) <= 49 else f"19{year}"
            )

            normalized_mrz_dob = f"{day}-{month}-{full_year}"

            if normalize(normalized_mrz_dob) != normalize(ocr_dob):
                mismatches.append(
                    {
                        "source": "mrz_vs_ocr",
                        "field": "date_of_birth",
                        "mrz_value": normalized_mrz_dob,
                        "ocr_value": ocr_dob,
                    }
                )

    # ---------------------------------------------------------
    # 4. Final result
    # ---------------------------------------------------------

    if mismatches:
        status = "INCONSISTENT"
    elif warnings:
        status = "REVIEW"
    else:
        status = "CONSISTENT"

    return {
        "status": status,
        "consistent": len(mismatches) == 0,
        "passport_number": passport_number,
        "mismatches": mismatches,
        "warnings": warnings,
        "sources_checked": {
            "ocr": True,
            "reference_database": reference_record is not None,
            "mrz": mrz_detected,
            "mrz_trusted": mrz_valid,
        },
    }