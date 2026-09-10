from pathlib import Path

import cv2
import numpy as np


class TamperingService:
    """
    Prototype image-forensics service.

    Produces explainable image-level signals that can later
    be combined with OCR, MRZ, database and face signals.
    """

    def process(self, image_path: str) -> dict:
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Unable to read the document image.")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        height, width = gray.shape

        if height < 100 or width < 100:
            raise ValueError("Document image is too small for forensic analysis.")

        signals = []

        # ---------------------------------------------------------
        # Signal 1: Image quality
        # ---------------------------------------------------------

        blur_score = self._calculate_blur_score(gray)

        if blur_score < 50:
            signals.append(
                {
                    "name": "low_sharpness",
                    "severity": "medium",
                    "message": "Document image has low sharpness.",
                }
            )

        # ---------------------------------------------------------
        # Signal 2: Edge density
        # ---------------------------------------------------------

        edge_density = self._calculate_edge_density(gray)

        if edge_density < 0.01:
            signals.append(
                {
                    "name": "low_edge_density",
                    "severity": "low",
                    "message": "Document contains unusually low edge detail.",
                }
            )

        # ---------------------------------------------------------
        # Signal 3: Local texture consistency
        # ---------------------------------------------------------

        texture_score = self._calculate_texture_consistency(gray)

        if texture_score > 0.35:
            signals.append(
                {
                    "name": "texture_inconsistency",
                    "severity": "high",
                    "message": "Localized texture inconsistency detected.",
                }
            )

        # ---------------------------------------------------------
        # Signal 4: Noise consistency
        # ---------------------------------------------------------

        noise_score = self._calculate_noise_inconsistency(gray)

        if noise_score > 0.30:
            signals.append(
                {
                    "name": "noise_inconsistency",
                    "severity": "high",
                    "message": "Localized image-noise inconsistency detected.",
                }
            )

        # ---------------------------------------------------------
        # Signal 5: Local intensity anomalies
        # ---------------------------------------------------------

        intensity_score = self._calculate_intensity_anomaly(gray)

        if intensity_score > 0.30:
            signals.append(
                {
                    "name": "intensity_anomaly",
                    "severity": "medium",
                    "message": "Localized intensity anomaly detected.",
                }
            )

        # ---------------------------------------------------------
        # Combine signals
        # ---------------------------------------------------------

        tampering_score = self._calculate_tampering_score(
            texture_score=texture_score,
            noise_score=noise_score,
            intensity_score=intensity_score,
            blur_score=blur_score,
        )

        suspicious = tampering_score >= 50

        return {
            "image": {
                "filename": Path(image_path).name,
                "width": width,
                "height": height,
            },
            "tampering_score": tampering_score,
            "suspicious": suspicious,
            "signals": {
                "blur_score": round(blur_score, 4),
                "edge_density": round(edge_density, 4),
                "texture_inconsistency": round(texture_score, 4),
                "noise_inconsistency": round(noise_score, 4),
                "intensity_anomaly": round(intensity_score, 4),
            },
            "reasons": signals,
        }

    # =============================================================
    # Image analysis functions
    # =============================================================

    def _calculate_blur_score(self, gray: np.ndarray) -> float:
        """
        Variance of Laplacian is a simple sharpness measure.
        Higher generally means a sharper image.
        """

        variance = cv2.Laplacian(gray, cv2.CV_64F).var()

        return min(float(variance), 500.0) / 5.0

    def _calculate_edge_density(self, gray: np.ndarray) -> float:
        edges = cv2.Canny(gray, 100, 200)

        edge_pixels = np.count_nonzero(edges)
        total_pixels = edges.size

        return edge_pixels / total_pixels

    def _calculate_texture_consistency(self, gray: np.ndarray) -> float:
        """
        Compare local texture variance across image blocks.

        Edited regions can sometimes have different texture statistics
        from their surrounding document area.
        """

        block_size = 32

        variances = []

        height, width = gray.shape

        for y in range(0, height - block_size + 1, block_size):
            for x in range(0, width - block_size + 1, block_size):
                block = gray[
                    y : y + block_size,
                    x : x + block_size,
                ]

                variances.append(float(np.var(block)))

        if len(variances) < 2:
            return 0.0

        variances = np.array(variances)

        median = np.median(variances)

        if median == 0:
            return 0.0

        deviations = np.abs(variances - median) / (median + 1e-6)

        anomalous_ratio = np.mean(deviations > 1.5)

        return float(anomalous_ratio)

    def _calculate_noise_inconsistency(self, gray: np.ndarray) -> float:
        """
        Estimate high-frequency noise and compare local blocks.
        """

        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        noise = cv2.absdiff(gray, blurred)

        block_size = 32

        noise_values = []

        height, width = gray.shape

        for y in range(0, height - block_size + 1, block_size):
            for x in range(0, width - block_size + 1, block_size):
                block = noise[
                    y : y + block_size,
                    x : x + block_size,
                ]

                noise_values.append(float(np.mean(block)))

        if len(noise_values) < 2:
            return 0.0

        values = np.array(noise_values)

        median = np.median(values)

        if median == 0:
            return 0.0

        deviations = np.abs(values - median) / (median + 1e-6)

        anomalous_ratio = np.mean(deviations > 1.5)

        return float(anomalous_ratio)

    def _calculate_intensity_anomaly(self, gray: np.ndarray) -> float:
        """
        Look for blocks whose average intensity differs strongly
        from neighboring blocks.
        """

        block_size = 32

        means = []

        height, width = gray.shape

        for y in range(0, height - block_size + 1, block_size):
            for x in range(0, width - block_size + 1, block_size):
                block = gray[
                    y : y + block_size,
                    x : x + block_size,
                ]

                means.append(float(np.mean(block)))

        if len(means) < 2:
            return 0.0

        values = np.array(means)

        median = np.median(values)

        deviations = np.abs(values - median) / 255.0

        anomalous_ratio = np.mean(deviations > 0.25)

        return float(anomalous_ratio)

    def _calculate_tampering_score(
        self,
        texture_score: float,
        noise_score: float,
        intensity_score: float,
        blur_score: float,
    ) -> int:

        # Image-forensics signals.
        score = 0.0

        score += texture_score * 40
        score += noise_score * 40
        score += intensity_score * 20

        # Very blurry images should not automatically be considered
        # tampered. We only add a small uncertainty penalty.
        if blur_score < 10:
            score += 5

        return max(0, min(100, round(score)))


tampering_service = TamperingService()