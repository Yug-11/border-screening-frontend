import apiClient from '../../../services/apiClient';
import {
  API_ENDPOINTS,
  WS_ENDPOINTS,
} from '../../../services/endpoints';


// ==========================================================
// START REAL SCREENING
// ==========================================================

export async function startScreening({
  documentFile,
  verificationFile = null,
  screeningId,
}) {
  if (!documentFile) {
    throw new Error(
      'A document file is required.'
    );
  }

  if (!screeningId) {
    throw new Error(
      'A screening ID is required.'
    );
  }

  const formData = new FormData();

  formData.append(
    'document_image',
    documentFile,
    documentFile.name
  );

  if (verificationFile) {
    formData.append(
      'verification_image',
      verificationFile,
      verificationFile.name
    );
  }

  return apiClient.post(
    API_ENDPOINTS.SCREENINGS.CREATE,
    formData,
    {
      headers: {
        'X-Screening-ID': screeningId,
      },
    }
  );
}


// ==========================================================
// CREATE SCREENING WEBSOCKET
// ==========================================================

export function createScreeningSocket(
  screeningId
) {
  const protocol =
    window.location.protocol === 'https:'
      ? 'wss:'
      : 'ws:';

  const host =
    window.location.hostname === 'localhost'
      ? '127.0.0.1:8000'
      : '127.0.0.1:8000';

  const path =
    WS_ENDPOINTS.SCREENING(
      screeningId
    );

  return new WebSocket(
    `${protocol}//${host}${path}`
  );
}


// ==========================================================
// GET SCREENING RESULT
// ==========================================================

export function getScreening(
  screeningId
) {
  return apiClient.get(
    API_ENDPOINTS.SCREENINGS.GET(
      screeningId
    )
  );
}


// ==========================================================
// FINALIZE OFFICER DECISION
// ==========================================================

export function finalizeScreening(
  screeningId,
  decision,
  remarks = ''
) {
  return apiClient.post(
    API_ENDPOINTS.SCREENINGS.DECISION(
      screeningId
    ),
    {
      decision,
      remarks,
    }
  );
}