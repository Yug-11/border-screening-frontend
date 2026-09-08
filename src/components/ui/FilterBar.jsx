import { ListFilter } from 'lucide-react';
import Button from './Button';

export default function FilterBar({ children, onReset, actions, label = 'Filters' }) {
  return (
    <section
      aria-label={label}
      className="flex flex-wrap items-end gap-4 border-b border-default bg-surface p-4"
    >
      <span className="mb-2 inline-flex items-center gap-2 text-body font-semibold text-muted">
        <ListFilter aria-hidden="true" className="icon-sm" />
        {label}
      </span>
      {children}
      <div className="flex items-center gap-2 sm:ml-auto">
        {onReset && (
          <Button variant="ghost" size="small" onClick={onReset}>
            Reset filters
          </Button>
        )}
        {actions}
      </div>
    </section>
  );
}
