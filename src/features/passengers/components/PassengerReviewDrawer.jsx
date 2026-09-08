import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import AlertBanner from '../../../components/feedback/AlertBanner';
import RiskScorePanel from '../../../components/data-display/RiskScorePanel';
import RiskFactorList from '../../screening/components/RiskFactorList';
import ResultEvidenceSection from '../../screening/components/ResultEvidenceSection';

export default function PassengerReviewDrawer({ state }) {
  const result = state.details.latestScreening;
  return (
    <Drawer
      open={state.reviewOpen}
      onClose={state.closeReview}
      title="Passenger Case Review"
      description={
        result.passenger.name +
        ' / ' +
        result.passenger.id +
        '. Fictional case; all actions are local to this visit.'
      }
      footer={
        <>
          <Button
            variant="outline"
            disabled={state.acknowledged || Boolean(state.decision)}
            onClick={state.acknowledge}
          >
            {state.acknowledged ? 'Acknowledged' : 'Acknowledge'}
          </Button>
          <Button
            variant="outline"
            disabled={Boolean(state.decision)}
            onClick={state.requestClearance}
          >
            Clear Passenger
          </Button>
          <Button disabled={Boolean(state.decision)} onClick={state.refer}>
            Refer for Further Review
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <section aria-label="Review risk summary">
          <h3 className="mb-3 text-card font-semibold text-navy">Risk Summary</h3>
          <RiskScorePanel score={result.score} level={result.level} />
          <p className="mt-3 text-body">{result.explanation}</p>
        </section>
        {state.acknowledged && (
          <AlertBanner variant="info" title="Review acknowledged" announce>
            No clearance decision has been made. This acknowledgement is demo-only and has not been
            saved.
          </AlertBanner>
        )}
        <section aria-label="Evidence requiring review">
          <h3 className="mb-3 text-card font-semibold text-navy">Evidence requiring attention</h3>
          {result.reviewReasons.length ? (
            <ul className="list-disc space-y-2 pl-5 text-body">
              {result.reviewReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p className="text-body">No significant inconsistency in this fictional scenario.</p>
          )}
        </section>
        <RiskFactorList factors={result.factors} total={result.score} />
        <ResultEvidenceSection title="Review Evidence" checks={state.details.latestChecks} />
        <section aria-label="Review recommendation">
          <h3 className="text-card font-semibold text-navy">System Recommendation</h3>
          <p className="mt-2 text-body">{result.recommendation}</p>
          <p className="mt-2 text-caption text-muted">
            These signals do not establish fraud. A demo clearance is an explicit human decision,
            not a change to the original risk or evidence.
          </p>
        </section>
      </div>
    </Drawer>
  );
}
