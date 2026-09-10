import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import { nextSort, sortRows } from '../../../features/surveillance/surveillanceHelpers';
import {
  KpiGrid,
  SurveillanceDemoNotice,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

export default function MyCheckpointsPage() {
  const navigate = useNavigate();
  const { checkpoints } = useSurveillanceData();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All', region: 'All', type: 'All' });
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [viewMode, setViewMode] = useState('table');

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = checkpoints.filter(
      (checkpoint) =>
        [checkpoint.name, checkpoint.region, checkpoint.type, checkpoint.id].some((value) =>
          value.toLowerCase().includes(term),
        ) &&
        (filters.status === 'All' || checkpoint.status === filters.status) &&
        (filters.region === 'All' || checkpoint.region === filters.region) &&
        (filters.type === 'All' || checkpoint.type === filters.type),
    );
    return sortRows(filtered, sort);
  }, [checkpoints, filters, search, sort]);

  const columns = [
    { key: 'name', header: 'Checkpoint', sortable: true, render: (_, row) => <Button size="small" variant="ghost" onClick={() => navigate(`/surveillance/checkpoints/${row.id}`)}>{row.name}</Button> },
    { key: 'region', header: 'Region', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (value) => <SurveillanceStatusBadge status={value} /> },
    { key: 'queue', header: 'Queue', sortable: true },
    { key: 'throughput', header: 'Throughput', sortable: true, render: (value) => `${value}/min` },
    { key: 'activeScreenings', header: 'Active Screening', sortable: true },
    { key: 'highRisk', header: 'High Risk', sortable: true },
    { key: 'officersOnDuty', header: 'Officers', sortable: true },
    { key: 'health', header: 'Health', sortable: true, render: (value) => `${value}%` },
    { key: 'lastActivity', header: 'Last Activity' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="outline" onClick={() => navigate(`/surveillance/checkpoints/${row.id}`)}>View</Button>
          <Button size="small" variant="outline" onClick={() => navigate('/surveillance/screening')}>Monitor</Button>
          <Button size="small" variant="outline" onClick={() => navigate(`/surveillance/alerts?checkpoint=${row.id}`)}>View Alerts</Button>
          <Button size="small" variant="outline" onClick={() => navigate('/surveillance/officers')}>View Officers</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="My Checkpoints"
        description="Detailed multi-checkpoint monitoring for the Surveillance Officer role."
        actions={
          <>
            <Button variant={viewMode === 'table' ? 'primary' : 'outline'} onClick={() => setViewMode('table')}>Table</Button>
            <Button variant={viewMode === 'grid' ? 'primary' : 'outline'} onClick={() => setViewMode('grid')}>Grid</Button>
          </>
        }
      />
      <SurveillanceDemoNotice />
      <KpiGrid>
        <MetricCard label="Assigned Checkpoints" value={checkpoints.length} />
        <MetricCard label="Operational" value={checkpoints.filter((item) => item.status === 'Operational').length} tone="success" />
        <MetricCard label="Warning" value={checkpoints.filter((item) => item.status === 'Warning').length} tone="warning" />
        <MetricCard label="Critical" value={checkpoints.filter((item) => item.status === 'Critical').length} tone="danger" />
        <MetricCard label="Offline" value={checkpoints.filter((item) => item.status === 'Offline').length} tone="neutral" />
        <MetricCard label="Active Screening" value={checkpoints.reduce((sum, item) => sum + item.activeScreenings, 0)} tone="info" />
      </KpiGrid>
      <Card title="Checkpoint Filters">
        <div className="grid gap-3 md:grid-cols-4">
          <SearchInput label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Checkpoint, ID, region, type" />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Operational', 'Warning', 'Critical', 'Offline'].map((value) => ({ value, label: value }))} />
          <Select label="Region" value={filters.region} onChange={(event) => setFilters({ ...filters, region: event.target.value })} options={['All', 'North', 'South', 'East', 'West', 'Central'].map((value) => ({ value, label: value }))} />
          <Select label="Type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} options={['All', 'Land Border', 'River Crossing', 'Airport', 'Seaport', 'Transit Point'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      {viewMode === 'table' ? (
        <Card title="Checkpoint Table">
          <DataTable
            caption="My checkpoints table"
            rowKey="id"
            columns={columns}
            data={rows}
            sort={sort}
            onSort={(key) => setSort((current) => nextSort(current, key))}
            emptyTitle="No checkpoints found"
            emptyDescription="Adjust filters to view checkpoints."
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rows.map((checkpoint) => (
            <Card key={checkpoint.id} title={checkpoint.name} description={`${checkpoint.region} · ${checkpoint.type}`}>
              <div className="space-y-3">
                <SurveillanceStatusBadge status={checkpoint.status} />
                <p className="text-body text-muted">{checkpoint.notes}</p>
                <div className="grid grid-cols-2 gap-2 text-caption">
                  <span>Queue: <strong>{checkpoint.queue}</strong></span>
                  <span>Throughput: <strong>{checkpoint.throughput}/min</strong></span>
                  <span>Screening: <strong>{checkpoint.activeScreenings}</strong></span>
                  <span>Health: <strong>{checkpoint.health}%</strong></span>
                </div>
                <Button size="small" onClick={() => navigate(`/surveillance/checkpoints/${checkpoint.id}`)}>View</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
