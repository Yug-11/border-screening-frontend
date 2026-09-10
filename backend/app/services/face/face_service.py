import cv2
import numpy as np
from insightface.app import FaceAnalysis


class FaceService:
    def __init__(self):
        self.app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"],
        )

        self.app.prepare(
            ctx_id=0,
            det_size=(640, 640),
        )

    def _read_image(self, image_path: str):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError(
                f"Could not read image: {image_path}"
            )

        return image

    def _get_faces(self, image):
        faces = self.app.get(image)

        return faces

    def _select_face(self, faces):
        if not faces:
            return None

        # Select the largest detected face.
        face = max(
            faces,
            key=lambda item: (
                (item.bbox[2] - item.bbox[0])
                * (item.bbox[3] - item.bbox[1])
            ),
        )

        return face

    def verify(
        self,
        document_image_path: str,
        verification_image_path: str,
        threshold: float = 0.60,
    ) -> dict:

        document_image = self._read_image(
            document_image_path
        )

        verification_image = self._read_image(
            verification_image_path
        )

        document_faces = self._get_faces(
            document_image
        )

        verification_faces = self._get_faces(
            verification_image
        )

        if not document_faces:
            return {
                "status": "NO_FACE_IN_DOCUMENT",
                "match": False,
                "similarity": None,
                "threshold": threshold,
                "document_faces_detected": 0,
                "verification_faces_detected": len(
                    verification_faces
                ),
            }

        if not verification_faces:
            return {
                "status": "NO_FACE_IN_VERIFICATION_IMAGE",
                "match": False,
                "similarity": None,
                "threshold": threshold,
                "document_faces_detected": len(
                    document_faces
                ),
                "verification_faces_detected": 0,
            }

        document_face = self._select_face(
            document_faces
        )

        verification_face = self._select_face(
            verification_faces
        )

        document_embedding = np.asarray(
            document_face.embedding,
            dtype=np.float32,
        )

        verification_embedding = np.asarray(
            verification_face.embedding,
            dtype=np.float32,
        )

        # Normalize embeddings.
        document_embedding /= (
            np.linalg.norm(document_embedding) + 1e-8
        )

        verification_embedding /= (
            np.linalg.norm(verification_embedding) + 1e-8
        )

        similarity = float(
            np.dot(
                document_embedding,
                verification_embedding,
            )
        )

        match = similarity >= threshold

        return {
            "status": "MATCH" if match else "MISMATCH",
            "match": bool(match),
            "similarity": round(similarity, 4),
            "threshold": threshold,
            "document_faces_detected": len(
                document_faces
            ),
            "verification_faces_detected": len(
                verification_faces
            ),
        }


face_service = FaceService()