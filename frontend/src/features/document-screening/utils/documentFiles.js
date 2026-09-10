import { maxFileBytes } from '../constants/captureOptions';

const unsupported = 'Unsupported file type. Please upload JPG, PNG, JPEG, or PDF.';
const mimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
};

export async function validateDocumentFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const mime = mimeTypes[extension];
  if (!mime || (file.type && file.type !== mime)) return { error: unsupported };
  if (file.size > maxFileBytes)
    return { error: 'File size exceeds the allowed limit. Maximum size is 10 MB per file.' };
  if (!file.size) return { error: 'This file is empty. Choose a document with content.' };
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const signatures = {
    'image/jpeg': [255, 216, 255],
    'image/png': [137, 80, 78, 71, 13, 10, 26, 10],
    'application/pdf': [37, 80, 68, 70, 45],
  };
  if (!signatures[mime].every((byte, index) => bytes[index] === byte))
    return { error: unsupported };
  if (mime.startsWith('image/')) {
    try {
      const image = await createImageBitmap(file);
      image.close();
    } catch {
      return { error: 'This image could not be opened. Choose a readable JPG or PNG file.' };
    }
  }
  return { mime };
}

export function formatFileSize(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    : Math.max(1, Math.ceil(bytes / 1024)) + ' KB';
}

export function createDemoDocument() {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 640;
    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('Demo capture is unavailable. Please upload a file instead.'));
      return;
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 1000, 640);
    context.strokeStyle = '#555555';
    context.lineWidth = 3;
    context.strokeRect(36, 36, 928, 568);
    context.fillStyle = '#222222';
    context.font = 'bold 36px sans-serif';
    context.fillText('FICTIONAL CAPTURE SAMPLE', 70, 120);
    context.font = '28px sans-serif';
    context.fillText('DEMO ONLY - NOT A VALID DOCUMENT', 70, 190);
    context.fillText('Passenger F / Country F', 70, 290);
    context.fillText('Local document-capture demonstration', 70, 370);
    context.fillText('No camera, OCR or verification used', 70, 450);
    context.font = '22px sans-serif';
    context.fillText('No official emblem, document number or biometric data', 70, 550);
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(new File([blob], 'fictional-capture-sample.png', { type: 'image/png' }))
          : reject(new Error('Demo capture is unavailable. Please upload a file instead.')),
      'image/png',
    );
  });
}
