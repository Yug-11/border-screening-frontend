import RiskScorePanel from '../../../components/data-display/RiskScorePanel';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

export default function ScreeningResultHeader({ result }) {
  return (
    <Card aria-labelledby="result-summary-title">
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between gap-3">
          <h2 id="result-summary-title" className="text-section font-semibold text-navy">
            Automated Screening Complete
          </h2>
          <Badge variant="info">Demo screening result</Badge>
        </div>
        <p className="text-body text-muted">
          Fictional evidence and scores only. No document, biometric or database analysis has been
          performed. Complete means the demo assessment finished, not that every check passed.
        </p>
        <div className="grid gap-5 border-y border-default py-4 sm:grid-cols-2">
          <RiskScorePanel score={result.score} level={result.level} />
          <dl>
            <dt className="text-caption font-medium text-muted">System decision</dt>
            <dd className="mt-2 text-card font-semibold text-navy">{result.decision}</dd>
          </dl>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-body lg:grid-cols-4">
          <div>
            <dt className="text-caption text-muted">Checkpoint</dt>
            <dd>{result.checkpoint}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Queue</dt>
            <dd className="font-semibold tabular-nums">#{result.queueNumber}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Passenger</dt>
            <dd>{result.passenger.name}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Screening completed</dt>
            <dd>
              <time dateTime={result.completedAt}>{result.completedAt}</time>
              <span className="block text-caption text-muted">Illustrative completion time</span>
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
