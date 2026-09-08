import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import PassengerReviewDrawer from './PassengerReviewDrawer';

export default function PassengerActionBar({ state }) {
  const navigate = useNavigate();
  const feedbackRef = useRef(null);
  const result = state.details.latestScreening;
  useEffect(() => {
    if (!state.decision) return;
    const frame = requestAnimationFrame(() => feedbackRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [state.decision]);
  function showHistory() {
    const section = document.getElementById('screening-history');
    section?.focus({ preventScroll: true });
    section?.scrollIntoView({ block: 'start' });
  }
  return (
    <>
      <Card aria-labelledby="case-actions-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 id="case-actions-title" className="text-section font-semibold text-navy">
              Officer Action
            </h2>
            <p className="mt-2 text-body">{result.recommendation}</p>
            <p className="mt-2 text-caption text-muted">
              Decisions are demo-only, are not saved, and reset when leaving this case or changing
              scenarios.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={Boolean(state.decision)}
              onClick={result.id === 'low' ? state.requestClearance : state.openReview}
            >
              {result.id === 'low' ? 'Clear Passenger' : 'Review Case'}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate('/duty-officer/screening/result', {
                  state: { demoScenario: state.scenario },
                })
              }
            >
              View Latest Screening
            </Button>
            <Button variant="ghost" onClick={showHistory}>
              View Screening History
            </Button>
          </div>
        </div>
        {state.decision && (
          <div ref={feedbackRef} tabIndex={-1} className="mt-4 rounded-control">
            <AlertBanner
              variant={state.decision === 'cleared' ? 'success' : 'info'}
              title={
                state.decision === 'cleared' ? 'Passenger cleared' : 'Referred for further review'
              }
              announce
            >
              Local demo decision only. No database record, alert or historical audit entry was
              changed. The original {result.level} risk assessment remains unchanged.
            </AlertBanner>
          </div>
        )}
      </Card>
      <PassengerReviewDrawer state={state} />
      <ConfirmDialog
        open={state.confirmationOpen}
        onClose={state.cancelClearance}
        onConfirm={state.confirmClearance}
        title="Confirm Passenger Clearance"
        description="Are you sure you want to clear this passenger?"
        confirmLabel="Confirm Clearance"
        variant="primary"
      >
        <p className="text-body">
          {result.passenger.name} &middot; {result.passenger.id}
        </p>
        {result.id !== 'low' && (
          <p className="mt-3 text-body font-medium">
            The automated assessment remains {result.level} risk with unresolved review signals.
          </p>
        )}
        <p className="mt-3 text-body">
          This confirms a local demo decision only. Nothing will be saved or sent to a server.
        </p>
      </ConfirmDialog>
    </>
  );
}
