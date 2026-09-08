import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ProgressBar from '../../../components/ui/ProgressBar';
import Select from '../../../components/ui/Select';
import { demoScreeningScenarios } from '../../../data/mockScreeningProgress';

const titles = {
  ready: 'Ready for Demo Screening',
  running: 'Automated Screening In Progress',
  completed: 'Automated Screening Complete',
  failed: 'Automated Screening Stopped',
};
const statuses = {
  ready: 'Waiting for demo start',
  running: 'Analysis in progress',
  completed: 'Demo sequence complete',
  failed: 'Anomaly detected - demo stopped',
};

export default function ScreeningProgressHeader({ screening, context, onViewResult }) {
  const progressState =
    screening.status === 'failed'
      ? 'failed'
      : screening.warnings.length
        ? 'warning'
        : screening.status === 'completed'
          ? 'completed'
          : screening.status === 'ready'
            ? 'pending'
            : 'active';
  return (
    <Card aria-labelledby="screening-overall-title">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="screening-overall-title" className="text-section font-semibold text-navy">
              {titles[screening.status]}
            </h2>
            <p className="mt-1 text-body text-muted">{statuses[screening.status]}</p>
          </div>
          <Badge variant="info">Demo screening</Badge>
        </div>
        <p className="text-caption text-muted">
          Illustrative workflow only. No documents, images or identities are analyzed. Run Demo
          Screening plays one finite sequence.
        </p>
        <dl className="grid grid-cols-2 gap-4 text-body lg:grid-cols-4">
          <div>
            <dt className="text-caption text-muted">Queue</dt>
            <dd className="font-semibold tabular-nums text-navy">#{context.queueNumber}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Passenger</dt>
            <dd className="font-semibold">{context.passenger}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Current Stage</dt>
            <dd className="font-medium">{screening.currentStep.label}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Risk</dt>
            <dd>
              {screening.risk === 'Pending' ? (
                <Badge>Pending</Badge>
              ) : (
                <span className="text-info">{screening.risk}</span>
              )}
            </dd>
          </div>
        </dl>
        <ProgressBar value={screening.progress} status={progressState} label="Overall Progress" />
        <p className="sr-only" role="status" aria-atomic="true">
          {titles[screening.status]}. {screening.currentStep.label}. {screening.progress}% of demo
          stages processed. Risk: {screening.risk}.
        </p>
        {screening.warnings.map((warning) => (
          <AlertBanner
            key={warning.stageId}
            variant="warning"
            title="Review required - demo exception"
            announce
          >
            {warning.message} This is a fictional warning, not a determination of fraud.
          </AlertBanner>
        ))}
        {screening.failure && (
          <AlertBanner variant="danger" title="Demo screening stopped" announce>
            {screening.failure.message} No real MRZ was analyzed. Remaining stages have not run;
            risk is pending.
          </AlertBanner>
        )}
        {screening.status === 'completed' && (
          <p className="text-body text-muted">
            {screening.warnings.length
              ? 'The demo sequence is complete. The warning remains unresolved for officer review.'
              : 'All nine demo stages are complete. No final risk score or clearance decision is shown here.'}
          </p>
        )}
        <div className="space-y-3 border-t border-default pt-4">
          <div className="flex flex-wrap items-end gap-3">
            <Select
              label="Demo scenario"
              value={screening.scenarioId}
              disabled={screening.status === 'running'}
              onChange={(event) => screening.selectScenario(event.target.value)}
              options={demoScreeningScenarios.map((scenario) => ({
                value: scenario.id,
                label: scenario.label,
              }))}
              wrapperClassName="w-full sm:w-auto"
            />
            <Button
              variant="secondary"
              size="small"
              disabled={screening.status === 'running'}
              onClick={screening.runDemo}
            >
              <Play aria-hidden="true" className="icon-sm" />
              Run Demo Screening
            </Button>
            <Button
              variant="ghost"
              size="small"
              disabled={screening.status === 'ready'}
              onClick={screening.resetDemo}
            >
              <RotateCcw aria-hidden="true" className="icon-sm" />
              Reset Demo
            </Button>
            {screening.status === 'completed' && (
              <Button onClick={onViewResult}>
                View Screening Result
                <ArrowRight aria-hidden="true" className="icon-sm" />
              </Button>
            )}
          </div>
          <p className="text-caption text-muted">
            {screening.scenario.description} Reset Demo stops the sequence and clears its events.
          </p>
        </div>
      </div>
    </Card>
  );
}
