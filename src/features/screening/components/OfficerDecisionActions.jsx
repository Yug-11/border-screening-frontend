import { useEffect, useRef } from 'react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function OfficerDecisionActions({ state }) {
  const confirmationRef = useRef(null);
  useEffect(() => {
    if (state.cleared) confirmationRef.current?.focus();
  }, [state.cleared]);
  return (
    <Card aria-labelledby="recommendation-title">
      <h2 id="recommendation-title" className="text-section font-semibold text-navy">
        System Recommendation
      </h2>
      <p className="mt-2 text-body font-medium">{state.result.recommendation}</p>
      <div className="mt-4 space-y-3 border-t border-default pt-4">
        <h3 className="text-card font-semibold text-navy">Officer Action</h3>
        <div className="flex flex-wrap gap-2">
          {state.scenario === 'low' ? (
            <Button disabled={state.cleared} onClick={state.requestClearance}>
              {state.cleared ? 'Passenger cleared' : 'Clear Passenger'}
            </Button>
          ) : (
            <Button onClick={state.openReview}>Review Case</Button>
          )}
          <Button variant="outline" onClick={state.openDetails}>
            View Details
          </Button>
        </div>
        {state.cleared && (
          <div ref={confirmationRef} tabIndex={-1}>
            <AlertBanner variant="success" title="Passenger cleared" announce>
              Demo-only clearance. No decision was saved to a database.
            </AlertBanner>
          </div>
        )}
        {state.review !== 'not-started' && (
          <p role="status" className="text-body text-info">
            {state.review === 'acknowledged'
              ? 'Demo review acknowledged. No clearance decision recorded.'
              : 'Demo review in progress. Passenger has not been cleared.'}
          </p>
        )}
        <p className="text-caption text-muted">
          All officer actions are local demo state. Changing scenario or leaving this screen resets
          them.
        </p>
      </div>
      <ConfirmDialog
        open={state.clearanceOpen}
        onClose={state.cancelClearance}
        onConfirm={state.confirmClearance}
        title="Confirm Passenger Clearance"
        description="Are you sure you want to clear this passenger?"
        confirmLabel="Confirm Clearance"
        cancelLabel="Cancel"
        variant="primary"
      >
        This confirms the fictional passenger in this demo only. Nothing is persisted or sent to a
        backend.
      </ConfirmDialog>
    </Card>
  );
}
