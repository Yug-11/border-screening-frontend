import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { useDutyData } from '../../../features/duty/DutyDataContext';
import {
  DetailGrid,
  DutyDemoNotice,
  DutyRiskBadge,
  DutyStatusBadge,
  KpiGrid,
} from '../../../features/duty/dutyUi';

export default function DutyAlertsPage() {
  const navigate = useNavigate();
  const { alerts, setAlerts } = useDutyData();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    severity: 'All',
    status: 'All',
    type: 'All',
    risk: 'All',
    date: 'Today',
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter(
      (alert) =>
        [alert.passengerId || '', alert.id].some((value) => value.toLowerCase().includes(term)) &&
        (filters.severity === 'All' || alert.severity === filters.severity) &&
        (filters.status === 'All' || alert.status === filters.status) &&
        (filters.type === 'All' || alert.type === filters.type) &&
        (filters.risk === 'All' || alert.risk === filters.risk),
    );
  }, [alerts, filters, search]);

  function acknowledge(alertId) {
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: 'Acknowledged', timeline: [...alert.timeline, `${stamp} Acknowledged locally`] }
          : alert,
      ),
    );
    setSelected((current) =>
      current?.id === alertId
        ? { ...current, status: 'Acknowledged', timeline: [...current.timeline, `${stamp} Acknowledged locally`] }
        : current,
    );
  }

  const columns = [
    { key: 'severity', header: 'Severity', render: (value) => <DutyStatusBadge status={value} /> },
    { key: 'title', header: 'Alert', render: (_, row) => <Button size="small" variant="ghost" onClick={() => setSelected(row)}>{row.title}</Button> },
    { key: 'passengerId', header: 'Passenger', render: (value) => value || 'Checkpoint' },
    { key: 'time', header: 'Time' },
    { key: 'screeningId', header: 'Screening' },
    { key: 'status', header: 'Status', render: (value) => <DutyStatusBadge status={value} /> },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="outline" onClick={() => setSelected(row)}>Inspect</Button>
          {row.status !== 'Acknowledged' && row.status !== 'Resolved' && (
            <Button size="small" onClick={() => acknowledge(row.id)}>Acknowledge</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Alerts"
        eyebrow="Duty / Border Officer"
        description="Review alerts requiring checkpoint attention"
      />
      <DutyDemoNotice />
      <KpiGrid>
        <MetricCard label="Critical" value={alerts.filter((alert) => alert.severity === 'CRITICAL').length} tone="danger" />
        <MetricCard label="High" value={alerts.filter((alert) => alert.severity === 'HIGH').length} tone="danger" />
        <MetricCard label="Medium" value={alerts.filter((alert) => alert.severity === 'MEDIUM').length} tone="warning" />
        <MetricCard label="Information" value={alerts.filter((alert) => alert.severity === 'INFO').length} tone="info" />
        <MetricCard label="Unresolved" value={alerts.filter((alert) => alert.status !== 'Resolved').length} tone="warning" />
      </KpiGrid>
      <Card title="Alert Search and Filters">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SearchInput label="Search alerts" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Passenger ID or Alert ID" />
          <Select label="Severity" value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })} options={['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map((value) => ({ value, label: value }))} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Open', 'Acknowledged', 'Resolved'].map((value) => ({ value, label: value }))} />
          <Select label="Alert Type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} options={['All', 'High-risk passenger', 'Document tampering suspected', 'MRZ validation failure', 'Face verification failure', 'Identity mismatch', 'Screening failure', 'Checkpoint system warning'].map((value) => ({ value, label: value }))} />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'LOW', 'MEDIUM', 'HIGH', 'PENDING'].map((value) => ({ value, label: value }))} />
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Checkpoint Alerts">
        <DataTable
          caption="Duty officer alerts"
          rowKey="id"
          columns={columns}
          data={rows}
          emptyTitle="No alerts found"
          emptyDescription="Adjust search or filters to view checkpoint alerts."
        />
      </Card>
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected?.id}
        footer={
          selected && (
            <>
              {selected.status !== 'Acknowledged' && selected.status !== 'Resolved' && (
                <Button variant="outline" onClick={() => acknowledge(selected.id)}>Acknowledge</Button>
              )}
              {selected.passengerId === 'PAX-DEMO-1029' && (
                <Button onClick={() => navigate(`/duty-officer/passengers/${selected.passengerId}`)}>Review Passenger</Button>
              )}
              <Button variant="outline" onClick={() => navigate('/duty-officer/screening')}>View Screening</Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <DetailGrid
              items={[
                { label: 'Alert ID', value: selected.id },
                { label: 'Severity', value: <DutyStatusBadge status={selected.severity} /> },
                { label: 'Alert Type', value: selected.type },
                { label: 'Passenger ID', value: selected.passengerId || 'Checkpoint-level notice' },
                { label: 'Checkpoint', value: selected.checkpoint },
                { label: 'Created Time', value: selected.time },
                { label: 'Related Screening', value: selected.screeningId },
                { label: 'Current Status', value: <DutyStatusBadge status={selected.status} /> },
                { label: 'Risk', value: <DutyRiskBadge risk={selected.risk} /> },
                { label: 'Description', value: selected.description },
              ]}
            />
            <Card title="Event Timeline">
              <ol className="space-y-2 text-body">{selected.timeline.map((item) => <li key={item}>{item}</li>)}</ol>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
