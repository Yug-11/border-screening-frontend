import re

from app.schemas.document import MRZResult


MRZ_LENGTH = 44


def clean_mrz_line(line: str) -> str:
    return re.sub(r"\s+", "", line.upper().strip())


def is_mrz_character_string(line: str) -> bool:
    return bool(re.fullmatch(r"[A-Z0-9<]+", line))


def check_digit_value(character: str) -> int:
    if character == "<":
        return 0

    if character.isdigit():
        return int(character)

    return ord(character) - ord("A") + 10


def calculate_check_digit(value: str) -> str:
    weights = [7, 3, 1]
    total = 0

    for index, character in enumerate(value):
        total += check_digit_value(character) * weights[index % 3]

    return str(total % 10)


def validate_check_digit(value: str, expected_digit: str) -> bool:
    if len(value) == 0 or not expected_digit.isdigit():
        return False

    return calculate_check_digit(value) == expected_digit


def parse_td3_mrz(lines: list[str]) -> MRZResult:
    line1 = clean_mrz_line(lines[0])
    line2 = clean_mrz_line(lines[1])

    # ---------------------------------------------------------
    # TD3 structural validation
    # ---------------------------------------------------------

    if len(line1) != MRZ_LENGTH or len(line2) != MRZ_LENGTH:
        return invalid_mrz(lines)

    if not is_mrz_character_string(line1) or not is_mrz_character_string(line2):
        return invalid_mrz(lines)

    # TD3 passport MRZ line 1 begins with P<
    if not line1.startswith("P<"):
        return invalid_mrz(lines)

    # ---------------------------------------------------------
    # TD3 line 2 fields
    #
    # 0-8   document number
    # 9     document number check digit
    # 10-12 nationality
    # 13-18 date of birth YYMMDD
    # 19    DOB check digit
    # 20    sex
    # 21-26 expiry date YYMMDD
    # 27    expiry check digit
    # 28-41 optional data
    # 42    optional data check digit
    # 43    composite check digit
    # ---------------------------------------------------------

    document_number_raw = line2[0:9]
    document_number_check = line2[9]

    nationality = line2[10:13]

    date_of_birth = line2[13:19]
    date_of_birth_check = line2[19]

    sex = line2[20]

    expiry_date = line2[21:27]
    expiry_date_check = line2[27]

    optional_data = line2[28:42]
    optional_data_check = line2[42]

    composite_check = line2[43]

    # ---------------------------------------------------------
    # Individual check digits
    # ---------------------------------------------------------

    document_number_valid = validate_check_digit(
        document_number_raw,
        document_number_check,
    )

    date_of_birth_valid = validate_check_digit(
        date_of_birth,
        date_of_birth_check,
    )

    expiry_date_valid = validate_check_digit(
        expiry_date,
        expiry_date_check,
    )

    optional_data_valid = validate_check_digit(
        optional_data,
        optional_data_check,
    )

    # Composite check digit covers:
    #
    # document number + check digit
    # DOB + check digit
    # expiry + check digit
    # optional data + check digit
    #
    composite_data = (
        document_number_raw
        + document_number_check
        + date_of_birth
        + date_of_birth_check
        + expiry_date
        + expiry_date_check
        + optional_data
        + optional_data_check
    )

    composite_valid = validate_check_digit(
        composite_data,
        composite_check,
    )

    valid_format = all(
        [
            document_number_valid,
            date_of_birth_valid,
            expiry_date_valid,
            optional_data_valid,
            composite_valid,
        ]
    )

    if not valid_format:
        return MRZResult(
            detected=True,
            valid_format=False,
            lines=[line1, line2],
            document_number=None,
            nationality=None,
            date_of_birth=None,
            expiry_date=None,
        )

    # ---------------------------------------------------------
    # Valid MRZ
    # ---------------------------------------------------------

    document_number = document_number_raw.replace("<", "")
    nationality = nationality.replace("<", "")

    return MRZResult(
        detected=True,
        valid_format=True,
        lines=[line1, line2],
        document_number=document_number or None,
        nationality=nationality or None,
        date_of_birth=date_of_birth,
        expiry_date=expiry_date,
    )


def invalid_mrz(lines: list[str]) -> MRZResult:
    return MRZResult(
        detected=True,
        valid_format=False,
        lines=lines,
        document_number=None,
        nationality=None,
        date_of_birth=None,
        expiry_date=None,
    )


def detect_mrz(full_text: str) -> MRZResult:
    raw_lines = [
        line.strip()
        for line in full_text.splitlines()
        if line.strip()
    ]

    candidates = []

    for line in raw_lines:
        cleaned = clean_mrz_line(line)

        if (
            len(cleaned) >= 30
            and "<" in cleaned
            and is_mrz_character_string(cleaned)
        ):
            candidates.append(cleaned)

    valid_length_lines = [
        line
        for line in candidates
        if len(line) == MRZ_LENGTH
    ]

    # Need two TD3 lines.
    if len(valid_length_lines) >= 2:
        return parse_td3_mrz(valid_length_lines[-2:])

    if candidates:
        return invalid_mrz(candidates)

    return MRZResult(
        detected=False,
        valid_format=False,
        lines=[],
        document_number=None,
        nationality=None,
        date_of_birth=None,
        expiry_date=None,
    )