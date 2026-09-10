from app.services.blockchain.blockchain_service import (
    blockchain_service,
)


screening_id = "DEMO-SCREENING-001"

original_hash = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
)


# --------------------------------------------------
# Record proof
# --------------------------------------------------

proof = blockchain_service.record_integrity_proof(
    screening_id=screening_id,
    integrity_hash=original_hash,
)

print("Blockchain proof:")
print(proof)


# --------------------------------------------------
# Verify original hash
# --------------------------------------------------

verification = (
    blockchain_service.verify_integrity_proof(
        screening_id=screening_id,
        integrity_hash=original_hash,
    )
)

print("\nOriginal verification:")
print(verification)


# --------------------------------------------------
# Simulate modified screening
# --------------------------------------------------

modified_hash = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
)


tampered_verification = (
    blockchain_service.verify_integrity_proof(
        screening_id=screening_id,
        integrity_hash=modified_hash,
    )
)

print("\nModified verification:")
print(tampered_verification)