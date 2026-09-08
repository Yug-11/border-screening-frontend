import Card from '../../../components/ui/Card';
import RiskScorePanel from '../../../components/data-display/RiskScorePanel';

export default function ResultRiskAssessment({ result }) {
  return (
    <Card aria-labelledby="result-risk-title">
      <h2 id="result-risk-title" className="mb-4 text-section font-semibold text-navy">
        Risk Assessment
      </h2>
      <RiskScorePanel score={result.score} level={result.level} />
      <div className="mt-4 border-t border-default pt-4">
        <h3 className="text-card font-semibold text-navy">Why this result?</h3>
        <p className="mt-2 text-body">{result.explanation}</p>
      </div>
      <p className="mt-3 text-caption text-muted">
        Fictional assessment. A future production risk engine will supply verified result data; this
        frontend does not calculate risk.
      </p>
    </Card>
  );
}
