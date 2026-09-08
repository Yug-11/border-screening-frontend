import { LockKeyhole } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function SecurityNetworkIndicator() {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-caption font-medium text-navy">
          <LockKeyhole aria-hidden="true" className="icon-sm text-muted" />
          Secure government network
        </span>
        <StatusBadge status="ONLINE">System operational</StatusBadge>
      </div>
      <p className="text-caption text-muted">
        Demo indicators only. Network security and service health are not verified.
      </p>
    </div>
  );
}
