import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import {
  checkpointName,
  officerName,
} from '../../../features/surveillance/surveillanceHelpers';
import {
  DetailGrid,
  KpiGrid,
  SurveillanceDemoNotice,
  SurveillanceSeverityBadge,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

const alertTypes = ['High-risk passenger', 'Document tampering', 'Face verification failure', 'MRZ failure', 'Identity mismatch', 'Checkpoint system warning', 'Network connectivity', 'Screening engine', 'Officer workload', 'System health'];

export default function SurveillanceAlertsPage() {
  const [params] = useSearchParams();
  const { checkpoints, officers, screenings, alerts, setAlerts } = useSurveillanceData();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    severity: 'All',
    status: 'All',
    checkpoint: params.get('checkpoint') || 'All',
    type: 'All',
    date: 'Today',
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter(
      (alert) =>
        [alert.title, alert.reference, alert.type, checkpointName(checkpoints, alert.checkpointId)].some((value) =>
          String(value).toLowerCase().includes(term),
        ) &&
        (filters.severity === 'All' || alert.severity === filters.severity) &&
        (filters.status === 'All' || alert.status === filters.status) &&
        (filters.checkpoint === 'All' || alert.checkpointId === filters.checkpoint) &&
        (filters.type === 'All' || alert.type === filters.type),
    );
  }, [alerts, checkpoints, filters, search]);

  function updateAlert(id, changes) {
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, ...changes, timeline: [...alert.timeline, `${changes.status || 'Updated'} ${stamp}`] } : alert,
      ),
    );
    setSelected((current) => (current?.id === id ? { ...current, ...changes, timeline: [...current.timeline, `${changes.status || 'Updated'} ${stamp}`] } : current));
  }

  const columns = [
    { key: 'severity', header: 'Severity', render: (value) => <SurveillanceSeverityBadge severity={value} /> },
    { key: 'title', header: 'Alert', render: (_, row) => <Button size="small" variant="ghost" onClick={() => setSelected(row)}>{row.title}</Button> },
    { key: 'checkpointId', header: 'Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'reference', header: 'Passenger/Reference' },
    { key: 'created', header: 'Created' },
    { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
    { key: 'assignedTo', header: 'Assigned To', render: (value) => officerName(officers, value) },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="outline" onClick={() => updateAlert(row.id, { status: 'Acknowledged' })}>Acknowledge</Button>
          <Button size="small" variant="outline" onClick={() => updateAlert(row.id, { status: 'Investigating' })}>Investigate</Button>
          <Button size="small" onClick={() => updateAlert(row.id, { status: 'Resolved' })}>Resolve</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Alerts" description="Operational alert center for surveillance review and escalation." />
      <SurveillanceDemoNotice />
      <KpiGrid>
        {['Critical', 'Warning', 'Information', 'Acknowledged', 'Investigating', 'Resolved'].map((item) => (
          <MetricCard key={item} label={item} value={alerts.filter((alert) => alert.severity === item || alert.status === item).length} tone={item === 'Critical' ? 'danger' : item === 'Warning' || item === 'Investigating' ? 'warning' : item === 'Resolved' ? 'success' : 'info'} />
        ))}
      </KpiGrid>
      <Card title="Alert Filters">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SearchInput label="Search alerts" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Alert, checkpoint, passenger, reference" />
          <Select label="Severity" value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })} options={['All', 'Critical', 'Warning', 'Information'].map((value) => ({ value, label: value }))} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'New', 'Acknowledged', 'Investigating', 'Resolved'].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Alert Type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} options={['All', ...alertTypes].map((value) => ({ value, label: value }))} />
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Alert Table">
        <DataTable caption="Surveillance alerts" rowKey="id" columns={columns} data={rows} emptyTitle="No alerts found" emptyDescription="Adjust alert filters." />
      </Card>
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected?.id}
        footer={selected && (
          <>
            <Select label="Assign" value={selected.assignedTo} onChange={(event) => updateAlert(selected.id, { assignedTo: event.target.value })} options={officers.map((officer) => ({ value: officer.id, label: officer.name }))} />
            <Button variant="outline" onClick={() => updateAlert(selected.id, { status: 'Acknowledged' })}>Acknowledge</Button>
            <Button variant="outline" onClick={() => updateAlert(selected.id, { status: 'Investigating' })}>Mark Investigating</Button>
            <Button onClick={() => updateAlert(selected.id, { status: 'Resolved' })}>Resolve</Button>
          </>
        )}
      >
        {selected && (
          <div className="space-y-4">
            <DetailGrid items={[
              { label: 'Severity', value: <SurveillanceSeverityBadge severity={selected.severity} /> },
              { label: 'Checkpoint', value: checkpointName(checkpoints, selected.checkpointId) },
              { label: 'Passenger / Reference', value: selected.reference },
              { label: 'Description', value: selected.description },
              { label: 'Detected Time', value: selected.created },
              { label: 'Current Status', value: <SurveillanceStatusBadge status={selected.status} /> },
              { label: 'Assigned Officer', value: officerName(officers, selected.assignedTo) },
              { label: 'Related Screening', value: selected.relatedScreeningId || 'Not linked' },
            ]} />
            <Card title="Event Timeline">
              <ol className="space-y-2 text-body">{selected.timeline.map((item) => <li key={item}>{item}</li>)}</ol>
            </Card>
            <Card title="Related Screening">
              <pre className="whitespace-pre-wrap rounded-control bg-canvas p-3 text-caption text-ink">
                {JSON.stringify(screenings.find((screening) => screening.id === selected.relatedScreeningId) || { note: 'No related screening for this alert.' }, null, 2)}
              </pre>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
