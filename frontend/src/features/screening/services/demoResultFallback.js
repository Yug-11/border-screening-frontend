const DEMO_GENERATED_AT = '2026-09-06T00:00:00.000Z';

const baseRisk = {
  id: 0,
  confidence: 0.9,
  evidence_completeness: 'COMPLETE',
  positive_signals: [
    'DETERMINISTIC_VALIDATION_PASS',
    'OCR_TEXT_DETECTED',
    'REFERENCE_VERIFICATION_MATCH',
    'FACE_MATCH',
    'LIVENESS_PASSED',
  ],
  warnings: [],
  missing_evidence: [],
  policy_version: 'demo-fallback-v1',
  policy_note: 'Controlled demo fallback. Remove this module when all backend integrations are stable.',
  model_version: 'demo-fallback-v1',
  generated_at: DEMO_GENERATED_AT,
};

const factor = ({ code, category, severity, points, title, explanation, evidenceCode }) => ({
  code,
  category,
  severity,
  points,
  title,
  explanation,
  source: 'demo_result_fallback',
  evidence_code: evidenceCode || code,
  related_evidence: [evidenceCode || code],
  details: { fallback: true },
});

const demoCases = {
  genuine: {
    label: 'Genuine',
    risk: {
      ...baseRisk,
      risk_score: 13,
      risk_level: 'LOW',
      recommendation: 'AUTO_CLEAR',
      risk_factors: [
        factor({
          code: 'FACE_QUALITY_WARNING',
          category: 'BIOMETRIC',
          severity: 'LOW',
          points: 5,
          title: 'Face quality warning',
          explanation: 'Usable biometric capture with a minor quality warning.',
        }),
        factor({
          code: 'OCR_REQUIRED_FIELDS_MISSING',
          category: 'DOCUMENT',
          severity: 'MEDIUM',
          points: 8,
          title: 'OCR field extraction incomplete',
          explanation: 'A non-blocking OCR field warning was present in the demo case.',
        }),
      ],
      explanation:
        'Controlled demo fallback: genuine document evidence remains low risk and eligible for auto clear.',
    },
    documentStatus: 'PASSED',
    faceStatus: 'PASSED',
    faceSimilarity: 0.94,
  },
  tampered_document: {
    label: 'Tampered document',
    risk: {
      ...baseRisk,
      confidence: 0.88,
      risk_score: 73,
      risk_level: 'HIGH',
      recommendation: 'URGENT_OFFICER_REVIEW',
      risk_factors: [
        factor({
          code: 'REFERENCE_FIELD_MISMATCH',
          category: 'REFERENCE',
          severity: 'HIGH',
          points: 30,
          title: 'Reference record mismatch',
          explanation: 'Observed document information conflicts with the reference record.',
          evidenceCode: 'REFERENCE_VERIFICATION_MISMATCH',
        }),
        factor({
          code: 'FORENSIC_ANOMALY',
          category: 'FORENSICS',
          severity: 'MEDIUM',
          points: 20,
          title: 'Forensic anomaly',
          explanation: 'Document forensic analysis found copy-move anomaly candidates.',
          evidenceCode: 'COPY_MOVE_CANDIDATES',
        }),
        factor({
          code: 'OCR_MRZ_INCONSISTENCY',
          category: 'CONSISTENCY',
          severity: 'MEDIUM',
          points: 15,
          title: 'OCR/MRZ inconsistency',
          explanation: 'OCR and MRZ values disagree for one or more comparable fields.',
          evidenceCode: 'OCR_MRZ_MISMATCH',
        }),
        factor({
          code: 'FACE_QUALITY_WARNING',
          category: 'BIOMETRIC',
          severity: 'MEDIUM',
          points: 8,
          title: 'Face quality insufficient',
          explanation: 'Face quality was insufficient for a confident biometric comparison.',
          evidenceCode: 'FACE_QUALITY_INSUFFICIENT',
        }),
      ],
      explanation:
        'Controlled demo fallback: document tampering signals require urgent officer review.',
    },
    documentStatus: 'WARNING',
    faceStatus: 'PASSED',
    faceSimilarity: 0.9,
  },
  biometric_mismatch: {
    label: 'Biometric mismatch',
    risk: {
      ...baseRisk,
      confidence: 0.92,
      risk_score: 93,
      risk_level: 'HIGH',
      recommendation: 'URGENT_OFFICER_REVIEW',
      risk_factors: [
        factor({
          code: 'FACE_MISMATCH',
          category: 'BIOMETRIC',
          severity: 'CRITICAL',
          points: 45,
          title: 'Face mismatch',
          explanation:
            'The live face did not meet the configured similarity threshold against the resolved reference photograph.',
        }),
        factor({
          code: 'LIVENESS_FAILED',
          category: 'LIVENESS',
          severity: 'CRITICAL',
          points: 40,
          title: 'Liveness failed',
          explanation: 'The live biometric capture did not satisfy liveness checks.',
        }),
        factor({
          code: 'FACE_QUALITY_WARNING',
          category: 'BIOMETRIC',
          severity: 'MEDIUM',
          points: 8,
          title: 'Face quality insufficient',
          explanation: 'Face quality was insufficient for a confident biometric comparison.',
          evidenceCode: 'FACE_QUALITY_INSUFFICIENT',
        }),
      ],
      explanation:
        'Controlled demo fallback: biometric identity conflict requires urgent officer review.',
    },
    documentStatus: 'PASSED',
    faceStatus: 'FAILED',
    faceSimilarity: 0.41,
  },
};

function normalizeScenario(scenario) {
  if (scenario === 'low') return 'genuine';
  if (scenario === 'high' || scenario === 'tampered') return 'tampered_document';
  if (scenario === 'biometric') return 'biometric_mismatch';
  return demoCases[scenario] ? scenario : null;
}

function evidenceCheck(evidenceCode, status, message) {
  return {
    evidence_code: evidenceCode,
    category: 'DEMO_FALLBACK',
    severity: status === 'FAIL' ? 'HIGH' : 'INFO',
    status,
    source: 'demo_result_fallback',
    message,
    details: { fallback: true },
  };
}

export function demoResultFallback(screeningRef, scenario) {
  const normalized = normalizeScenario(scenario);
  if (!normalized) return null;
  const demoCase = demoCases[normalized];
  const risk = {
    ...demoCase.risk,
    screening_ref: screeningRef || `SCR-DEMO-FALLBACK-${normalized.toUpperCase()}`,
    contributing_signals: {
      recommendation: demoCase.risk.recommendation,
      risk_factors: demoCase.risk.risk_factors,
      fallback: true,
      scenario: normalized,
    },
  };
  const documentFindings = {
    reference_verification: {
      status: normalized === 'tampered_document' ? 'MISMATCH' : 'MATCH',
      matched_reference: normalized !== 'tampered_document',
      message: demoCase.label,
      fields: [],
    },
    mrz: {
      detected: true,
      valid: normalized !== 'tampered_document',
      checks: [],
      errors: normalized === 'tampered_document' ? ['Demo MRZ inconsistency'] : [],
    },
    forensics: {
      overall_forensic_signal: normalized === 'tampered_document' ? 0.82 : 0.08,
      findings:
        normalized === 'tampered_document'
          ? [{ type: 'COPY_MOVE_CANDIDATES', severity: 'WARNING', message: 'Demo tampering signal.' }]
          : [],
    },
    validation: [
      {
        rule: 'controlled_demo_fallback',
        status: demoCase.documentStatus,
        message: 'Result supplied by controlled demo fallback.',
      },
    ],
    evidence_summary: {
      status: 'REVIEW_READY',
      evidence_items: [
        evidenceCheck('DETERMINISTIC_VALIDATION_PASS', 'PASS', 'Document validation passed.'),
        evidenceCheck('OCR_TEXT_DETECTED', 'PASS', 'OCR text detected.'),
        evidenceCheck(
          normalized === 'tampered_document'
            ? 'REFERENCE_VERIFICATION_MISMATCH'
            : 'REFERENCE_VERIFICATION_MATCH',
          normalized === 'tampered_document' ? 'FAIL' : 'PASS',
          demoCase.label,
        ),
      ],
    },
  };
  return {
    risk,
    evidence: {
      screening_ref: risk.screening_ref,
      results: [
        {
          result_type: 'DOCUMENT_VERIFICATION',
          status: demoCase.documentStatus,
          confidence: 0.91,
          findings: documentFindings,
          reason: 'Controlled demo fallback document evidence.',
          evidence_reference: 'demo-fallback/document',
          created_at: DEMO_GENERATED_AT,
        },
        {
          result_type: 'FACE_VERIFICATION',
          status: demoCase.faceStatus,
          confidence: demoCase.faceSimilarity,
          similarity_score: demoCase.faceSimilarity,
          findings: {
            fallback: true,
            message: demoCase.label,
            biometric: {
              face_verification: {
                status: demoCase.faceStatus === 'FAILED' ? 'MISMATCH' : 'MATCH',
                similarity_score: demoCase.faceSimilarity,
              },
            },
          },
          reason: 'Controlled demo fallback biometric evidence.',
          evidence_reference: 'demo-fallback/biometric',
          created_at: DEMO_GENERATED_AT,
        },
      ],
    },
    source: 'demo-fallback',
    scenario: normalized,
  };
}
