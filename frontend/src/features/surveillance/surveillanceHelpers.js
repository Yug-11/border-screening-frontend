export const surveillanceVariant = {
  Operational: 'success',
  Healthy: 'success',
  Cleared: 'success',
  Low: 'success',
  Warning: 'warning',
  Degraded: 'warning',
  Medium: 'warning',
  Critical: 'danger',
  High: 'danger',
  Failed: 'danger',
  Urgent: 'danger',
  Information: 'info',
  Info: 'info',
  Active: 'info',
  'In Progress': 'info',
  Queued: 'neutral',
  Offline: 'neutral',
  Unavailable: 'neutral',
  Inactive: 'neutral',
  Resolved: 'success',
  Acknowledged: 'info',
  Investigating: 'warning',
  New: 'danger',
  Busy: 'warning',
  Available: 'success',
  'Off Duty': 'neutral',
  Flagged: 'warning',
  Completed: 'success',
  Open: 'danger',
  Closed: 'success',
};

export function checkpointName(checkpoints, id) {
  return checkpoints.find((checkpoint) => checkpoint.id === id)?.name || 'Unassigned';
}

export function officerName(officers, id) {
  return officers.find((officer) => officer.id === id)?.name || 'Unassigned';
}

export function passengerById(passengers, id) {
  return passengers.find((passenger) => passenger.id === id);
}

export function sortRows(rows, sort, accessors = {}) {
  if (!sort?.key) return rows;
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => {
    const getValue = accessors[sort.key] || ((row) => row[sort.key]);
    const a = getValue(left);
    const b = getValue(right);
    if (typeof a === 'number' && typeof b === 'number') return (a - b) * multiplier;
    return String(a ?? '').localeCompare(String(b ?? '')) * multiplier;
  });
}

export function nextSort(current, key) {
  return current.key === key
    ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
    : { key, direction: 'asc' };
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
