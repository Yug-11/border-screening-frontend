import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import { mockAnalysisChecks } from '../../../data/mockScreeningProgress';

const labels = {
  ready: 'Waiting',
  running: 'In Progress',
  completed: 'Completed',
  failed: 'Failed',
};
const tones = { ready: 'neutral', running: 'info', completed: 'success', failed: 'danger' };

export default function CurrentAnalysisPanel({ screening }) {
  const checks = mockAnalysisChecks[screening.currentStep.id] || [];
  return (
    <Card aria-labelledby="current-analysis-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="current-analysis-title" className="text-section font-semibold text-navy">
          Current Analysis
        </h2>
        <Badge variant={tones[screening.status]}>{labels[screening.status]}</Badge>
      </div>
      <p className="text-card font-semibold text-navy">{screening.currentStep.label}</p>
      <p className="mt-2 text-body text-muted">{screening.currentStep.description}</p>
      <p className="mt-2 text-caption text-muted">
        Demo UI states only &middot; no actual analysis performed
      </p>
      {screening.status === 'completed' ? (
        <p className="mt-4 border-t border-default pt-4 text-body">
          The fictional risk-assessment stage is complete. View Screening Result opens the matching
          demo summary; no score is displayed on this progress screen.
        </p>
      ) : (
        <dl className="mt-4 divide-y divide-default text-body">
          {checks.map((check, index) => {
            const status =
              screening.status === 'ready'
                ? 'Pending'
                : screening.status === 'failed'
                  ? index === 0
                    ? 'Failed'
                    : 'Not run'
                  : check.status;
            return (
              <div
                key={check.label}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <dt>{check.label}</dt>
                <dd>
                  <Badge
                    variant={
                      status === 'Failed' ? 'danger' : status === 'Analyzing' ? 'info' : 'neutral'
                    }
                  >
                    {status}
                  </Badge>
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </Card>
  );
}
