import { UserRound } from 'lucide-react';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function FaceVerificationCard({ face }) {
  return (
    <Card aria-labelledby="face-verification-title">
      <h2 id="face-verification-title" className="mb-4 text-section font-semibold text-navy">
        Face Verification
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {['Passport Photo', 'Live Capture'].map((label) => (
          <figure key={label}>
            <div
              role="img"
              aria-label={label + ' placeholder; no real person is depicted'}
              className="flex min-h-32 items-center justify-center rounded-control border border-default bg-canvas"
            >
              <UserRound aria-hidden="true" className="size-10 text-muted" />
            </div>
            <figcaption className="mt-2 text-center text-body font-medium">
              {label}
              <span className="block text-caption font-normal text-muted">Demo placeholder</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <dl className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-default pt-4">
        <div>
          <dt className="text-caption text-muted">Similarity</dt>
          <dd className="text-section font-semibold tabular-nums text-navy">
            {face.similarity.toFixed(1)}%
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-caption text-muted">Status</dt>
          <dd>
            <StatusBadge status={face.status} variant={face.variant}>
              {face.status}
            </StatusBadge>
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-caption text-muted">
        Similarity and status are fictional values. No real faces, live camera images or biometric
        verification are used.
      </p>
    </Card>
  );
}
