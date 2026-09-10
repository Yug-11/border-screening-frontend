import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import {
  checkpointName,
  nextSort,
  officerName,
  sortRows,
} from '../../../features/surveillance/surveillanceHelpers';
import {
  DetailGrid,
  SurveillanceDemoNotice,
  SurveillanceRiskBadge,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

const eventTypes = ['Screening Completed', 'High Risk Referral', 'Document Warning', 'MRZ Failure', 'Face Verification Failure', 'Checkpoint Warning', 'Alert Created', 'Alert Resolved', 'Officer Activity', 'System Event'];

export default function SurveillanceHistoryPage() {
  const { checkpoints, officers, history } = useSurveillanceData();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'timestamp', direction: 'desc' });
  const [filters, setFilters] = useState({ date: 'Today', checkpoint: 'All', event: 'All', risk: 'All', status: 'All', officer: 'All', passengerId: '' });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const passengerTerm = filters.passengerId.trim().toLowerCase();
    const filtered = history.filter(
      (row) =>
        [row.timestamp, row.event, row.reference, row.status, row.action, checkpointName(checkpoints, row.checkpointId), officerName(officers, row.officerId)].some((value) => String(value).toLowerCase().includes(term)) &&
        (!passengerTerm || row.reference.toLowerCase().includes(passengerTerm)) &&
        (filters.checkpoint === 'All' || row.checkpointId === filters.checkpoint) &&
        (filters.event === 'All' || row.event === filters.event) &&
        (filters.risk === 'All' || row.risk === filters.risk) &&
        (filters.status === 'All' || row.status === filters.status) &&
        (filters.officer === 'All' || row.officerId === filters.officer),
    );
    return sortRows(filtered, sort);
  }, [checkpoints, filters, history, officers, search, sort]);

  return (
    <>
      <PageHeader title="History" description="Investigate previous screening, alert, officer, checkpoint, and system activity." />
      <SurveillanceDemoNotice />
      <Card title="History Filters">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          <SearchInput label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Event, reference, checkpoint" />
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Event Type" value={filters.event} onChange={(event) => setFilters({ ...filters, event: event.target.value })} options={['All', ...eventTypes].map((value) => ({ value, label: value }))} />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} />
          <Select label="Screening Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Open', 'Active', 'Resolved', 'Investigating', 'Acknowledged', 'Closed', 'In Progress'].map((value) => ({ value, label: value }))} />
          <Select label="Officer" value={filters.officer} onChange={(event) => setFilters({ ...filters, officer: event.target.value })} options={[{ value: 'All', label: 'All' }, ...officers.map((officer) => ({ value: officer.id, label: officer.name }))]} />
          <SearchInput label="Passenger ID" value={filters.passengerId} onChange={(event) => setFilters({ ...filters, passengerId: event.target.value })} placeholder="PAX-" />
        </div>
      </Card>
      <Card title="Operational History">
        <DataTable caption="Surveillance operational history" rowKey="id" sort={sort} onSort={(key) => setSort((current) => nextSort(current, key))} columns={[
          { key: 'timestamp', header: 'Timestamp', sortable: true },
          { key: 'checkpointId', header: 'Checkpoint', sortable: true, render: (value) => checkpointName(checkpoints, value) },
          { key: 'event', header: 'Event', sortable: true },
          { key: 'reference', header: 'Passenger/Reference' },
          { key: 'risk', header: 'Risk', sortable: true, render: (value) => <SurveillanceRiskBadge risk={value} /> },
          { key: 'officerId', header: 'Officer', render: (value) => officerName(officers, value) },
          { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
          { key: 'action', header: 'Action', render: (_, row) => <Button size="small" variant="outline" onClick={() => setSelected(row)}>{row.action}</Button> },
        ]} data={rows} emptyTitle="No history found" emptyDescription="Adjust filters to view previous activity." />
      </Card>
      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.event} description={selected?.id}>
        {selected && (
          <div className="space-y-4">
            <DetailGrid items={[
              { label: 'Timestamp', value: selected.timestamp },
              { label: 'Checkpoint', value: checkpointName(checkpoints, selected.checkpointId) },
              { label: 'Passenger / Reference', value: selected.reference },
              { label: 'Risk', value: <SurveillanceRiskBadge risk={selected.risk} /> },
              { label: 'Officer', value: officerName(officers, selected.officerId) },
              { label: 'Status', value: <SurveillanceStatusBadge status={selected.status} /> },
              { label: 'Detail', value: selected.detail },
            ]} />
            <Card title="Audit / Event Timeline">
              <ol className="space-y-2 text-body">
                <li>{selected.timestamp} · Event recorded</li>
                <li>{selected.officerId} · {selected.action}</li>
                <li>Current state · {selected.status}</li>
              </ol>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
