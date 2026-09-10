import { ScanLine } from 'lucide-react';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import ProgressBar from '../../../components/ui/ProgressBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import StepIndicator from '../../../components/ui/StepIndicator';

export default function ActiveScreeningPanel({ screening }) {
  return (
    <Card title="Active Screening" description="Automated checks, with referral when needed.">
      {!screening ? (
        <EmptyState
          title="No active screening"
          description="An active screening summary will appear here."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-navy">{screening.passengerName}</p>
              <p className="text-caption tabular-nums text-muted">Queue #{screening.queueNumber}</p>
            </div>
            <StatusBadge status={screening.status}>{screening.status}</StatusBadge>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-caption text-muted">Current stage</p>
            <p className="text-body font-semibold text-navy">{screening.stage}</p>
          </div>
          <ProgressBar label="Automated screening" value={screening.progress} />
          <div className="border-t border-default pt-4">
            <StepIndicator
              steps={screening.steps}
              label="Automated screening stages"
              orientation="vertical"
            />
          </div>
          <p className="flex items-start gap-2 border-t border-default pt-4 text-caption text-muted">
            <ScanLine aria-hidden="true" className="icon-sm mt-0.5" />
            The software performs verification. Officer intervention is only required for referred
            cases.
          </p>
        </div>
      )}
    </Card>
  );
}
