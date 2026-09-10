import { mockScreeningResults } from './mockScreeningResults';
import { screeningSteps } from '../features/screening/constants/screeningSteps';

const clearedScreening = {
  checkpoint: 'North Border Checkpoint',
  documentType: 'Passport',
  risk: 'LOW',
  result: 'Cleared',
  face: 'MATCH',
  tampering: 'PASSED',
  officerAction: 'Cleared',
};
export const mockPassengerDetails = {
  passenger: mockScreeningResults.high.passenger,
  queueNumber: mockScreeningResults.high.queueNumber,
  screeningDate: '2026-09-05',
  previousCheckpoints: ['North Border Checkpoint', 'East Border Checkpoint'],
  screeningHistory: [
    {
      ...clearedScreening,
      id: 'history-aug28',
      dateTime: '2026-08-28T11:18:00',
      dateLabel: '28 Aug 2026 11:18',
    },
    {
      ...clearedScreening,
      id: 'history-aug12',
      dateTime: '2026-08-12T09:42:00',
      dateLabel: '12 Aug 2026 09:42',
      checkpoint: 'East Border Checkpoint',
      risk: 'MEDIUM',
      result: 'Officer Review',
      tampering: 'WARNING',
    },
  ],
  documentHistory: [
    {
      id: 'document-previous',
      type: 'Passport',
      identifier: 'DEMO-DOC-1001',
      issueDate: '2019-04-18',
      expiryDate: '2026-04-18',
      status: 'Expired',
      firstSeen: '2024-08-12',
      lastSeen: '2026-04-18',
    },
    {
      id: 'document-current',
      type: 'Passport',
      identifier: mockScreeningResults.high.passenger.documentId,
      issueDate: mockScreeningResults.high.passenger.documentIssueDate,
      expiryDate: mockScreeningResults.high.passenger.documentExpiry,
      status: 'Current',
      firstSeen: '2026-04-18',
      lastSeen: '2026-09-05',
    },
  ],
  alerts: [
    {
      id: 'alert-previous',
      date: '2026-08-12',
      type: 'Document Review',
      severity: 'MEDIUM',
      source: 'Automated Screening',
      status: 'RESOLVED',
    },
  ],
  officerDecisions: [
    {
      id: 'decision-aug28',
      dateTime: '2026-08-28T11:20:00',
      dateLabel: '28 Aug 2026 11:20',
      checkpoint: 'North Border Checkpoint',
      officer: 'Officer A (demo)',
      decision: 'CLEARED',
      reason: 'All checks resolved',
      status: 'Completed',
    },
    {
      id: 'decision-aug12',
      dateTime: '2026-08-12T09:50:00',
      dateLabel: '12 Aug 2026 09:50',
      checkpoint: 'East Border Checkpoint',
      officer: 'Officer B (demo)',
      decision: 'CLEARED',
      reason: 'Document reviewed',
      status: 'Completed',
    },
  ],
};

function checkSummary(checks) {
  if (checks.some((check) => check.status === 'FAILED')) return 'FAILED';
  if (checks.some((check) => check.status === 'WARNING')) return 'WARNING';
  return 'PASSED';
}
function latestChecks(result) {
  const states = {
    'document-validation': checkSummary(result.documentValidation),
    'tampering-analysis': checkSummary(result.tamperingEvidence),
    'mrz-validation': result.mrz.status,
    'face-verification': result.face.status,
    'risk-assessment': result.level,
  };
  const checks = screeningSteps
    .filter((step) => step.id !== 'risk-assessment')
    .map((step) => ({
      id: step.id,
      label: step.label,
      status: states[step.id] || 'PASSED',
      variant: step.id === 'face-verification' ? result.face.variant : undefined,
    }));
  checks.push({
    id: 'identity-intelligence',
    label: 'Identity Intelligence',
    status: result.id === 'high' ? 'WARNING' : 'PASSED',
  });
  checks.push({ id: 'risk-assessment', label: 'Risk Assessment', status: result.level });
  return checks;
}
function auditTrail(result) {
  const additional = [
    { id: 'detection', time: '14:32:04', title: 'Document detected', variant: 'success' },
    { id: 'structure', time: '14:32:05', title: 'Document structure analyzed', variant: 'success' },
    {
      id: 'tampering-start',
      time: '14:32:07',
      title: 'Tampering analysis started',
      variant: 'info',
    },
    {
      id: 'face-extraction',
      time: '14:32:11',
      title: 'Face extraction completed',
      variant: 'success',
    },
    {
      id: 'intelligence',
      time: '14:32:13',
      title: 'Identity intelligence completed',
      variant: result.id === 'high' ? 'warning' : 'success',
    },
    {
      id: 'recommendation',
      time: '14:32:14',
      title:
        result.level +
        ' risk - ' +
        (result.id === 'low' ? 'clearance recommended' : 'officer review required'),
      variant: result.tone,
    },
  ];
  if (result.id !== 'low')
    additional.push({
      id: 'warning',
      time: '14:32:09',
      title: 'Tampering warning recorded',
      variant: 'warning',
    });
  return [...result.timeline, ...additional].sort((first, second) =>
    first.time.localeCompare(second.time),
  );
}
export function getMockPassengerDetails(passengerId, scenario) {
  if (
    passengerId !== mockPassengerDetails.passenger.id ||
    !Object.hasOwn(mockScreeningResults, scenario)
  )
    return null;
  const result = mockScreeningResults[scenario];
  const currentHistory = {
    id: 'history-latest',
    dateTime: '2026-09-05T14:32:14',
    dateLabel: '05 Sep 2026 14:32',
    checkpoint: result.checkpoint,
    documentType: result.passenger.documentType,
    risk: result.level,
    result: result.id === 'low' ? 'Clearance recommended' : 'Officer Review',
    face: result.face.status,
    tampering: checkSummary(result.tamperingEvidence),
    officerAction: 'Pending',
  };
  return {
    ...mockPassengerDetails,
    latestScreening: result,
    currentDocument: {
      type: result.passenger.documentType,
      expiry: result.passenger.documentExpiry,
      status: scenario === 'low' ? 'Valid' : 'Review Required',
      mrz: result.mrz.status,
      analysis: 'Completed',
    },
    latestChecks: latestChecks(result),
    screeningHistory: [currentHistory, ...mockPassengerDetails.screeningHistory],
    identityIntelligence: result.identityIntelligence,
    alerts:
      scenario === 'low'
        ? mockPassengerDetails.alerts
        : [
            {
              id: 'alert-latest',
              date: '2026-09-05',
              type: 'Potential Document Inconsistency',
              severity: result.level,
              source: 'Automated Screening',
              status: 'OPEN',
            },
            ...mockPassengerDetails.alerts,
          ],
    auditTrail: auditTrail(result),
  };
}
