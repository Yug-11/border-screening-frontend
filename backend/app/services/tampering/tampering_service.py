import cv2
import numpy as np


IMPORTANT_FIELDS = {
    "passport_number": [
        "PASSPORT NO",
        "PASSPORT NO.",
    ],
    "surname": [
        "SURNAME",
    ],
    "given_names": [
        "NAME",
        "GIVEN NAME",
        "GIVEN NAMES",
    ],
    "date_of_birth": [
        "DOB",
        "DATE OF BIRTH",
    ],
    "nationality": [
        "NATIONALITY",
    ],
    "place_of_birth": [
        "BIRTH PLACE",
        "PLACE OF BIRTH",
    ],
    "place_of_issue": [
        "PLACE OF ISSUE",
    ],
    "date_of_issue": [
        "DATE OF ISSUE",
    ],
    "date_of_expiry": [
        "DATE OF EXPIRY",
        "DATE OF EXPIRY",
    ],
}


def _to_native(value):
    """
    Convert NumPy values into normal Python values
    so FastAPI can safely serialize the response.
    """
    if isinstance(value, np.bool_):
        return bool(value)

    if isinstance(value, np.integer):
        return int(value)

    if isinstance(value, np.floating):
        return float(value)

    return value


def _normalize(text: str) -> str:
    return " ".join(str(text).upper().split())


def _bbox_to_rect(bbox):
    """
    Convert OCR polygon points into:
    x1, y1, x2, y2
    """
    if not bbox:
        return None

    try:
        points = np.asarray(bbox, dtype=np.float32)

        if points.ndim != 2 or points.shape[1] != 2:
            return None

        x1 = int(np.min(points[:, 0]))
        y1 = int(np.min(points[:, 1]))
        x2 = int(np.max(points[:, 0]))
        y2 = int(np.max(points[:, 1]))

        if x2 <= x1 or y2 <= y1:
            return None

        return x1, y1, x2, y2

    except Exception:
        return None


def _expand_rect(rect, width, height, padding=20):
    x1, y1, x2, y2 = rect

    return (
        max(0, x1 - padding),
        max(0, y1 - padding),
        min(width, x2 + padding),
        min(height, y2 + padding),
    )


def _crop(gray, rect):
    x1, y1, x2, y2 = rect

    crop = gray[y1:y2, x1:x2]

    if crop.size == 0:
        return None

    return crop


def _edge_density(gray):
    edges = cv2.Canny(gray, 80, 160)

    return float(np.mean(edges > 0))


def _texture_variance(gray):
    return float(np.var(gray))


def _noise_level(gray):
    """
    Estimate high-frequency noise.
    """
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    noise = cv2.absdiff(gray, blurred)

    return float(np.mean(noise))


def _sharpness(gray):
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def _field_anomaly_score(
    field_crop,
    surrounding_crop,
):
    """
    Compare a field region with its surrounding document region.

    This is NOT a definitive forgery detector.
    It is a forensic screening signal.
    """

    if field_crop is None or surrounding_crop is None:
        return {
            "score": 0,
            "suspicious": False,
            "signals": {},
            "reasons": [],
        }

    field_texture = _texture_variance(field_crop)
    field_noise = _noise_level(field_crop)
    field_edges = _edge_density(field_crop)
    field_sharpness = _sharpness(field_crop)

    surrounding_texture = _texture_variance(surrounding_crop)
    surrounding_noise = _noise_level(surrounding_crop)
    surrounding_edges = _edge_density(surrounding_crop)

    # Avoid division by zero.
    texture_ratio = field_texture / max(surrounding_texture, 1.0)
    noise_ratio = field_noise / max(surrounding_noise, 0.1)
    edge_ratio = field_edges / max(surrounding_edges, 0.001)

    score = 0
    reasons = []

    # Extremely high local texture relative to nearby document area.
    if texture_ratio > 2.5:
        score += 30
        reasons.append(
            {
                "name": "local_texture_difference",
                "severity": "medium",
                "message": "The field has substantially different local texture from its surrounding document area.",
            }
        )

    # Different high-frequency noise can indicate editing/re-rendering.
    if noise_ratio > 2.0:
        score += 30
        reasons.append(
            {
                "name": "local_noise_difference",
                "severity": "medium",
                "message": "The field has a noticeably different noise pattern from nearby document regions.",
            }
        )

    # Strong edge-density difference.
    if edge_ratio > 2.5:
        score += 20
        reasons.append(
            {
                "name": "local_edge_difference",
                "severity": "low",
                "message": "The field has a substantially different edge pattern from its surrounding area.",
            }
        )

    # Very high sharpness can indicate a separately rendered/edited region.
    if field_sharpness > 1500:
        score += 20
        reasons.append(
            {
                "name": "unusual_field_sharpness",
                "severity": "low",
                "message": "The field contains unusually sharp local detail.",
            }
        )

    score = min(score, 100)

    return {
        "score": int(score),
        "suspicious": bool(score >= 50),
        "signals": {
            "texture_ratio": round(texture_ratio, 4),
            "noise_ratio": round(noise_ratio, 4),
            "edge_ratio": round(edge_ratio, 4),
            "field_sharpness": round(field_sharpness, 2),
        },
        "reasons": reasons,
    }


def _extract_field_regions(ocr_regions, image_width, image_height):
    """
    Convert OCR regions into field/value regions.

    We look for known labels and associate the closest
    OCR text below the label.
    """

    detected = {}

    for index, region in enumerate(ocr_regions):
        text = _normalize(region.get("text", ""))
        bbox = _bbox_to_rect(region.get("bbox", []))

        if not text or bbox is None:
            continue

        for field_name, labels in IMPORTANT_FIELDS.items():
            normalized_labels = [_normalize(label) for label in labels]

            if text not in normalized_labels:
                continue

            label_x1, label_y1, label_x2, label_y2 = bbox

            best_candidate = None
            best_distance = None

            for candidate_index, candidate in enumerate(ocr_regions):
                if candidate_index == index:
                    continue

                candidate_text = _normalize(candidate.get("text", ""))
                candidate_bbox = _bbox_to_rect(candidate.get("bbox", []))

                if not candidate_text or candidate_bbox is None:
                    continue

                cx1, cy1, cx2, cy2 = candidate_bbox

                # Candidate should be below the label.
                if cy1 <= label_y2:
                    continue

                # Candidate should be reasonably close horizontally.
                horizontal_distance = abs(cx1 - label_x1)

                if horizontal_distance > 150:
                    continue

                vertical_distance = cy1 - label_y2

                distance = vertical_distance + horizontal_distance * 0.25

                if best_distance is None or distance < best_distance:
                    best_distance = distance
                    best_candidate = candidate_bbox

            if best_candidate is not None:
                detected[field_name] = best_candidate

    return detected


def analyze_field_aware_tampering(image_path: str, ocr_regions: list[dict]):
    """
    Field-aware Layer 1 tampering analysis.

    Uses OCR bounding boxes to focus forensic analysis
    around important document fields.
    """

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Could not read the uploaded image.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    height, width = gray.shape[:2]

    field_regions = _extract_field_regions(
        ocr_regions,
        width,
        height,
    )

    results = []

    for field_name, field_rect in field_regions.items():

        # Analyze a padded region around the field.
        field_rect = _expand_rect(
            field_rect,
            width,
            height,
            padding=12,
        )

        # Create a larger surrounding region.
        surrounding_rect = _expand_rect(
            field_rect,
            width,
            height,
            padding=45,
        )

        field_crop = _crop(gray, field_rect)
        surrounding_crop = _crop(gray, surrounding_rect)

        result = _field_anomaly_score(
            field_crop,
            surrounding_crop,
        )

        results.append(
            {
                "field": field_name,
                "bbox": [int(v) for v in field_rect],
                **result,
            }
        )

    suspicious_fields = [
        item
        for item in results
        if item["suspicious"]
    ]

    if results:
        overall_score = max(
            item["score"]
            for item in results
        )
    else:
        overall_score = 0

    overall_score = int(min(overall_score, 100))

    reasons = []

    if suspicious_fields:
        reasons.append(
            {
                "name": "field_level_anomaly",
                "severity": "high",
                "message": (
                    f"{len(suspicious_fields)} document field(s) "
                    "show unusual local visual characteristics."
                ),
            }
        )

    return {
        "tampering_score": overall_score,
        "suspicious": bool(overall_score >= 50),
        "fields_analyzed": len(results),
        "suspicious_field_count": len(suspicious_fields),
        "field_results": results,
        "reasons": reasons,
    }

class TamperingService:
    def process(self, image_path: str) -> dict:
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Could not read the uploaded image.")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        blur_score = float(
            cv2.Laplacian(gray, cv2.CV_64F).var()
        )

        edge_density = float(
            np.mean(cv2.Canny(gray, 80, 160) > 0)
        )

        return {
            "tampering_score": 0,
            "suspicious": False,
            "signals": {
                "blur_score": round(blur_score, 2),
                "edge_density": round(edge_density, 4),
            },
            "anomaly_regions": [],
            "reasons": [],
        }


tampering_service = TamperingService()