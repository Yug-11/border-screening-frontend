export default function QueueSummary({ summary }) {
  const metrics = [
    { key: 'waiting', label: 'Waiting' },
    { key: 'screening', label: 'Screening' },
    { key: 'review', label: 'Review Required' },
    { key: 'clearedToday', label: 'Cleared Today' },
  ];
  return (
    <section
      aria-label="Operational summary"
      className="rounded-panel border border-default bg-surface"
    >
      <dl className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
        {metrics.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <dt className="text-caption font-medium text-muted">{label}</dt>
            <dd className="text-section font-semibold tabular-nums text-navy">
              {summary[key].toLocaleString('en-US')}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-default px-4 py-2 text-caption text-muted">
        Queue counts cover all demo entries, including anomalies requiring review. Cleared Today is
        a fixed checkpoint total.
      </p>
    </section>
  );
}
