import {
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

const statusConfig = {
  ready: {
    label: 'Waiting',
    variant: 'neutral',
  },
  running: {
    label: 'In Progress',
    variant: 'info',
  },
  completed: {
    label: 'Completed',
    variant: 'success',
  },
  failed: {
    label: 'Failed',
    variant: 'danger',
  },
};

const stageDescriptions = {
  'document-detection':
    'Detecting and preparing the submitted document image.',

  ocr:
    'Extracting identity and document information using OCR.',

  'structure-analysis':
    'Analyzing the document structure and extracted regions.',

  'document-validation':
    'Checking extracted document information against validation rules.',

  'tampering-analysis':
    'Analyzing the document for potential visual manipulation or anomalies.',

  'mrz-validation':
    'Checking the Machine Readable Zone and consistency with extracted fields.',

  'face-extraction':
    'Locating the document photograph for identity verification.',

  'face-verification':
    'Comparing the document photograph with the verification image.',

  'risk-assessment':
    'Combining screening signals into a consolidated risk assessment.',
};

export default function CurrentAnalysisPanel({ screening }) {
  const status = screening?.status || 'ready';

  const currentStep =
    screening?.currentStep ||
    screening?.steps?.find((step) => step?.status === 'active') ||
    null;

  const stageId = currentStep?.id || screening?.currentStage || null;

  const stageLabel =
    currentStep?.label ||
    getStageLabel(stageId) ||
    'Preparing screening...';

  const stageDescription =
    currentStep?.description ||
    stageDescriptions[stageId] ||
    'The screening engine is preparing the next analysis stage.';

  const config =
    statusConfig[status] || statusConfig.ready;

  const processedCount = screening?.processedCount ?? 0;
  const totalStages = screening?.steps?.length ?? 9;
  const progress = screening?.progress ?? 0;

  return (
    <Card aria-labelledby="current-analysis-title">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="current-analysis-title"
            className="text-section font-semibold text-navy"
          >
            Current Analysis
          </h2>

          <Badge variant={config.variant}>
            {config.label}
          </Badge>
        </div>

        {/* Current stage */}
        <div>
          <p className="text-card font-semibold text-navy">
            {stageLabel}
          </p>

          <p className="mt-2 text-body text-muted">
            {stageDescription}
          </p>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-2 gap-4 border-t border-default pt-4">

          <div>
            <p className="text-caption text-muted">
              Overall Progress
            </p>

            <p className="mt-1 text-body font-semibold text-navy">
              {progress}%
            </p>
          </div>

          <div>
            <p className="text-caption text-muted">
              Stages Processed
            </p>

            <p className="mt-1 text-body font-semibold text-navy">
              {processedCount} / {totalStages}
            </p>
          </div>

        </div>

        {/* Current stage status */}
        {status === 'running' && (
          <div className="rounded-lg border border-default p-4">
            <div className="flex items-center gap-3">

              <Loader2
                aria-hidden="true"
                className="icon-md animate-spin text-info"
              />

              <div>
                <p className="text-body font-semibold text-navy">
                  Analysis in progress
                </p>

                <p className="mt-1 text-caption text-muted">
                  The backend screening engine is processing this stage.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Completed */}
        {status === 'completed' && (
          <div className="rounded-lg border border-default p-4">
            <div className="flex items-center gap-3">

              <CheckCircle2
                aria-hidden="true"
                className="icon-md text-success"
              />

              <div>
                <p className="text-body font-semibold text-navy">
                  Screening completed
                </p>

                <p className="mt-1 text-caption text-muted">
                  All screening stages have been processed. The final result
                  is ready for review.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div className="rounded-lg border border-default p-4">
            <div className="flex items-center gap-3">

              <XCircle
                aria-hidden="true"
                className="icon-md text-danger"
              />

              <div>
                <p className="text-body font-semibold text-navy">
                  Screening failed
                </p>

                <p className="mt-1 text-caption text-muted">
                  {screening?.error ||
                    screening?.failure?.message ||
                    'The screening engine could not complete this stage.'}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Ready */}
        {status === 'ready' && (
          <div className="rounded-lg border border-default p-4">
            <div className="flex items-center gap-3">

              <Circle
                aria-hidden="true"
                className="icon-md text-muted"
              />

              <div>
                <p className="text-body font-semibold text-navy">
                  Waiting for screening
                </p>

                <p className="mt-1 text-caption text-muted">
                  The screening engine will begin processing the submitted
                  document.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Stage list */}
        {screening?.steps?.length > 0 && (
          <div className="border-t border-default pt-4">

            <p className="mb-3 text-caption font-medium text-muted">
              Screening Pipeline
            </p>

            <div className="space-y-2">

              {screening.steps.map((step) => {
                const stepStatus = step?.status || 'pending';

                return (
                  <div
                    key={step?.id || step?.label}
                    className="flex items-center justify-between gap-3 py-1.5"
                  >

                    <div className="flex min-w-0 items-center gap-2">

                      <StageIcon status={stepStatus} />

                      <span
                        className={
                          stepStatus === 'active'
                            ? 'truncate text-body font-medium text-navy'
                            : 'truncate text-body text-muted'
                        }
                      >
                        {step?.label || 'Screening stage'}
                      </span>

                    </div>

                    <StageBadge status={stepStatus} />

                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* Backend notice */}
        <p className="text-caption text-muted">
          Live backend screening &middot; results are generated by the
          connected screening pipeline.
        </p>

      </div>
    </Card>
  );
}

function StageIcon({ status }) {
  if (status === 'completed') {
    return (
      <CheckCircle2
        aria-hidden="true"
        className="icon-sm text-success"
      />
    );
  }

  if (status === 'active') {
    return (
      <Loader2
        aria-hidden="true"
        className="icon-sm animate-spin text-info"
      />
    );
  }

  if (status === 'warning') {
    return (
      <AlertTriangle
        aria-hidden="true"
        className="icon-sm text-warning"
      />
    );
  }

  if (status === 'failed') {
    return (
      <XCircle
        aria-hidden="true"
        className="icon-sm text-danger"
      />
    );
  }

  return (
    <Circle
      aria-hidden="true"
      className="icon-sm text-muted"
    />
  );
}

function StageBadge({ status }) {
  if (status === 'completed') {
    return <Badge variant="success">Completed</Badge>;
  }

  if (status === 'active') {
    return <Badge variant="info">Processing</Badge>;
  }

  if (status === 'warning') {
    return <Badge variant="warning">Review</Badge>;
  }

  if (status === 'failed') {
    return <Badge variant="danger">Failed</Badge>;
  }

  return <Badge variant="neutral">Pending</Badge>;
}

function getStageLabel(stageId) {
  const labels = {
    'document-detection': 'Document Detection',
    ocr: 'OCR',
    'structure-analysis': 'Structure Analysis',
    'document-validation': 'Document Validation',
    'tampering-analysis': 'Tampering Analysis',
    'mrz-validation': 'MRZ Validation',
    'face-extraction': 'Face Extraction',
    'face-verification': 'Face Verification',
    'risk-assessment': 'Risk Assessment',
  };

  return labels[stageId] || null;
}