import { useEffect, useRef } from 'react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function OfficerDecisionActions({ state }) {
  const confirmationRef = useRef(null);

  const result = state?.result || {};
  const decision = String(result.decision || 'UNKNOWN').toUpperCase();
  const isCleared = Boolean(state?.cleared);
  const isReviewing = state?.review === 'in-progress';
  const isAcknowledged = state?.review === 'acknowledged';

  useEffect(() => {
    if (isCleared) {
      confirmationRef.current?.focus();
    }
  }, [isCleared]);

  const canClear =
    !isCleared &&
    decision === 'CLEAR';

  return (
    <Card aria-labelledby="recommendation-title">
      <h2
        id="recommendation-title"
        className="text-section font-semibold text-navy"
      >
        System Recommendation
      </h2>

      <p className="mt-2 text-body font-medium">
        {result.recommendation ||
          'The backend screening engine has completed its assessment. Final action remains with the authorized officer.'}
      </p>

      <div className="mt-4 space-y-3 border-t border-default pt-4">
        <h3 className="text-card font-semibold text-navy">
          Officer Action
        </h3>

        <div className="flex flex-wrap gap-2">
          {canClear ? (
            <Button onClick={state.requestClearance}>
              Clear Passenger
            </Button>
          ) : isCleared ? (
            <Button disabled>
              Passenger cleared
            </Button>
          ) : (
            <Button onClick={state.openReview}>
              Review Case
            </Button>
          )}

          <Button
            variant="outline"
            onClick={state.openDetails}
          >
            View Details
          </Button>
        </div>

        {isCleared && (
          <div
            ref={confirmationRef}
            tabIndex={-1}
          >
            <AlertBanner
              variant="success"
              title="Passenger cleared"
              announce
            >
              The officer clearance decision was submitted to the backend
              screening service.
            </AlertBanner>
          </div>
        )}

        {isAcknowledged && (
          <p
            role="status"
            className="text-body text-info"
          >
            Officer review acknowledged. Final clearance has not been
            recorded.
          </p>
        )}

        {isReviewing && !isAcknowledged && (
          <p
            role="status"
            className="text-body text-info"
          >
            Officer review is in progress. Passenger has not been cleared.
          </p>
        )}

        <p className="text-caption text-muted">
          Officer actions are connected to the screening workflow. Final
          decisions remain under authorized officer control.
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
        This action will submit the officer clearance decision for this
        screening to the backend.
      </ConfirmDialog>
    </Card>
  );
}