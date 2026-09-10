const passenger = {
  id: 'PAX-DEMO-1029',
  documentIssueDate: '2025-04-18',
  name: 'Passenger F',
  dateOfBirth: '1990-04-18',
  nationality: 'Country F',
  document: 'Passport',
  documentType: 'Passport',
  documentExpiry: '2030-04-18',
  documentId: 'DEMO-XXXX-1029',
};
const check = (id, label, status = 'PASSED', explanation = '') => ({
  id,
  label,
  status,
  explanation,
});
const factor = (label, points, explanation) => ({ label, points, explanation });

function documentChecks(level) {
  return [
    check('passport', 'Passport validity'),
    check('expiry', 'Expiry validation'),
    check(
      'database',
      'Database match',
      'PASSED',
      'Matched against a fictional reference record; no real database was queried.',
    ),
    check(
      'mrz',
      'MRZ validation',
      level === 'high' ? 'FAILED' : 'PASSED',
      level === 'high' ? 'MRZ data could not be validated in this fictional scenario.' : '',
    ),
    check(
      'fields',
      'Field consistency',
      level === 'low' ? 'PASSED' : 'WARNING',
      level === 'low' ? '' : 'One document field requires review.',
    ),
    check('structure', 'Document structure'),
  ];
}
function tamperingChecks(level) {
  return [
    check(
      'font',
      'Font consistency',
      level === 'low' ? 'PASSED' : 'WARNING',
      level === 'low' ? '' : 'Visual characteristics differ from the expected document pattern.',
    ),
    check('alignment', 'Text alignment'),
    check('spacing', 'Line spacing'),
    check('position', 'Field positioning'),
    check(
      'photo',
      'Photo placement',
      level === 'high' ? 'WARNING' : 'PASSED',
      level === 'high' ? 'Photo placement requires officer review.' : '',
    ),
    check(
      'stamp',
      'Stamp characteristics',
      level === 'high' ? 'WARNING' : 'PASSED',
      level === 'high' ? 'Potential stamp-pattern inconsistency requires review.' : '',
    ),
    check('forensics', 'Image forensics'),
  ];
}
function mrzChecks(level) {
  return [
    check('detected', 'MRZ detected'),
    check('format', 'MRZ format'),
    check(
      'digits',
      'Check digits',
      level === 'high' ? 'FAILED' : 'PASSED',
      level === 'high' ? 'MRZ data could not be validated.' : '',
    ),
    check(
      'consistency',
      'Field consistency',
      level === 'high' ? 'WARNING' : 'PASSED',
      level === 'high' ? 'A fictional MRZ field requires review.' : '',
    ),
  ];
}
function identityChecks(level) {
  return [
    {
      id: 'match',
      label: 'Database Match',
      status: 'Matched',
      variant: 'success',
      explanation: 'Fictional reference match only; no named or live database.',
    },
    {
      id: 'associations',
      label: 'Previous Document Associations',
      status: level === 'low' ? 'None detected' : '2 previous associations',
      variant: level === 'low' ? 'neutral' : 'info',
      explanation:
        level === 'low' ? '' : 'Fictional associations are context, not proof of wrongdoing.',
    },
    {
      id: 'duplicate',
      label: 'Duplicate Identity',
      status: level === 'high' ? 'Warning' : 'None detected',
      variant: level === 'high' ? 'warning' : 'neutral',
    },
    {
      id: 'multiple',
      label: 'Multiple Identity Warning',
      status: level === 'high' ? 'Review required' : 'None',
      variant: level === 'high' ? 'warning' : 'neutral',
      explanation:
        level === 'high' ? 'Potential duplicate identity detected in the fictional scenario.' : '',
    },
  ];
}
function timeline(level) {
  return [
    { id: 'submitted', time: '14:32:04', title: 'Document submitted', variant: 'info' },
    { id: 'ocr', time: '14:32:05', title: 'OCR completed', variant: 'success' },
    {
      id: 'validation',
      time: '14:32:06',
      title:
        level === 'low'
          ? 'Document validation completed'
          : 'Document validation completed with a review flag',
      variant: level === 'low' ? 'success' : 'warning',
    },
    {
      id: 'tampering',
      time: '14:32:08',
      title:
        level === 'low'
          ? 'Tampering analysis completed'
          : 'Tampering analysis completed with warnings',
      variant: level === 'low' ? 'success' : 'warning',
    },
    {
      id: 'mrz',
      time: '14:32:10',
      title:
        level === 'high'
          ? 'MRZ validation failed - exception recorded'
          : 'MRZ validation completed',
      variant: level === 'high' ? 'danger' : 'success',
    },
    {
      id: 'face',
      time: '14:32:12',
      title:
        level === 'low'
          ? 'Face verification completed - match'
          : level === 'medium'
            ? 'Face verification completed - review required'
            : 'Face verification completed - mismatch',
      variant: level === 'low' ? 'success' : level === 'medium' ? 'warning' : 'danger',
    },
    { id: 'risk', time: '14:32:14', title: 'Risk assessment completed', variant: 'info' },
  ];
}
const scenarios = [
  {
    id: 'low',
    label: 'Low Risk',
    level: 'LOW',
    score: 18,
    decision: 'CLEAR',
    tone: 'success',
    face: { similarity: 98.4, status: 'MATCH', variant: 'success' },
    factors: [
      factor('Document validation', 0, 'No significant demo validation inconsistency.'),
      factor('Tampering analysis', 0, 'No demo tampering warning.'),
      factor('Face verification', 0, 'Fictional comparison indicates a match.'),
      factor('Identity intelligence', 0, 'No demo identity warning.'),
      factor(
        'Travel/document anomaly',
        18,
        'Minor fictional context contribution; not a finding of invalid documents.',
      ),
    ],
    explanation:
      'No significant document or identity inconsistencies were identified in the automated screening.',
    recommendation: 'Passenger may proceed.',
    reviewReasons: [],
  },
  {
    id: 'medium',
    label: 'Medium Risk',
    level: 'MEDIUM',
    score: 54,
    decision: 'OFFICER REVIEW REQUIRED',
    tone: 'warning',
    face: { similarity: 71.2, status: 'REVIEW REQUIRED', variant: 'warning' },
    factors: [
      factor('Document anomaly', 18, 'One document field requires review.'),
      factor('Tampering warning', 14, 'Font characteristics differ from the expected pattern.'),
      factor('Face similarity', 12, 'The fictional similarity value requires officer review.'),
      factor(
        'Identity history',
        10,
        'Two fictional previous associations are supplied as review context.',
      ),
    ],
    explanation:
      'Automated screening identified document and identity signals that require officer review.',
    recommendation: 'Officer review required before passenger proceeds.',
    reviewReasons: [
      'One document field requires review.',
      'Potential font-pattern inconsistency detected.',
      'Fictional face similarity and previous associations require review.',
    ],
  },
  {
    id: 'high',
    label: 'High Risk',
    level: 'HIGH',
    score: 82,
    decision: 'OFFICER REVIEW REQUIRED',
    tone: 'danger',
    face: { similarity: 61.8, status: 'MISMATCH', variant: 'danger' },
    factors: [
      factor(
        'Tampering indicators',
        28,
        'Font, photo placement and stamp characteristics require review.',
      ),
      factor('Face mismatch', 24, 'The fictional portrait comparison indicates a mismatch.'),
      factor(
        'Identity anomaly',
        18,
        'A potential duplicate identity and previous associations require review.',
      ),
      factor(
        'Document inconsistency',
        12,
        'Document field and MRZ validation exceptions were recorded.',
      ),
    ],
    explanation:
      'Automated screening identified multiple elevated-risk signals requiring officer review.',
    recommendation: 'Officer review required before passenger proceeds.',
    reviewReasons: [
      'Potential document inconsistencies in font, photo placement and stamp characteristics.',
      'MRZ data could not be validated.',
      'Fictional portrait comparison indicates a mismatch.',
      'Potential duplicate identity detected; no fraud determination has been made.',
    ],
  },
];

export const mockScreeningResults = Object.fromEntries(
  scenarios.map((scenario) => [
    scenario.id,
    {
      ...scenario,
      passenger,
      checkpoint: 'North Border Checkpoint',
      queueNumber: 1029,
      completedAt: '14:32:14',
      documentValidation: documentChecks(scenario.id),
      tamperingEvidence: tamperingChecks(scenario.id),
      mrz: {
        status: scenario.id === 'high' ? 'FAILED' : 'PASSED',
        reason: scenario.id === 'high' ? 'MRZ data could not be validated.' : '',
        checks: mrzChecks(scenario.id),
      },
      identityIntelligence: identityChecks(scenario.id),
      timeline: timeline(scenario.id),
    },
  ]),
);
export const resultScenarioOptions = scenarios.map(({ id, label }) => ({ value: id, label }));
