export const screeningSteps = [
  {
    id: 'document-detection',
    label: 'Document Detection',
    description: 'Locating the document within the submitted image.',
    order: 1,
  },
  {
    id: 'ocr',
    label: 'OCR / Text Extraction',
    queueLabel: 'OCR',
    description: 'Extracting printed text from the document image.',
    order: 2,
  },
  {
    id: 'structure-analysis',
    label: 'Structure Analysis',
    description: 'Comparing the arrangement of document fields with the expected structure.',
    order: 3,
  },
  {
    id: 'document-validation',
    label: 'Document Validation',
    description: 'Checking document fields for completeness and consistency.',
    order: 4,
  },
  {
    id: 'tampering-analysis',
    label: 'Tampering Analysis',
    description: 'Comparing document visual characteristics against expected document structure.',
    order: 5,
  },
  {
    id: 'mrz-validation',
    label: 'MRZ Validation',
    description: 'Checking the machine-readable zone against the extracted document fields.',
    order: 6,
  },
  {
    id: 'face-extraction',
    label: 'Face Extraction',
    description: 'Locating the portrait area within the document.',
    order: 7,
  },
  {
    id: 'face-verification',
    label: 'Face Verification',
    description: 'Comparing the supplied portrait references for consistency.',
    order: 8,
  },
  {
    id: 'risk-assessment',
    label: 'Risk Assessment',
    description: 'Combining the fictional check outcomes for the demo assessment.',
    order: 9,
  },
];
