import { ArrowRight } from 'lucide-react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ProgressBar from '../../../components/ui/ProgressBar';

const titles = {
  ready: 'Ready for Screening',
  running: 'Automated Screening In Progress',
  completed: 'Automated Screening Complete',
  failed: 'Automated Screening Failed',
};

const statuses = {
  ready: 'Waiting to start screening',
  running: 'Analysis is being performed by the screening engine',
  completed: 'All screening stages have been processed',
  failed: 'The screening process encountered an error',
};

export default function ScreeningProgressHeader({
  screening,
  context = {},
  onViewResult,
}) {
  const status = screening?.status || 'ready';

  const currentStepLabel =
    screening?.currentStep?.label ||
    screening?.currentStage?.label ||
    'Preparing screening...';

  const progress = Number.isFinite(screening?.progress)
    ? screening.progress
    : 0;

  const risk = screening?.risk || 'Pending';

  const progressState =
    status === 'failed'
      ? 'failed'
      : status === 'completed'
        ? 'completed'
        : status === 'running'
          ? 'active'
          : 'pending';

  const checkpoint =
    context?.checkpoint ||
    screening?.checkpoint ||
    'Authorized Screening Checkpoint';

  const screeningId = screening?.screeningId || screening?.screening_id;

  return (
    <Card aria-labelledby="screening-overall-title">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2
              id="screening-overall-title"
              className="text-section font-semibold text-navy"
            >
              {titles[status] || 'Automated Screening'}
            </h2>

            <p className="mt-1 text-body text-muted">
              {statuses[status] || 'Screening system status'}
            </p>
          </div>

          <Badge variant={status === 'failed' ? 'danger' : 'info'}>
            Live backend screening
          </Badge>
        </div>

        {/* Explanation */}
        <p className="text-caption text-muted">
          The screening engine is processing the submitted document through
          document analysis, OCR, validation, identity checks, face
          verification, risk assessment and audit logging.
        </p>

        {/* Screening information */}
        <dl className="grid grid-cols-2 gap-4 text-body lg:grid-cols-4">

          <div>
            <dt className="text-caption text-muted">
              Checkpoint
            </dt>

            <dd className="font-semibold text-navy">
              {checkpoint}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Screening ID
            </dt>

            <dd
              className="truncate font-medium"
              title={screeningId || 'Generating...'}
            >
              {screeningId || 'Generating...'}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Current Stage
            </dt>

            <dd className="font-medium">
              {currentStepLabel}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Risk
            </dt>

            <dd>
              {risk === 'Pending' ? (
                <Badge>Pending</Badge>
              ) : (
                <span className="font-medium text-info">
                  {risk}
                </span>
              )}
            </dd>
          </div>

        </dl>

        {/* Overall progress */}
        <ProgressBar
          value={progress}
          status={progressState}
          label="Overall Progress"
        />

        {/* Screen-reader status */}
        <p
          className="sr-only"
          role="status"
          aria-atomic="true"
        >
          {titles[status] || 'Automated Screening'}.
          {' '}
          {currentStepLabel}.
          {' '}
          {progress}% of screening stages processed.
          {' '}
          Risk: {risk}.
        </p>

        {/* Error */}
        {screening?.error && (
          <AlertBanner
            variant="danger"
            title="Screening failed"
            announce
          >
            {screening.error}
          </AlertBanner>
        )}

        {/* Backend screening information */}
        {!screening?.error && status === 'running' && (
          <AlertBanner
            variant="info"
            title="Live Screening"
          >
            The backend screening engine is processing this case.
            Progress updates are received directly from the screening
            pipeline.
          </AlertBanner>
        )}

        {/* Completed */}
        {status === 'completed' && (
          <AlertBanner
            variant="success"
            title="Screening complete"
          >
            All screening stages have completed. The screening result
            is ready for review.
          </AlertBanner>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <AlertBanner
            variant="danger"
            title="Screening could not be completed"
            announce
          >
            The screening engine reported an error. Please review the
            error above and retry the screening if appropriate.
          </AlertBanner>
        )}

        {/* Result button */}
        {status === 'completed' && screeningId && (
          <div className="flex flex-wrap items-center gap-3 border-t border-default pt-4">
            <Button onClick={onViewResult}>
              View Screening Result
              <ArrowRight
                aria-hidden="true"
                className="icon-sm"
              />
            </Button>

            <p className="text-caption text-muted">
              Review OCR, identity validation, face verification,
              risk assessment, audit and integrity information.
            </p>
          </div>
        )}

      </div>
    </Card>
  );
}