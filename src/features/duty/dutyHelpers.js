export const dutyVariant = {
  LOW: 'success',
  Cleared: 'success',
  PASSED: 'success',
  MATCH: 'success',
  Completed: 'success',
  Resolved: 'success',
  MEDIUM: 'warning',
  WARNING: 'warning',
  'Review Required': 'warning',
  Referred: 'warning',
  Acknowledged: 'info',
  HIGH: 'danger',
  FAILED: 'danger',
  MISMATCH: 'danger',
  Open: 'danger',
  INFO: 'info',
  'IN PROGRESS': 'info',
  'In Progress': 'info',
  PENDING: 'neutral',
  Pending: 'neutral',
  'NOT APPLICABLE': 'neutral',
};

export function nextSort(current, key) {
  return current.key === key
    ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
    : { key, direction: 'asc' };
}

export function sortRows(rows, sort) {
  if (!sort?.key) return rows;
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) =>
    String(left[sort.key] ?? '').localeCompare(String(right[sort.key] ?? '')) * multiplier,
  );
}

export function toCsv(rows, columns) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [columns.map((column) => escape(column.header)).join(',')]
    .concat(rows.map((row) => columns.map((column) => escape(column.value(row))).join(',')))
    .join('\n');
}

export function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
