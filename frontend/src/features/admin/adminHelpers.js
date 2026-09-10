export const riskVariant = {
  Low: 'success',
  Cleared: 'success',
  Medium: 'warning',
  Warning: 'warning',
  High: 'danger',
  Critical: 'danger',
  Information: 'info',
  Offline: 'neutral',
  Info: 'info',
  Degraded: 'warning',
};

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

export function checkpointName(checkpoints, id) {
  return checkpoints.find((checkpoint) => checkpoint.id === id)?.name || 'Unassigned';
}

export function officerName(officers, id) {
  return officers.find((officer) => officer.id === id)?.name || 'Unassigned';
}

export function passengerName(passengers, id) {
  return passengers.find((passenger) => passenger.id === id)?.displayName || 'Not linked';
}
