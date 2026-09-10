import { useNavigate } from 'react-router';

import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function ScreeningResultDrawer({ state }) {
  const navigate = useNavigate();

  const review = state?.drawer === 'review';
  const result = state?.result;

  if (!result) {
    return null;
  }

  const groups = [
    ['Document Validation', result.documentValidation || []],
    ['Tampering Analysis', result.tamperingEvidence || []],
    ['MRZ Validation', result.mrz?.checks || []],
  ];

  const face = result.face;

  let faceSimilarity = null;

  if (typeof face?.similarity === 'number') {
    faceSimilarity =
      Math.abs(face.similarity) <= 1
        ? face.similarity * 100
        : face.similarity;
  }

  return (
    <Drawer
      open={Boolean(state?.drawer)}
      onClose={state.closeDrawer}
      title={review ? 'Officer Review' : 'Screening Details'}
      description={
        result.passenger?.name
          ? `Screening details for ${result.passenger.name}.`
          : 'Completed screening details.'
      }
      footer={
        <>
          {review && (
            <Button onClick={state.acknowledgeReview}>
              Acknowledge Review
            </Button>
          )}

          <Button
            variant="outline"
            onClick={state.closeDrawer}
          >
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Summary */}
        <dl className="space-y-3 text-body">
          <div className="flex flex-wrap justify-between gap-2">
            <dt>Risk</dt>

            <dd>
              <StatusBadge status={result.level}>
                {result.level}
              </StatusBadge>{' '}

              <span className="tabular-nums">
                {result.score ?? 0} / 100
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-muted">
              Document identifier
            </dt>

            <dd>
              {result.passenger?.documentId ||
                result.passenger?.document ||
                'Not available'}
            </dd>
          </div>

          <div>
            <dt className="text-muted">
              System decision
            </dt>

            <dd className="font-semibold">
              {result.decision || 'PENDING'}
            </dd>
          </div>
        </dl>

        {/* Officer review */}
        {review ? (
          <>
            <AlertBanner
              variant={result.tone || 'warning'}
              title="Officer review required"
            >
              {result.recommendation ||
                'This screening contains signals that require officer attention.'}
            </AlertBanner>

            {state.review === 'acknowledged' && (
              <AlertBanner
                variant="info"
                title="Review acknowledged"
                announce
              >
                The review has been acknowledged. The final
                screening decision remains with the authorized
                officer.
              </AlertBanner>
            )}

            <section aria-label="Review reasons">
              <h3 className="mb-3 text-card font-semibold text-navy">
                Evidence requiring attention
              </h3>

              {result.reviewReasons?.length ? (
                <ul className="list-disc space-y-3 pl-5 text-body">
                  {result.reviewReasons.map((reason, index) => (
                    <li key={`${reason}-${index}`}>
                      {reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-body text-muted">
                  No additional review reasons were provided by
                  the screening engine.
                </p>
              )}
            </section>
          </>
        ) : (
          <>
            {/* Why this result */}
            <section>
              <h3 className="text-card font-semibold text-navy">
                Why this result?
              </h3>

              <p className="mt-2 text-body">
                {result.explanation ||
                  'The result is based on the available document, identity, validation and risk signals.'}
              </p>
            </section>

            {/* Evidence summary */}
            <section>
              <h3 className="mb-3 text-card font-semibold text-navy">
                Evidence Summary
              </h3>

              <dl className="space-y-3 text-body">
                {groups.map(([label, checks]) => {
                  const passed = checks.filter(
                    (check) => check.status === 'PASSED',
                  ).length;

                  const warnings = checks.filter(
                    (check) =>
                      check.status === 'WARNING' ||
                      check.status === 'REVIEW',
                  ).length;

                  const failed = checks.filter(
                    (check) => check.status === 'FAILED',
                  ).length;

                  return (
                    <div key={label}>
                      <dt className="font-medium">
                        {label}
                      </dt>

                      <dd className="mt-1 text-muted">
                        {passed} passed &middot;{' '}
                        {warnings} review{' '}
                        &middot; {failed} failed
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>

            {/* Face and identity */}
            <section>
              <h3 className="text-card font-semibold text-navy">
                Face and Identity
              </h3>

              {face ? (
                <p className="mt-2 text-body">
                  Face similarity:{' '}
                  {faceSimilarity !== null
                    ? `${faceSimilarity.toFixed(1)}%`
                    : 'N/A'}{' '}
                  &middot; {face.status || 'UNKNOWN'}
                </p>
              ) : (
                <p className="mt-2 text-body text-muted">
                  Face verification was not performed because no
                  verification image was submitted.
                </p>
              )}
            </section>

            <p className="text-caption text-muted">
              Full check explanations and the complete screening
              timeline are available on the result page.
            </p>
          </>
        )}
      </div>
    </Drawer>
  );
}