import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  label = 'Pagination',
}) {
  const safeSize = Math.max(1, pageSize);
  const count = Math.max(0, totalItems);
  const totalPages = Math.max(1, Math.ceil(count / safeSize));
  const current = Math.min(totalPages, Math.max(1, page));
  const pages = [...new Set([1, current - 1, current, current + 1, totalPages])]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((first, second) => first - second);
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-between gap-3 text-body">
      <p className="text-muted" aria-live="polite">
        {count ? (current - 1) * safeSize + 1 : 0}&ndash;{Math.min(current * safeSize, count)} of {count}{' '}
        items
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="ghost"
          size="small"
          aria-label="Previous page"
          disabled={current === 1 || !count}
          onClick={() => onPageChange?.(current - 1)}
        >
          <ChevronLeft aria-hidden="true" className="icon-sm" />
        </Button>
        {pages.map((item, index) => (
          <span key={item} className="inline-flex items-center gap-1">
            {index > 0 && item - pages[index - 1] > 1 && (
              <span aria-hidden="true" className="px-1 text-muted">
                &hellip;
              </span>
            )}
            <Button
              size="small"
              variant={item === current ? 'primary' : 'ghost'}
              aria-label={'Page ' + item}
              aria-current={item === current ? 'page' : undefined}
              disabled={!count}
              onClick={() => onPageChange?.(item)}
            >
              {item}
            </Button>
          </span>
        ))}
        <Button
          variant="ghost"
          size="small"
          aria-label="Next page"
          disabled={current === totalPages || !count}
          onClick={() => onPageChange?.(current + 1)}
        >
          <ChevronRight aria-hidden="true" className="icon-sm" />
        </Button>
      </div>
    </nav>
  );
}
