import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import RiskScorePanel from '../../../components/data-display/RiskScorePanel';

export default function PassengerScreeningSummary({ result, date }) {
  return (
    <Card aria-labelledby="current-screening-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="current-screening-title" className="text-section font-semibold text-navy">
          Current Screening
        </h2>
        <Badge variant="info">Fictional case file</Badge>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <RiskScorePanel score={result.score} level={result.level} />
        <dl className="space-y-3 text-body">
          <div>
            <dt className="text-caption text-muted">Automated screening status</dt>
            <dd className="mt-1 font-semibold text-navy">{result.decision}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Screening completed</dt>
            <dd>
              <time dateTime={date + 'T' + result.completedAt}>
                {date} &middot; {result.completedAt}
              </time>
            </dd>
          </div>
        </dl>
        <dl className="space-y-3 text-body">
          <div>
            <dt className="text-caption text-muted">Checkpoint</dt>
            <dd className="mt-1 font-medium">{result.checkpoint}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Passenger / Queue</dt>
            <dd>
              {result.passenger.name} &middot;{' '}
              <span className="font-semibold tabular-nums">#{result.queueNumber}</span>
            </dd>
          </div>
        </dl>
      </div>
      <p className="mt-4 border-t border-default pt-3 text-caption text-muted">
        Demo screening only. No AI, document, biometric or database checks have been performed.
        Officer actions below are local and do not change the supplied automated risk assessment.
      </p>
    </Card>
  );
}
