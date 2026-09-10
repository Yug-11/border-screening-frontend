import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Breadcrumbs({ items = [], label = 'Breadcrumb' }) {
  if (!items.length) return null;
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 text-caption text-muted">
        {items.map((item, index) => (
          <li key={item.id || item.href || item.label} className="inline-flex items-center gap-2">
            {index > 0 && <ChevronRight aria-hidden="true" className="size-3" />}
            {item.href && index < items.length - 1 ? (
              <Link className="rounded-control hover:text-primary hover:underline" to={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
