import { useState } from 'react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function ReviewRequiredDrawer({ passenger }) {
  const [notice, setNotice] = useState('');
  return (
    <section aria-label="Review details" className="space-y-4">
      <AlertBanner
        variant={
          passenger.risk === 'HIGH' || passenger.status === 'Anomaly Detected'
            ? 'danger'
            : 'warning'
        }
        title="Officer intervention required"
      >
        {passenger.review?.reason || 'This demo entry requires officer attention.'}
      </AlertBanner>
      <div>
        <h3 className="mb-3 text-card font-semibold text-navy">Fictional demo evidence</h3>
        <dl className="divide-y divide-default">
          {passenger.review?.evidence.map((item) => (
            <div
              key={item.label}
              className="flex flex-wrap items-center justify-between gap-2 py-2"
            >
              <dt className="text-body">{item.label}</dt>
              <dd>
                <StatusBadge status={item.result}>{item.result}</StatusBadge>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            setNotice(
              'The full screening result is not implemented yet. Only the fictional summary and evidence shown here are available.',
            )
          }
        >
          View Screening Result
        </Button>
        <Button
          onClick={() =>
            setNotice(
              'The officer review workflow is not implemented yet. No decision has been recorded and this passenger remains in the review queue.',
            )
          }
        >
          Continue Review
        </Button>
      </div>
      {notice && (
        <AlertBanner variant="info" title="Demo placeholder" announce>
          {notice}
        </AlertBanner>
      )}
    </section>
  );
}
