from paddleocr import PaddleOCR

from app.services.ocr.field_extractor import extract_document_fields
from app.services.ocr.mrz_detector import detect_mrz


class OCRService:
    def __init__(self):
        self.ocr = PaddleOCR(
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=False,
            enable_mkldnn=False,
            device="cpu",
        )

    def process(self, image_path: str) -> dict:
        results = self.ocr.predict(input=image_path)

        regions = []
        full_text_parts = []

        for result in results:
            data = result.json

            if callable(data):
                data = data()

            if isinstance(data, dict) and "res" in data:
                data = data["res"]

            texts = data.get("rec_texts", [])
            scores = data.get("rec_scores", [])
            polygons = data.get(
                "rec_polys",
                data.get("dt_polys", []),
            )

            for index, text in enumerate(texts):
                text = str(text).strip()

                if not text:
                    continue

                score = (
                    float(scores[index])
                    if index < len(scores)
                    else 0.0
                )

                bbox = []

                if index < len(polygons):
                    polygon = polygons[index]

                    if hasattr(polygon, "tolist"):
                        bbox = polygon.tolist()
                    else:
                        bbox = polygon

                regions.append(
                    {
                        "text": text,
                        "confidence": round(score, 4),
                        "bbox": bbox,
                    }
                )

                full_text_parts.append(text)

        full_text = "\n".join(full_text_parts)

        fields = extract_document_fields(regions)
        mrz = detect_mrz(full_text)

        return {
            "full_text": full_text,
            "regions": regions,
            "region_count": len(regions),
            "fields": fields.model_dump(),
            "mrz": mrz.model_dump(),
        }


ocr_service = OCRService()