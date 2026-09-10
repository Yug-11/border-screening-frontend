import Card from '../../../components/ui/Card';
import StepIndicator from '../../../components/ui/StepIndicator';

export default function ScreeningPipeline({ steps, processedCount }) {
  return (
    <Card aria-labelledby="screening-pipeline-title">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="screening-pipeline-title" className="text-section font-semibold text-navy">
            Screening Pipeline
          </h2>
          <p className="mt-1 text-caption text-muted">
            Automated stages &middot; no manual verification controls
          </p>
        </div>
        <span className="text-caption tabular-nums text-muted">
          {processedCount} of {steps.length} stages processed
        </span>
      </div>
      <StepIndicator steps={steps} label="Automated screening stages" orientation="vertical" />
    </Card>
  );
}
