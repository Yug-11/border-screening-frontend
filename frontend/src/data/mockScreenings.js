export const mockScreenings = [
  {
    id: 'demo-screening-1024',
    passengerId: 'demo-passenger-a',
    passengerName: 'Passenger A',
    queueNumber: 1024,
    stage: 'Face Verification',
    progress: 80,
    status: 'In Progress',
    steps: [
      { id: 'document-upload', label: 'Document Upload', status: 'completed' },
      { id: 'ocr', label: 'OCR', status: 'completed' },
      { id: 'document-validation', label: 'Document Validation', status: 'completed' },
      { id: 'tampering-analysis', label: 'Tampering Analysis', status: 'completed' },
      { id: 'face-verification', label: 'Face Verification', status: 'active' },
      { id: 'risk-assessment', label: 'Risk Assessment', status: 'pending' },
    ],
  },
];
