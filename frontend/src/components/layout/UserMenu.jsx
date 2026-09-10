import { LogOut, UserRound } from 'lucide-react';
import Button from '../ui/Button';

export default function UserMenu({ officer, roleLabel, onSignOut }) {
  return (
    <div className="flex items-center gap-3 border-l border-default pl-3">
      <UserRound aria-hidden="true" className="icon-md text-muted" />
      <div className="min-w-0">
        <p className="truncate text-body font-semibold text-navy">{officer.name}</p>
        <p className="text-caption text-muted">{roleLabel || officer.employeeId}</p>
      </div>
      <Button variant="outline" size="small" onClick={onSignOut} aria-label={`Sign out ${officer.name}`}>
        <LogOut aria-hidden="true" className="icon-sm" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  );
}
