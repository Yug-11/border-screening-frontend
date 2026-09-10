import { useId } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import Button from './Button';
import Checkbox from './Checkbox';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import cn from '../../utils/cn';

export default function DataTable({
  columns = [],
  data = [],
  rowKey = 'id',
  caption = 'Records',
  selectedKeys = [],
  onSelectionChange,
  loading = false,
  emptyTitle,
  emptyDescription,
  pagination,
  sort,
  onSort,
}) {
  const captionId = useId();
  const getKey = (row) => (typeof rowKey === 'function' ? rowKey(row) : row[rowKey]);
  const selectable = typeof onSelectionChange === 'function';
  const visibleKeys = data.map(getKey);
  const allSelected = data.length > 0 && visibleKeys.every((key) => selectedKeys.includes(key));
  const someSelected = visibleKeys.some((key) => selectedKeys.includes(key));
  function toggleAll(checked) {
    onSelectionChange(
      checked
        ? [...new Set([...selectedKeys, ...visibleKeys])]
        : selectedKeys.filter((key) => !visibleKeys.includes(key)),
    );
  }
  const alignment = { left: 'text-left', right: 'text-right', center: 'text-center' };
  return (
    <div className="min-w-0">
      <div role="region" aria-labelledby={captionId} tabIndex={0} className="overflow-x-auto">
        <table className="w-full border-collapse text-body" aria-busy={loading}>
          <caption id={captionId} className="sr-only">
            {caption}
          </caption>
          <thead className="border-y border-default bg-subtle text-caption font-semibold text-muted">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3">
                  <Checkbox
                    aria-label="Select all visible rows"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    disabled={!data.length || loading}
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    column.sortable && onSort
                      ? sort?.key === column.key
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className={cn(
                    'px-4 py-3 whitespace-nowrap',
                    alignment[column.align] || alignment.left,
                  )}
                >
                  {column.sortable && onSort ? (
                    <Button
                      variant="ghost"
                      size="small"
                      className="-ml-3"
                      onClick={() => onSort(column.key)}
                      aria-label={'Sort by ' + column.header}
                    >
                      {column.header}
                      {sort?.key !== column.key ? (
                        <ArrowUpDown aria-hidden="true" className="icon-sm" />
                      ) : sort.direction === 'asc' ? (
                        <ArrowUp aria-hidden="true" className="icon-sm" />
                      ) : (
                        <ArrowDown aria-hidden="true" className="icon-sm" />
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-surface">
            {loading ? (
              <tr>
                <td
                  colSpan={Math.max(1, columns.length + Number(selectable))}
                  className="p-8 text-center text-muted"
                >
                  <span role="status" className="inline-flex items-center gap-2">
                    <LoadingSpinner decorative />
                    Loading records&hellip;
                  </span>
                </td>
              </tr>
            ) : data.length ? (
              data.map((row) => {
                const key = getKey(row);
                const selected = selectedKeys.includes(key);
                return (
                  <tr
                    key={key}
                    className={cn('hover:bg-primary-soft', selected && 'bg-primary-soft')}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          aria-label={'Select row ' + key}
                          checked={selected}
                          onChange={(event) =>
                            onSelectionChange(
                              event.target.checked
                                ? [...new Set([...selectedKeys, key])]
                                : selectedKeys.filter((item) => item !== key),
                            )
                          }
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'px-4 py-3 align-middle',
                          alignment[column.align] || alignment.left,
                        )}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : (row[column.key] ?? '\u2014')}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={Math.max(1, columns.length + Number(selectable))}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="border-t border-default px-4 py-3">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
