import hashlib
import json


class IntegrityService:

    def canonicalize(self, data: dict) -> str:
        """
        Convert screening data into a deterministic JSON string.

        The same data will always produce the same canonical
        representation and therefore the same SHA-256 hash.
        """

        return json.dumps(
            data,
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=False,
        )

    def generate_hash(self, data: dict) -> str:
        """
        Generate a SHA-256 integrity hash for screening data.
        """

        canonical_data = self.canonicalize(data)

        return hashlib.sha256(
            canonical_data.encode("utf-8")
        ).hexdigest()

    def verify_hash(
        self,
        data: dict,
        expected_hash: str,
    ) -> bool:
        """
        Verify whether the current data matches
        the previously generated integrity hash.
        """

        actual_hash = self.generate_hash(data)

        return actual_hash == expected_hash


integrity_service = IntegrityService()