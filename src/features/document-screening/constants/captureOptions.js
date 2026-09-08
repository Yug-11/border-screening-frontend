import { documentTypes } from '../../../constants/documentTypes';

export const captureDocumentTypes = [...documentTypes, 'Other Travel Document'];
export const maxFileBytes = 10 * 1024 * 1024;
export const maxDocuments = 10;
export const acceptedFiles = '.jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf';
export const captureInstructions = {
  Passport: {
    instruction: 'Capture the identity page. Add visa pages if required.',
    pages: ['Identity page', 'Visa page', 'Additional page'],
  },
  'National ID': {
    instruction: 'Capture the front and back of the identity document.',
    pages: ['Front', 'Back', 'Additional page'],
  },
  'Driving License': {
    instruction: 'Capture the front and back of the driving license.',
    pages: ['Front', 'Back', 'Additional page'],
  },
  Permit: {
    instruction: 'Capture the complete permit. Add supporting pages if required.',
    pages: ['Main page', 'Additional page'],
  },
  'Visa / Travel Authorization': {
    instruction: 'Capture the complete visa or travel authorization page.',
    pages: ['Visa / authorization page', 'Additional page'],
  },
  'Other Travel Document': {
    instruction: 'Capture the complete document and any required supporting pages.',
    pages: ['Main page', 'Additional page'],
  },
};
export const captureQualityChecks = [
  'Image clarity',
  'Complete document visible',
  'Glare',
  'Document edges',
];
