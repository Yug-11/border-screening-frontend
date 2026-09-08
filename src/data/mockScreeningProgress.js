import { screeningSteps } from '../features/screening/constants/screeningSteps';

export const demoScreeningScenarios = [
  {
    id: 'standard',
    label: 'Standard completion',
    description: 'All nine demo stages complete without an exception.',
  },
  {
    id: 'warning',
    label: 'Tampering analysis warning',
    warningStage: 'tampering-analysis',
    warningReason: 'Potential document inconsistency detected.',
    description:
      'A fictional tampering-analysis warning is retained for officer review. The demo continues.',
  },
  {
    id: 'failure',
    label: 'MRZ validation failure',
    failureStage: 'mrz-validation',
    failureReason: 'MRZ data could not be validated.',
    description: 'A fictional MRZ anomaly stops the demo before face checks and risk assessment.',
  },
];

export const mockScreeningProgress = {
  checkpoint: 'North Border Checkpoint',
  queueNumber: 1029,
  passenger: 'Passenger F',
  nationality: 'Country F',
  currentStage: screeningSteps[0].id,
  stageStates: Object.fromEntries(screeningSteps.map((step) => [step.id, 'pending'])),
  documents: [
    { id: 'demo-passport', type: 'Passport', page: 'Identity Page', status: 'Ready' },
    { id: 'demo-visa', type: 'Visa / Travel Authorization', page: 'Page 1', status: 'Ready' },
  ],
  events: [
    {
      id: 'event-0',
      time: '14:32:04',
      title: 'Demo screening prepared',
      description: 'Waiting for Run Demo Screening.',
      variant: 'neutral',
    },
  ],
  clockStartSeconds: 14 * 3600 + 32 * 60 + 4,
  systems: [
    { id: 'engine', label: 'Screening Engine', status: 'Operational', variant: 'success' },
    {
      id: 'document-analysis',
      label: 'Document Analysis',
      status: 'Operational',
      variant: 'success',
    },
    { id: 'identity', label: 'Identity Verification', status: 'Ready', variant: 'info' },
    { id: 'risk', label: 'Risk Engine', status: 'Ready', variant: 'info' },
  ],
};

export const mockAnalysisChecks = {
  'document-detection': [
    { label: 'Document location', status: 'Analyzing' },
    { label: 'Page boundaries', status: 'Pending' },
  ],
  ocr: [
    { label: 'Text regions', status: 'Analyzing' },
    { label: 'Field extraction', status: 'Pending' },
  ],
  'structure-analysis': [
    { label: 'Field arrangement', status: 'Analyzing' },
    { label: 'Page structure', status: 'Pending' },
  ],
  'document-validation': [
    { label: 'Field completeness', status: 'Analyzing' },
    { label: 'Field consistency', status: 'Pending' },
  ],
  'tampering-analysis': [
    { label: 'Font consistency', status: 'Analyzing' },
    { label: 'Text alignment', status: 'Analyzing' },
    { label: 'Line spacing', status: 'Analyzing' },
    { label: 'Photo placement', status: 'Pending' },
    { label: 'Stamp characteristics', status: 'Pending' },
    { label: 'Image consistency', status: 'Pending' },
  ],
  'mrz-validation': [
    { label: 'MRZ data validation', status: 'Analyzing' },
    { label: 'Field comparison', status: 'Pending' },
  ],
  'face-extraction': [
    { label: 'Portrait region', status: 'Analyzing' },
    { label: 'Portrait preparation', status: 'Pending' },
  ],
  'face-verification': [
    { label: 'Portrait comparison', status: 'Analyzing' },
    { label: 'Reference consistency', status: 'Pending' },
  ],
  'risk-assessment': [
    { label: 'Demo check outcomes', status: 'Analyzing' },
    { label: 'Assessment preparation', status: 'Pending' },
  ],
};
