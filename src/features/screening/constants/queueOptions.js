import { screeningSteps } from './screeningSteps';

export const queueStatuses = [
  'Waiting',
  'In Progress',
  'Review Required',
  'Completed',
  'Anomaly Detected',
];
export const queueRisks = ['Pending', 'LOW', 'MEDIUM', 'HIGH'];
export const automatedStages = screeningSteps.map((step) => step.queueLabel || step.label);
export const queueStages = ['Waiting', ...automatedStages, 'Officer Review', 'Completed'];
export const attentionStatuses = ['Review Required', 'Anomaly Detected'];
