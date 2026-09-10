from app.services.blockchain.integrity_service import (
    integrity_service,
)


screening_data = {
    "screening_id": "DEMO-SCREENING-001",
    "status": "COMPLETED",
    "risk": {
        "risk_score": 10,
        "decision": "CLEAR",
    },
}


# Generate original hash
original_hash = integrity_service.generate_hash(
    screening_data
)

print("Original hash:")
print(original_hash)


# Verify unchanged data
is_valid = integrity_service.verify_hash(
    screening_data,
    original_hash,
)

print("\nOriginal verification:")
print(is_valid)


# Simulate modification
screening_data["risk"]["risk_score"] = 90


# Verify modified data against original hash
is_tampered = integrity_service.verify_hash(
    screening_data,
    original_hash,
)

print("\nAfter modification:")
print(is_tampered)