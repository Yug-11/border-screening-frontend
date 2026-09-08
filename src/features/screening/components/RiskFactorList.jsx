import { useId } from 'react';
import Card from '../../../components/ui/Card';

export default function RiskFactorList({ factors, total }) {
  const titleId = useId();
  return (
    <Card aria-labelledby={titleId}>
      <h2 id={titleId} className="text-section font-semibold text-navy">
        Risk Factors
      </h2>
      <p className="mt-2 text-caption text-muted">
        Additive fictional values supplied by the demo data, not computed AI outputs.
      </p>
      <dl className="mt-3 divide-y divide-default">
        {factors.map((factor) => (
          <div
            key={factor.label}
            className="flex flex-wrap items-start justify-between gap-2 py-3 text-body"
          >
            <dt className="font-medium">{factor.label}</dt>
            <dd className="font-semibold tabular-nums">+{factor.points}</dd>
            <dd className="w-full text-caption text-muted">{factor.explanation}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2 flex justify-between gap-3 border-t border-default pt-3 text-body font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{total} / 100</span>
      </div>
    </Card>
  );
}
