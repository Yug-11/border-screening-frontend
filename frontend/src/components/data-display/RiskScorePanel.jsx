import StatusBadge from '../ui/StatusBadge';

export default function RiskScorePanel({ score, max = 100, level, label = 'Risk Score' }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <dl>
        <dt className="text-caption font-medium text-muted">{label}</dt>
        <dd className="mt-1 font-semibold tabular-nums text-navy">
          <span className="text-page">{score}</span>
          <span className="text-body text-muted"> / {max}</span>
        </dd>
      </dl>
      <span className="pb-1">
        <span className="sr-only">Risk level: </span>
        <StatusBadge status={level}>{level}</StatusBadge>
      </span>
    </div>
  );
}
