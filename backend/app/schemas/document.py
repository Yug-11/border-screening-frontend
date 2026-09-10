from typing import List, Optional

from pydantic import BaseModel, Field


class OCRRegion(BaseModel):
    text: str
    confidence: float
    bbox: list


class MRZResult(BaseModel):
    detected: bool
    valid_format: bool
    lines: List[str] = Field(default_factory=list)
    document_number: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    expiry_date: Optional[str] = None


class DocumentFields(BaseModel):
    document_type: str = "passport"
    passport_number: Optional[str] = None
    surname: Optional[str] = None
    given_names: Optional[str] = None
    date_of_birth: Optional[str] = None
    nationality: Optional[str] = None
    place_of_birth: Optional[str] = None
    place_of_issue: Optional[str] = None
    date_of_issue: Optional[str] = None
    date_of_expiry: Optional[str] = None


class DocumentOCRResponse(BaseModel):
    success: bool
    filename: Optional[str]
    content_type: Optional[str]
    full_text: str
    regions: List[OCRRegion]
    region_count: int
    fields: DocumentFields
    mrz: MRZResult