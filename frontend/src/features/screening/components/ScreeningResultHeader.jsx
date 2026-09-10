import RiskScorePanel from '../../../components/data-display/RiskScorePanel';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

export default function ScreeningResultHeader({ result }) {
  const hasCompletionTime = Boolean(result?.completedAt);

  return (
    <Card aria-labelledby="result-summary-title">
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between gap-3">
          <h2
            id="result-summary-title"
            className="text-section font-semibold text-navy"
          >
            Automated Screening Complete
          </h2>

          <Badge variant="success">
            Screening completed
          </Badge>
        </div>

        <p className="text-body text-muted">
          Automated document and identity screening has completed using the
          configured BorderGuard AI backend and synthetic test data.
        </p>

        <div className="grid gap-5 border-y border-default py-4 sm:grid-cols-2">
          <RiskScorePanel
            score={result?.score ?? 0}
            level={result?.level || 'UNKNOWN'}
          />

          <dl>
            <dt className="text-caption font-medium text-muted">
              System decision
            </dt>

            <dd className="mt-2 text-card font-semibold text-navy">
              {result?.decision || 'UNKNOWN'}
            </dd>

            <p className="mt-1 text-caption text-muted">
              Final action remains with the authorized officer.
            </p>
          </dl>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-body lg:grid-cols-4">
          <div>
            <dt className="text-caption text-muted">
              Checkpoint
            </dt>
            <dd className="font-medium">
              {result?.checkpoint || 'N/A'}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Screening ID
            </dt>
            <dd className="font-medium break-all">
              {result?.screeningId || result?.id || 'N/A'}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Passenger
            </dt>
            <dd className="font-medium">
              {result?.passenger?.name || 'Unknown passenger'}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Screening completed
            </dt>

            <dd className="font-medium">
              {hasCompletionTime ? (
                <time dateTime={result.completedAt}>
                  {new Date(result.completedAt).toLocaleString()}
                </time>
              ) : (
                'N/A'
              )}
            </dd>
          </div>
        </dl>

        <div className="border-t border-default pt-4">
          <p className="text-caption text-muted">
            Prototype notice
          </p>

          <p className="mt-1 text-body text-muted">
            Screening uses synthetic test documents and reference records.
            Results are for demonstration and are not used for real-world
            identity or border decisions.
          </p>
        </div>
      </div>
    </Card>
  );
}