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
import { alertSeverities, alertStatuses, alertTypes } from '../../../data/mockAdminData';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { checkpointName, officerName, passengerName } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  DemoStatusBadge,
  DetailGrid,
  KpiGrid,
  SeverityBadge,
} from '../../../features/admin/adminUtils';

export default function AdminAlertsPage() {
  const [params] = useSearchParams();
  const { checkpoints, officers, passengers, alerts, setAlerts } = useAdminData();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    severity: 'All',
    status: 'All',
    checkpoint: params.get('checkpoint') || 'All',
    date: 'Today',
    type: 'All',
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter((alert) => {
      const checkpoint = checkpointName(checkpoints, alert.checkpointId);
      const passenger = passengerName(passengers, alert.passengerId);
      return (
        [alert.title, alert.description, checkpoint, passenger, alert.type].some((value) =>
          String(value).toLowerCase().includes(term),
        ) &&
        (filters.severity === 'All' || alert.severity === filters.severity) &&
        (filters.status === 'All' || alert.status === filters.status) &&
        (filters.checkpoint === 'All' || alert.checkpointId === filters.checkpoint) &&
        (filters.type === 'All' || alert.type === filters.type)
      );
    });
  }, [alerts, checkpoints, filters, passengers, search]);

  const columns = [
    { key: 'severity', header: 'Severity', render: (value) => <SeverityBadge severity={value} /> },
    { key: 'title', header: 'Alert', render: (_, row) => <Button variant="ghost" size="small" onClick={() => setSelectedAlert(row)}>{row.title}</Button> },
    { key: 'checkpointId', header: 'Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'passengerId', header: 'Related Passenger', render: (value) => passengerName(passengers, value) },
    { key: 'created', header: 'Created' },
    { key: 'status', header: 'Status', render: (value) => <DemoStatusBadge status={value} /> },
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

  function updateAlert(id, changes) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              ...changes,
              timeline: [...alert.timeline, `${changes.status || 'Updated'} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`],
            }
          : alert,
      ),
    );
    setSelectedAlert((current) => (current?.id === id ? { ...current, ...changes, timeline: [...current.timeline, `${changes.status || 'Updated'} just now`] } : current));
  }

  return (
    <>
      <PageHeader title="Alert Center" description="Manage fictional operational alerts and local alert state." />
      <DemoNotice />
      <KpiGrid>
        <MetricCard label="Critical" value={alerts.filter((alert) => alert.severity === 'Critical').length} tone="danger" />
        <MetricCard label="Warning" value={alerts.filter((alert) => alert.severity === 'Warning').length} tone="warning" />
        <MetricCard label="Information" value={alerts.filter((alert) => alert.severity === 'Information').length} tone="info" />
        <MetricCard label="Resolved" value={alerts.filter((alert) => alert.status === 'Resolved').length} tone="success" />
      </KpiGrid>
      <Card title="Alert Filters">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SearchInput label="Search alerts" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Alert, checkpoint, passenger, type" />
          <Select label="Severity" value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })} options={['All', ...alertSeverities].map((value) => ({ value, label: value }))} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', ...alertStatuses].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
          <Select label="Alert Type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} options={['All', ...alertTypes].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Alert Table">
        <DataTable caption="Alert management table" rowKey="id" columns={columns} data={filtered} />
      </Card>
      <Drawer
        open={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title}
        description={selectedAlert?.id}
        footer={
          selectedAlert && (
            <>
              <Select
                label="Assign"
                value={selectedAlert.assignedTo}
                onChange={(event) => updateAlert(selectedAlert.id, { assignedTo: event.target.value })}
                options={officers.map((officer) => ({ value: officer.id, label: officer.name }))}
              />
              <Button variant="outline" onClick={() => updateAlert(selectedAlert.id, { status: 'Acknowledged' })}>Acknowledge</Button>
              <Button variant="outline" onClick={() => updateAlert(selectedAlert.id, { status: 'Investigating' })}>Mark Investigating</Button>
              <Button onClick={() => updateAlert(selectedAlert.id, { status: 'Resolved' })}>Resolve</Button>
            </>
          )
        }
      >
        {selectedAlert && (
          <div className="space-y-4">
            <DetailGrid
              items={[
                { label: 'Severity', value: <SeverityBadge severity={selectedAlert.severity} /> },
                { label: 'Description', value: selectedAlert.description },
                { label: 'Checkpoint', value: checkpointName(checkpoints, selectedAlert.checkpointId) },
                { label: 'Passenger', value: passengerName(passengers, selectedAlert.passengerId) },
                { label: 'Created', value: selectedAlert.created },
                { label: 'Status', value: <DemoStatusBadge status={selectedAlert.status} /> },
                { label: 'Assigned Officer', value: officerName(officers, selectedAlert.assignedTo) },
              ]}
            />
            <Card title="Related Screening Evidence">
              <ul className="space-y-2 text-body">{selectedAlert.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
            <Card title="Activity Timeline">
              <ol className="space-y-2 text-body">
                {['Created', 'Acknowledged', 'Assigned', 'Investigating', 'Resolved'].map((step) => (
                  <li key={step} className="flex items-center justify-between gap-3 rounded-control border border-default bg-canvas p-2">
                    <span>{step}</span>
                    <DemoStatusBadge status={selectedAlert.timeline.some((item) => item.includes(step)) || selectedAlert.status === step ? 'Operational' : 'Pending'} />
                  </li>
                ))}
              </ol>
              <ul className="mt-4 space-y-1 text-caption text-muted">
                {selectedAlert.timeline.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
