import { useId, useState } from 'react';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import StatusBadge from '../../../components/ui/StatusBadge';

const tones = {
  MATCH: 'success',
  MISMATCH: 'danger',
  OPEN: 'warning',
  RESOLVED: 'success',
  CLEARED: 'success',
  Current: 'info',
  Expired: 'neutral',
  Cleared: 'success',
};
const statusCell = (value) => (
  <StatusBadge status={value} variant={tones[value]}>
    {value}
  </StatusBadge>
);
const dateCell = (value, row) => (
  <time dateTime={value} className="whitespace-nowrap tabular-nums">
    {row.dateLabel || value}
  </time>
);
const screeningColumns = [
  { key: 'dateTime', header: 'Date & Time', sortable: true, render: dateCell },
  { key: 'checkpoint', header: 'Checkpoint' },
  { key: 'documentType', header: 'Document Type' },
  { key: 'risk', header: 'Risk', sortable: true, render: statusCell },
  { key: 'result', header: 'Screening Result' },
  { key: 'face', header: 'Face Match', render: statusCell },
  { key: 'tampering', header: 'Tampering', render: statusCell },
  { key: 'officerAction', header: 'Officer Action' },
];
const documentColumns = [
  { key: 'type', header: 'Document Type' },
  { key: 'identifier', header: 'Identifier' },
  { key: 'issueDate', header: 'Issue Date', render: dateCell },
  { key: 'expiryDate', header: 'Expiry Date', render: dateCell },
  { key: 'status', header: 'Status', render: statusCell },
  { key: 'firstSeen', header: 'First Seen', render: dateCell },
  { key: 'lastSeen', header: 'Last Seen', render: dateCell },
];
const alertColumns = [
  { key: 'date', header: 'Date', render: dateCell },
  { key: 'type', header: 'Alert Type' },
  { key: 'severity', header: 'Severity', render: statusCell },
  { key: 'source', header: 'Source' },
  { key: 'status', header: 'Status', render: statusCell },
];
const decisionColumns = [
  { key: 'dateTime', header: 'Date & Time', render: dateCell },
  { key: 'checkpoint', header: 'Checkpoint' },
  { key: 'officer', header: 'Officer' },
  { key: 'decision', header: 'Decision', render: statusCell },
  { key: 'reason', header: 'Reason' },
  { key: 'status', header: 'Status', render: statusCell },
];
function HistoryTable({ title, description, columns, rows, sortable = false, sectionId }) {
  const titleId = useId();
  const [sort, setSort] = useState({ key: 'dateTime', direction: 'desc' });
  const riskOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  const data = sortable
    ? [...rows].sort((first, second) => {
        const comparison =
          sort.key === 'risk'
            ? riskOrder[first.risk] - riskOrder[second.risk]
            : first.dateTime.localeCompare(second.dateTime);
        return sort.direction === 'asc' ? comparison : -comparison;
      })
    : rows;
  return (
    <Card
      id={sectionId}
      tabIndex={sectionId ? -1 : undefined}
      aria-labelledby={titleId}
      padding={false}
      className="scroll-mt-4"
    >
      <div className="p-5">
        <h2 id={titleId} className="text-section font-semibold text-navy">
          {title}
        </h2>
        <p className="mt-2 text-caption text-muted">
          {description} Scroll horizontally on smaller screens.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        caption={title + ' records'}
        sort={sortable ? sort : undefined}
        onSort={
          sortable
            ? (key) =>
                setSort((previous) => ({
                  key,
                  direction: previous.key === key && previous.direction === 'desc' ? 'asc' : 'desc',
                }))
            : undefined
        }
      />
    </Card>
  );
}
export function ScreeningHistoryTable({ rows }) {
  return (
    <HistoryTable
      title="Screening History"
      description="Fictional screening snapshots. Pending is the original officer-action state; this visit's demo decision is shown separately above."
      columns={screeningColumns}
      rows={rows}
      sortable
      sectionId="screening-history"
    />
  );
}
export function DocumentHistoryTable({ rows }) {
  return (
    <HistoryTable
      title="Document History"
      description="Fictional document associations. Current denotes the presented document, not a validation or clearance decision."
      columns={documentColumns}
      rows={rows}
    />
  );
}
export function PassengerAlertHistory({ rows }) {
  return (
    <HistoryTable
      title="Alert History"
      description="Fictional alert snapshots. Local review actions do not resolve or save these records."
      columns={alertColumns}
      rows={rows}
    />
  );
}
export function OfficerDecisionHistory({ rows }) {
  return (
    <HistoryTable
      title="Officer Decisions"
      description="Previous fictional human decisions. Actions taken in this browser visit are not added to this historical record."
      columns={decisionColumns}
      rows={rows}
    />
  );
}
