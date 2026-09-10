import { FileCheck2, ShieldCheck } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

function CheckpointIllustration() {
  return (
    <figure className="mx-auto hidden w-full max-w-sm md:block">
      <div
        aria-hidden="true"
        className="relative aspect-[2/1] w-full overflow-hidden border-b border-default"
      >
        <div className="absolute inset-x-0 bottom-0 h-2/5 border-t border-default bg-subtle" />
        <div className="absolute inset-x-[18%] bottom-0 h-2/5 border-x border-default bg-surface" />
        <div className="absolute bottom-0 left-1/2 h-2/5 border-l-2 border-dashed border-default" />
        <div className="absolute inset-x-[12%] top-[22%] h-5 border border-control border-b-primary bg-surface" />
        <div className="absolute top-[22%] bottom-[40%] left-[16%] w-2 border-x border-control bg-subtle" />
        <div className="absolute top-[22%] right-[16%] bottom-[40%] w-2 border-x border-control bg-subtle" />
        <div className="absolute bottom-[40%] left-[23%] h-[27%] w-[19%] rounded-t-control border border-control bg-surface p-2">
          <div className="h-3/5 border border-default bg-primary-soft" />
          <div className="mt-2 h-px w-1/3 bg-control" />
        </div>
        <div className="absolute right-[23%] bottom-[40%] h-[27%] w-[19%] rounded-t-control border border-control bg-surface p-2">
          <div className="h-3/5 border border-default bg-primary-soft" />
          <div className="mt-2 h-px w-1/3 bg-control" />
        </div>
        <div className="absolute bottom-[32%] left-[22%] h-1 w-[23%] bg-control" />
        <div className="absolute right-[22%] bottom-[32%] h-1 w-[23%] bg-control" />
        <div className="absolute bottom-[23%] left-[22%] h-[11%] w-1 bg-control" />
        <div className="absolute right-[22%] bottom-[23%] h-[11%] w-1 bg-control" />
      </div>
      <figcaption className="mt-3 flex justify-between gap-3 text-caption text-muted">
        <span>Border checkpoint illustration</span>
        <span>Not a live site</span>
      </figcaption>
    </figure>
  );
}

export default function InstitutionalPanel() {
  return (
    <div className="mx-auto flex h-full max-w-md flex-col gap-4 md:gap-8">
      <div className="flex items-center gap-3">
        <img
          src="/government-emblem-placeholder.svg"
          alt="Fictional institutional emblem"
          width="48"
          height="48"
          className="size-10 shrink-0 md:size-12"
        />
        <div>
          <p className="text-caption font-semibold tracking-wider text-navy uppercase">
            Border operations platform
          </p>
          <p className="mt-1 text-caption text-muted">Fictional institutional identity</p>
        </div>
      </div>

      <div className="space-y-3 md:mt-auto md:space-y-4">
        <div className="hidden md:block">
          <Badge variant="info">Demonstration environment</Badge>
        </div>
        <h1 className="max-w-sm text-section font-semibold text-navy sm:text-page">
          National Border Identity &amp; Document Screening System
        </h1>
        <p className="max-w-sm text-body text-muted">
          AI-assisted identity verification and document screening for secure border operations.
        </p>
      </div>

      <CheckpointIllustration />

      <div className="hidden items-start gap-3 md:flex">
        <FileCheck2 aria-hidden="true" className="icon-md mt-0.5 text-primary" />
        <div>
          <p className="text-body font-semibold text-navy">Identity and document screening</p>
          <p className="mt-1 text-body text-muted">
            A shared workspace for authorized border personnel.
          </p>
        </div>
      </div>

      <div className="hidden items-start gap-3 border-t border-default pt-5 md:mt-auto md:flex">
        <ShieldCheck aria-hidden="true" className="icon-md mt-0.5 text-muted" />
        <div>
          <p className="text-body font-semibold text-navy">Authorized personnel only.</p>
          <p className="mt-1 text-caption text-muted">
            Access is restricted to authorized border security personnel.
          </p>
        </div>
      </div>
    </div>
  );
}
