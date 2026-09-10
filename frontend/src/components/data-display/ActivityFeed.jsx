import { Check, Circle, TriangleAlert, X } from 'lucide-react';

const appearances = {
  neutral: { icon: Circle, color: 'text-muted' },
  info: { icon: Circle, color: 'text-info' },
  success: { icon: Check, color: 'text-success' },
  warning: { icon: TriangleAlert, color: 'text-warning' },
  danger: { icon: X, color: 'text-danger' },
};

export default function ActivityFeed({
  items = [],
  label = 'Activity',
  emptyMessage = 'No activity yet.',
}) {
  if (!items.length) return <p className="text-body text-muted">{emptyMessage}</p>;
  return (
    <ol aria-label={label} className="divide-y divide-default">
      {items.map((item) => {
        const appearance = appearances[item.variant] || appearances.neutral;
        const Icon = appearance.icon;
        return (
          <li key={item.id} className="flex items-start gap-3 py-3">
            <Icon aria-hidden="true" className={'icon-sm mt-1 shrink-0 ' + appearance.color} />
            <div className="min-w-0">
              <time dateTime={item.time} className="text-caption tabular-nums text-muted">
                {item.time}
              </time>
              <p className="text-body font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-caption text-muted">{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
