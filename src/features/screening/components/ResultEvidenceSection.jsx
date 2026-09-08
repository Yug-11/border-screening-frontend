import { useId } from 'react';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function ResultEvidenceSection({ title, checks, status, explanation }) {
  const titleId = useId();
  return (
    <Card aria-labelledby={titleId}>
      <div className="mb-4 flex flex-wrap justify-between gap-2">
        <h2 id={titleId} className="text-section font-semibold text-navy">
          {title}
        </h2>
        {status && <StatusBadge status={status}>{status}</StatusBadge>}
      </div>
      {explanation && <p className="mb-4 text-body text-muted">{explanation}</p>}
      <dl className="grid gap-x-5 gap-y-4 text-body sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check.id}
            className="flex min-w-0 flex-wrap items-start justify-between gap-2 border-b border-default pb-3"
          >
            <dt className="font-medium">{check.label}</dt>
            <dd>
              <StatusBadge status={check.status} variant={check.variant}>
                {check.status}
              </StatusBadge>
            </dd>
            {check.explanation && (
              <dd className="w-full text-caption text-muted">{check.explanation}</dd>
            )}
          </div>
        ))}
      </dl>
      <p className="mt-3 text-caption text-muted">
        Illustrative demo findings, not actual analysis.
      </p>
    </Card>
  );
}
