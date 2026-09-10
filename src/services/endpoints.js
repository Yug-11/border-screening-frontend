export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
  },

  SCREENINGS: {
    CREATE: "/api/screenings",
    GET: (screeningId) =>
      `/api/screenings/${screeningId}`,

    DECISION: (screeningId) =>
      `/api/screenings/${screeningId}/decision`,
  },

  DOCUMENTS: {
    OCR: "/api/documents/ocr",

    GET: (documentId) =>
      `/api/documents/${documentId}`,

    VALIDATE: "/api/documents/validate",

    CROSS_VALIDATE:
      "/api/documents/cross-validate",
  },

  FACE: {
    VERIFY: "/api/face/verify",
  },

  IDENTITY: {
    LOOKUP: (passportNumber) =>
      `/api/identity/${passportNumber}`,
  },

  RISK: {
    GET: (screeningId) =>
      `/api/screenings/${screeningId}/risk`,
  },

  AUDIT: {
    GET: (screeningId) =>
      `/api/audit/${screeningId}`,
  },

  INTEGRITY: {
    VERIFY: (screeningId) =>
      `/api/integrity/${screeningId}`,
  },

  MONITORING: {
    OVERVIEW:
      "/api/monitoring/overview",

    RECENT:
      "/api/monitoring/recent",

    ALERTS:
      "/api/monitoring/alerts",
  },
};


export const WS_ENDPOINTS = {
  SCREENING: (screeningId) =>
    `/api/ws/screenings/${screeningId}`,
};