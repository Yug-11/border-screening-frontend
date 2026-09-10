import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records to display',
  description = 'Records will appear here when available.',
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex flex-col items-center px-5 py-10 text-center">
      <span className="mb-3 rounded-panel bg-subtle p-3 text-muted">
        <Icon aria-hidden="true" className="icon-lg" />
      </span>
      <h3 className="text-card font-semibold text-navy">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-body text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
