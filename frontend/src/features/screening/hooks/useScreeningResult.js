import { useCallback, useEffect, useReducer } from 'react';

import { getScreening, finalizeScreening } from '../services/screeningService';

function normalizeStatus(status) {
  return String(status || 'UNKNOWN').toUpperCase();
}

function buildCheck(id, label, status, explanation = '', variant) {
  return {
    id,
    label,
    status: normalizeStatus(status),
    explanation,
    ...(variant ? { variant } : {}),
  };
}

function mapPassenger(data) {
  const documentFields = data?.document?.fields || {};
  const identity = data?.identity?.identity || {};

  return {
    id: data?.screening_id || 'UNKNOWN',
    name:
      identity.given_names ||
      documentFields.given_names ||
      'Unknown passenger',
    dateOfBirth:
      identity.date_of_birth ||
      documentFields.date_of_birth ||
      'N/A',
    nationality:
      identity.nationality ||
      documentFields.nationality ||
      'N/A',
    document:
      documentFields.passport_number ||
      data?.document?.passport_number ||
      'N/A',
    documentType:
      documentFields.document_type || 'Passport',
    documentExpiry:
      identity.date_of_expiry ||
      documentFields.date_of_expiry ||
      'N/A',
    documentId:
      documentFields.passport_number ||
      data?.document?.passport_number ||
      'N/A',
    documentIssueDate:
      documentFields.date_of_issue || 'N/A',
  };
}

function mapDocumentValidation(data) {
  const fields = data?.document?.fields || {};
  const identity = data?.identity || {};
  const cross = data?.cross_validation || {};

  const identityData = identity.identity || {};

  return [
    buildCheck(
      'passport-number',
      'Passport Number',
      fields.passport_number && identity.found ? 'PASSED' : 'FAILED',
      fields.passport_number
        ? 'Passport number was extracted and checked against the reference identity.'
        : 'Passport number could not be extracted.',
    ),

    buildCheck(
      'surname',
      'Surname',
      fields.surname &&
        (!identityData.surname ||
          fields.surname.toUpperCase() === identityData.surname.toUpperCase())
        ? 'PASSED'
        : 'REVIEW',
      fields.surname
        ? 'Surname was extracted from the document.'
        : 'Surname could not be extracted.',
    ),

    buildCheck(
      'given-names',
      'Given Names',
      fields.given_names &&
        (!identityData.given_names ||
          fields.given_names.toUpperCase() === identityData.given_names.toUpperCase())
        ? 'PASSED'
        : 'REVIEW',
      fields.given_names
        ? 'Given names were extracted from the document.'
        : 'Given names could not be extracted.',
    ),

    buildCheck(
      'date-of-birth',
      'Date of Birth',
      fields.date_of_birth &&
        (!identityData.date_of_birth ||
          fields.date_of_birth === identityData.date_of_birth)
        ? 'PASSED'
        : 'REVIEW',
      fields.date_of_birth
        ? 'Date of birth was extracted and compared with the reference identity.'
        : 'Date of birth could not be extracted.',
    ),

    buildCheck(
      'nationality',
      'Nationality',
      fields.nationality &&
        (!identityData.nationality ||
          fields.nationality.toUpperCase() === identityData.nationality.toUpperCase())
        ? 'PASSED'
        : 'REVIEW',
      fields.nationality
        ? 'Nationality was extracted from the document.'
        : 'Nationality could not be extracted.',
    ),

    buildCheck(
      'date-of-expiry',
      'Date of Expiry',
      fields.date_of_expiry ? 'PASSED' : 'REVIEW',
      fields.date_of_expiry
        ? 'Document expiry date was extracted.'
        : 'Document expiry date could not be extracted.',
    ),

    buildCheck(
      'identity-status',
      'Identity Reference',
      identity.status === 'VALID' ? 'PASSED' : identity.status || 'REVIEW',
      identity.found
        ? 'Document identifier matched the configured reference record.'
        : 'No matching reference identity was found.',
    ),

    buildCheck(
      'cross-validation',
      'Cross-Document Consistency',
      cross.status || 'UNKNOWN',
      cross.warnings?.length
        ? cross.warnings.join(' ')
        : cross.mismatches?.length
          ? cross.mismatches.join(' ')
          : 'Cross-document consistency check completed.',
    ),
  ];
}

function mapTampering(data) {
  const tampering = data?.tampering;

  // The current backend intentionally has no ML tampering model yet.
  if (!tampering) {
    return {
      status: 'NOT_PERFORMED',
      explanation:
        'Tampering ML analysis is not enabled in the current prototype.',
      checks: [
        buildCheck(
          'tampering-detection',
          'Tampering Detection',
          'NOT_PERFORMED',
          'No tampering model result was returned by the backend.',
        ),
        buildCheck(
          'tampering-score',
          'Tampering Score',
          'NOT_PERFORMED',
          'No tampering score was generated.',
        ),
      ],
    };
  }

  const suspicious = Boolean(tampering.suspicious);

  return {
    status: suspicious ? 'REVIEW' : 'PASSED',
    explanation:
      tampering.explanation ||
      'Tampering analysis completed by the configured backend service.',
    checks: [
      buildCheck(
        'tampering-detection',
        'Tampering Detection',
        suspicious ? 'REVIEW' : 'PASSED',
        suspicious
          ? 'The backend reported suspicious document characteristics.'
          : 'No suspicious characteristics were reported.',
      ),
      buildCheck(
        'tampering-score',
        'Tampering Score',
        'PASSED',
        typeof tampering.tampering_score === 'number'
          ? `Tampering score: ${tampering.tampering_score}.`
          : 'Tampering score was returned by the backend.',
      ),
    ],
  };
}

function mapMrz(data) {
  const mrz = data?.ocr?.mrz || {};
  const detected = Boolean(mrz.detected);
  const valid = Boolean(mrz.valid_format);

  const status = !detected
    ? 'REVIEW'
    : valid
      ? 'PASSED'
      : 'REVIEW';

  return {
    status,
    reason: !detected
      ? 'MRZ was not detected.'
      : valid
        ? 'MRZ structure passed validation.'
        : 'MRZ was detected but failed structural validation.',
    checks: [
      buildCheck(
        'mrz-detected',
        'MRZ Detected',
        detected ? 'PASSED' : 'REVIEW',
        detected
          ? 'Machine-readable zone was detected.'
          : 'No machine-readable zone was detected.',
      ),
      buildCheck(
        'mrz-structure',
        'MRZ Structure',
        valid ? 'PASSED' : 'REVIEW',
        valid
          ? 'MRZ structure passed validation.'
          : 'Detected MRZ failed structural validation.',
      ),
    ],
  };
}

function mapFace(data) {
  const face = data?.face;

  if (!face) {
    return null;
  }

  const similarity =
    typeof face.similarity === 'number'
      ? Math.abs(face.similarity) <= 1
        ? face.similarity * 100
        : face.similarity
      : null;

  return {
    status: normalizeStatus(face.status || (face.match ? 'MATCH' : 'MISMATCH')),
    match: Boolean(face.match),
    similarity,
    threshold: face.threshold,
    documentFacesDetected: face.document_faces_detected,
    verificationFacesDetected: face.verification_faces_detected,
    variant: face.match ? 'success' : 'danger',
  };
}

function mapIdentityIntelligence(data) {
  const identity = data?.identity || {};
  const cross = data?.cross_validation || {};

  return [
    buildCheck(
      'reference-identity',
      'Reference Identity',
      identity.found ? 'PASSED' : 'REVIEW',
      identity.found
        ? 'A matching reference identity was found.'
        : 'No matching reference identity was found.',
    ),

    buildCheck(
      'identity-status',
      'Identity Status',
      identity.status || 'UNKNOWN',
      identity.document_status
        ? `Document status: ${identity.document_status}.`
        : 'Identity status returned by the backend.',
    ),

    buildCheck(
      'watchlist-status',
      'Watchlist Status',
      identity.watchlist_status || 'UNKNOWN',
      identity.watchlist_status
        ? `Watchlist status: ${identity.watchlist_status}.`
        : 'No watchlist status was returned.',
    ),

    buildCheck(
      'cross-document',
      'Cross-Document Consistency',
      cross.status || 'UNKNOWN',
      cross.warnings?.length
        ? cross.warnings.join(' ')
        : cross.mismatches?.length
          ? cross.mismatches.join(' ')
          : 'Cross-document validation completed.',
    ),
  ];
}

function mapRiskFactors(data) {
  const reasons = data?.risk?.reasons || [];

  if (!reasons.length) {
    return [
      {
        label: 'No significant risk factors',
        points: 0,
        explanation: 'No risk reasons were returned by the backend risk engine.',
      },
    ];
  }

  return reasons.map((reason, index) => ({
    label: reason.message || reason.code || `Risk factor ${index + 1}`,
    points: Number(reason.points || 0),
    explanation:
      reason.severity
        ? `Severity: ${reason.severity}.`
        : 'Risk contribution returned by the backend risk engine.',
  }));
}

function mapTimeline(data) {
  const startedAt = data?.started_at;
  const completedAt = data?.completed_at;

  const formatTime = (value) => {
    if (!value) return 'N/A';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return [
    {
      id: 'screening-started',
      time: formatTime(startedAt),
      title: 'Screening started',
      variant: 'info',
    },
    {
      id: 'document-analysis',
      time: formatTime(completedAt),
      title: 'Document analysis completed',
      variant: 'success',
    },
    {
      id: 'ocr',
      time: formatTime(completedAt),
      title: 'OCR and text extraction completed',
      variant: 'success',
    },
    {
      id: 'identity',
      time: formatTime(completedAt),
      title: 'Identity validation completed',
      variant: 'success',
    },
    {
      id: 'cross-validation',
      time: formatTime(completedAt),
      title: 'Cross-document validation completed',
      variant:
        data?.cross_validation?.status === 'REVIEW'
          ? 'warning'
          : 'success',
    },
    {
      id: 'tampering',
      time: formatTime(completedAt),
      title: 'Tampering analysis completed',
      variant: data?.tampering ? 'success' : 'info',
    },
    {
      id: 'mrz',
      time: formatTime(completedAt),
      title: 'MRZ validation completed',
      variant:
        data?.ocr?.mrz?.valid_format
          ? 'success'
          : 'warning',
    },
    {
      id: 'face',
      time: formatTime(completedAt),
      title: data?.face
        ? 'Face verification completed'
        : 'Face verification not performed',
      variant: data?.face
        ? data.face.match
          ? 'success'
          : 'danger'
        : 'info',
    },
    {
      id: 'risk',
      time: formatTime(completedAt),
      title: 'Risk assessment completed',
      variant: 'success',
    },
    {
      id: 'screening-completed',
      time: formatTime(completedAt),
      title: 'Screening completed',
      variant: 'success',
    },
  ];
}

function mapResult(data) {
  const risk = data?.risk || {};
  const audit = data?.audit || {};

  const score = Number(risk.risk_score ?? data?.risk_score ?? 0);

  const level = normalizeStatus(
    risk.risk_level || data?.risk_level || 'UNKNOWN',
  );

  const decision = normalizeStatus(
    risk.decision || data?.decision || audit.decision || 'UNKNOWN',
  );

  const tampering = mapTampering(data);
  const face = mapFace(data);

  const reviewReasons = [
    ...(risk.reasons || []).map(
      (reason) => reason.message || reason.code,
    ),
    ...(data?.cross_validation?.warnings || []),
    ...(data?.cross_validation?.mismatches || []),
  ].filter(Boolean);

  return {
    id: data?.screening_id,
    screeningId: data?.screening_id,

    label:
      level === 'LOW'
        ? 'Low Risk'
        : level === 'MEDIUM'
          ? 'Medium Risk'
          : 'High Risk',

    level,
    score,
    decision,

    tone:
      level === 'HIGH'
        ? 'danger'
        : level === 'MEDIUM'
          ? 'warning'
          : 'success',

    checkpoint:
      audit.checkpoint ||
      data?.checkpoint ||
      'N/A',

    // Queue is not currently supplied by the backend.
    queueNumber: null,

    completedAt: data?.completed_at || null,

    passenger: mapPassenger(data),

    documentValidation: mapDocumentValidation(data),

    tamperingEvidence: tampering.checks,

    tamperingStatus: tampering.status,

    mrz: mapMrz(data),

    face,

    identityIntelligence: mapIdentityIntelligence(data),

    factors: mapRiskFactors(data),

    explanation:
      reviewReasons.length
        ? reviewReasons.join(' ')
        : 'The backend risk engine completed the assessment without additional risk reasons.',

    recommendation:
      decision === 'CLEAR'
        ? 'The backend risk engine recommends CLEAR. Final action remains with the authorized officer.'
        : 'The backend risk engine recommends officer review before a final decision.',

    reviewReasons,

    timeline: mapTimeline(data),

    integrity: data?.integrity || null,

    blockchain: data?.blockchain || null,

    audit: audit || null,

    raw: data,
  };
}

const initialState = {
  screeningId: null,
  loading: true,
  error: null,
  result: null,
  drawer: null,
  review: 'not-started',
  cleared: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'success':
      return {
        ...state,
        loading: false,
        error: null,
        screeningId: action.data?.screening_id || null,
        result: mapResult(action.data),
      };

    case 'error':
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case 'details':
      return {
        ...state,
        drawer: 'details',
      };

    case 'review':
      return {
        ...state,
        drawer: 'review',
        review: 'in-progress',
      };

    case 'acknowledge-review':
      return {
        ...state,
        review: 'acknowledged',
      };

    case 'close-drawer':
      return {
        ...state,
        drawer: null,
      };

    case 'clear':
      return {
        ...state,
        cleared: true,
      };

    default:
      return state;
  }
}

export default function useScreeningResult(screeningId) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    screeningId,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadResult() {
      if (!screeningId) {
        dispatch({
          type: 'error',
          error: 'No screening ID was provided.',
        });
        return;
      }

      dispatch({ type: 'loading' });

      try {
        const data = await getScreening(screeningId);

        if (!cancelled) {
          dispatch({
            type: 'success',
            data,
          });
        }
      } catch (error) {
        if (!cancelled) {
          dispatch({
            type: 'error',
            error:
              error?.message ||
              'Unable to load the screening result.',
          });
        }
      }
    }

    loadResult();

    return () => {
      cancelled = true;
    };
  }, [screeningId]);

  const requestClearance = useCallback(async () => {
    if (!state.screeningId) return;

    try {
      await finalizeScreening(
        state.screeningId,
        'CLEAR',
        'Officer cleared passenger after reviewing screening result.',
      );

      dispatch({ type: 'clear' });
    } catch (error) {
      dispatch({
        type: 'error',
        error:
          error?.message ||
          'Unable to finalize the screening decision.',
      });
    }
  }, [state.screeningId]);

  const cancelClearance = useCallback(() => {
    // Kept for compatibility with the existing confirmation dialog.
  }, []);

  const confirmClearance = useCallback(() => {
    requestClearance();
  }, [requestClearance]);

  return {
    ...state,

    scenario: null,

    selectScenario: () => {
      // Scenario selector is no longer used for real backend results.
    },

    requestClearance,
    cancelClearance,
    confirmClearance,

    openDetails: () => dispatch({ type: 'details' }),

    openReview: () => dispatch({ type: 'review' }),

    acknowledgeReview: () =>
      dispatch({ type: 'acknowledge-review' }),

    closeDrawer: () =>
      dispatch({ type: 'close-drawer' }),
  };
}