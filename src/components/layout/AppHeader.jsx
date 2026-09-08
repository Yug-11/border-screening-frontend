import { MapPin, Shield } from 'lucide-react';
import Badge from '../ui/Badge';
import NotificationMenu from './NotificationMenu';
import SystemStatus from './SystemStatus';
import UserMenu from './UserMenu';

export default function AppHeader({
  systemName,
  checkpoint,
  officer,
  notifications = [],
  alertsPath,
  demo = false,
  roleLabel,
  onSignOut,
}) {
  return (
    <header className="border-t-4 border-primary border-b border-b-default bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-4 sm:px-8">
        <div className="flex min-w-0 max-w-md items-center gap-3">
          <span className="rounded-control border border-default p-2 text-primary">
            <Shield aria-hidden="true" className="icon-lg" />
          </span>
          <div>
            <p className="text-body font-semibold leading-snug text-navy">{systemName}</p>
            <p className="mt-1 text-caption text-muted">
              <span className="xl:hidden">{checkpoint.name}</span>
              <span className="hidden xl:inline">Border operations workspace</span>
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 xl:flex">
          <MapPin aria-hidden="true" className="icon-sm text-muted" />
          <div>
            <p className="text-body font-medium text-navy">{checkpoint.name}</p>
            <p className="text-caption text-muted">Current checkpoint</p>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-default pt-3 sm:w-auto sm:justify-start sm:border-0 sm:pt-0">
          <div className="flex items-center gap-2">
            <SystemStatus status={checkpoint.status} label="System operational" />
            {demo && <Badge>Demo</Badge>}
          </div>
          <NotificationMenu
            notifications={notifications}
            destination={alertsPath}
            description={
              demo
                ? 'Fictional notices from a static snapshot. No live notification feed.'
                : undefined
            }
          />
          <UserMenu officer={officer} roleLabel={roleLabel || officer.employeeId} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}
