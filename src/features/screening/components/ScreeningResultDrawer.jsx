import { useNavigate } from 'react-router';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function ScreeningResultDrawer({ state }) {
  const navigate = useNavigate();
  const review = state.drawer === 'review';
  const result = state.result;
  const groups = [
    ['Document Validation', result.documentValidation],
    ['Tampering Analysis', result.tamperingEvidence],
    ['MRZ Validation', result.mrz.checks],
  ];
  return (
    <Drawer
      open={Boolean(state.drawer)}
      onClose={state.closeDrawer}
      title={review ? 'Officer Review' : 'Screening Details'}
      description={
        'Fictional queue #' +
        result.queueNumber +
        ' / ' +
        result.passenger.name +
        '. No real analysis or saved decision.'
      }
      footer={
        <>
          {review && <Button onClick={state.acknowledgeReview}>Acknowledge Demo Review</Button>}
          <Button
            variant="outline"
            onClick={() =>
              navigate('/duty-officer/passengers/' + result.passenger.id, {
                state: { demoScenario: result.id },
              })
            }
          >
            Open Passenger Detail
          </Button>
          <Button variant="outline" onClick={state.closeDrawer}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <dl className="space-y-3 text-body">
          <div className="flex flex-wrap justify-between gap-2">
            <dt>Risk</dt>
            <dd>
              <StatusBadge status={result.level}>{result.level}</StatusBadge>{' '}
              <span className="tabular-nums">{result.score} / 100</span>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Demo document identifier</dt>
            <dd>{result.passenger.documentId}</dd>
          </div>
          <div>
            <dt className="text-muted">System decision</dt>
            <dd className="font-semibold">{result.decision}</dd>
          </div>
        </dl>
        {review ? (
          <>
            <AlertBanner variant={result.tone} title="Officer review required">
              {result.recommendation} These fictional signals are not a determination of fraud.
            </AlertBanner>
            {state.review === 'acknowledged' && (
              <AlertBanner variant="info" title="Demo review acknowledged" announce>
                No clearance decision was recorded. The case still requires an officer decision;
                nothing was saved.
              </AlertBanner>
            )}
            <section aria-label="Review reasons">
              <h3 className="mb-3 text-card font-semibold text-navy">
                Evidence requiring attention
              </h3>
              <ul className="list-disc space-y-3 pl-5 text-body">
                {result.reviewReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <>
            <section>
              <h3 className="text-card font-semibold text-navy">Why this result?</h3>
              <p className="mt-2 text-body">{result.explanation}</p>
            </section>
            <section>
              <h3 className="mb-3 text-card font-semibold text-navy">Evidence summary</h3>
              <dl className="space-y-3 text-body">
                {groups.map(([label, checks]) => (
                  <div key={label}>
                    <dt className="font-medium">{label}</dt>
                    <dd className="mt-1 text-muted">
                      {checks.filter((check) => check.status === 'PASSED').length} passed &middot;{' '}
                      {checks.filter((check) => check.status === 'WARNING').length} warnings
                      &middot; {checks.filter((check) => check.status === 'FAILED').length} failed
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <h3 className="text-card font-semibold text-navy">Face and identity</h3>
              <p className="mt-2 text-body">
                Demo face similarity: {result.face.similarity.toFixed(1)}% &middot;{' '}
                {result.face.status}
              </p>
              <p className="mt-2 text-body">
                {result.identityIntelligence.find((check) => check.id === 'associations').status}
              </p>
            </section>
            <p className="text-caption text-muted">
              Full check explanations and the timeline are on the result page. No raw biometric
              data, database records or model output is present.
            </p>
          </>
        )}
      </div>
    </Drawer>
  );
}
