import re

from app.schemas.document import DocumentFields


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def find_value_after_label(
    regions: list[dict],
    labels: list[str],
) -> str | None:
    """
    Find a value located directly below a label.

    We use OCR bounding boxes instead of relying only on
    OCR text ordering.
    """

    normalized_labels = {
        normalize_text(label).upper()
        for label in labels
    }

    for index, region in enumerate(regions):
        text = normalize_text(region["text"])
        upper_text = text.upper()

        if upper_text not in normalized_labels:
            continue

        label_bbox = region["bbox"]

        if not label_bbox:
            continue

        label_x = min(point[0] for point in label_bbox)
        label_y = max(point[1] for point in label_bbox)

        candidates = []

        for candidate in regions:
            candidate_text = normalize_text(candidate["text"])

            if not candidate_text:
                continue

            candidate_bbox = candidate["bbox"]

            if not candidate_bbox:
                continue

            candidate_x = min(
                point[0] for point in candidate_bbox
            )
            candidate_y = min(
                point[1] for point in candidate_bbox
            )

            # Value should be below the label and reasonably
            # aligned horizontally.
            if (
                candidate_y > label_y
                and abs(candidate_x - label_x) < 80
            ):
                distance = candidate_y - label_y
                candidates.append(
                    (distance, candidate_text)
                )

        if candidates:
            candidates.sort(key=lambda item: item[0])
            return candidates[0][1]

    return None


def extract_document_fields(
    regions: list[dict],
) -> DocumentFields:

    passport_number = find_value_after_label(
        regions,
        ["PASSPORT NO", "PASSPORT NO."],
    )

    surname = find_value_after_label(
        regions,
        ["SURNAME"],
    )

    given_names = find_value_after_label(
        regions,
        ["NAME"],
    )

    date_of_birth = find_value_after_label(
        regions,
        ["DOB"],
    )

    nationality = find_value_after_label(
        regions,
        ["NATIONALITY"],
    )

    place_of_birth = find_value_after_label(
        regions,
        ["BIRTH PLACE (CITY, STATE)"],
    )

    place_of_issue = find_value_after_label(
        regions,
        ["PLACE OF ISSUE", "PLACE OFISSUE"],
    )

    # The two dates are horizontally separated, so we handle
    # them using their spatial positions.
    date_of_issue = find_value_after_label(
        regions,
        ["DATE OF ISSUE"],
    )

    date_of_expiry = find_value_after_label(
        regions,
        ["DATE OF EXPIRY"],
    )

    # Remove accidental OCR prefixes from nationality.
    if nationality:
        nationality = nationality.replace(
            "P ",
            "",
            1,
        ).strip()

    return DocumentFields(
        document_type="passport",
        passport_number=passport_number,
        surname=surname,
        given_names=given_names,
        date_of_birth=date_of_birth,
        nationality=nationality,
        place_of_birth=place_of_birth,
        place_of_issue=place_of_issue,
        date_of_issue=date_of_issue,
        date_of_expiry=date_of_expiry,
    )