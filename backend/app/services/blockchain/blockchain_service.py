from datetime import datetime, timezone
import uuid


class BlockchainService:

    def __init__(self):
        # Local development ledger.
        #
        # This is only a prototype adapter.
        # It will later be replaced/connected to
        # Hyperledger Fabric.
        #
        # Each screening has one active integrity proof.
        self.ledger = {}

    def record_integrity_proof(
        self,
        screening_id: str,
        integrity_hash: str,
    ) -> dict:
        """
        Store or replace the active integrity proof
        for a screening in the development blockchain ledger.
        """

        transaction_id = str(uuid.uuid4())

        timestamp = datetime.now(
            timezone.utc
        ).isoformat()

        proof = {
            "transaction_id": transaction_id,
            "screening_id": screening_id,
            "integrity_hash": integrity_hash,
            "algorithm": "SHA-256",
            "timestamp": timestamp,
            "network": "LOCAL-DEMO",
            "status": "CONFIRMED",
        }

        # Store the latest proof as the active proof
        # for this screening.
        self.ledger[screening_id] = proof

        return proof

    def get_integrity_proof(
        self,
        screening_id: str,
    ) -> dict | None:
        """
        Retrieve the latest active blockchain proof
        for a screening.
        """

        return self.ledger.get(
            screening_id
        )

    def verify_integrity_proof(
        self,
        screening_id: str,
        integrity_hash: str,
    ) -> dict:
        """
        Compare the current screening hash against
        the latest hash stored in the blockchain ledger.
        """

        proof = self.get_integrity_proof(
            screening_id
        )

        if not proof:
            return {
                "verified": False,
                "status": "PROOF_NOT_FOUND",
                "screening_id": screening_id,
            }

        hash_match = (
            proof["integrity_hash"]
            == integrity_hash
        )

        return {
            "verified": hash_match,
            "status": (
                "VALID"
                if hash_match
                else "TAMPERED"
            ),
            "screening_id": screening_id,
            "transaction_id": proof[
                "transaction_id"
            ],
            "stored_hash": proof[
                "integrity_hash"
            ],
            "calculated_hash": integrity_hash,
            "timestamp": proof[
                "timestamp"
            ],
            "network": proof[
                "network"
            ],
        }


blockchain_service = BlockchainService()