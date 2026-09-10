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
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import { checkpointName } from '../../../features/surveillance/surveillanceHelpers';
import {
  DetailGrid,
  KpiGrid,
  SurveillanceDemoNotice,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

export default function OfficerAccessManagementPage() {
  const navigate = useNavigate();
  const { checkpoints, officers } = useSurveillanceData();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ checkpoint: 'All', status: 'All', role: 'All', workload: 'All' });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return officers.filter(
      (officer) =>
        [officer.id, officer.name, officer.role, checkpointName(checkpoints, officer.checkpointId)].some((value) =>
          value.toLowerCase().includes(term),
        ) &&
        (filters.checkpoint === 'All' || officer.checkpointId === filters.checkpoint) &&
        (filters.status === 'All' || officer.status === filters.status) &&
        (filters.role === 'All' || officer.role === filters.role) &&
        (filters.workload === 'All' || (filters.workload === 'High' ? officer.workload >= 75 : filters.workload === 'Medium' ? officer.workload >= 40 && officer.workload < 75 : officer.workload < 40)),
    );
  }, [checkpoints, filters, officers, search]);

  return (
    <>
      <PageHeader title="Officers" description="Visibility into staffing and workload at assigned checkpoints." />
      <SurveillanceDemoNotice />
      <KpiGrid>
        <MetricCard label="Total Officers" value={officers.length} />
        <MetricCard label="On Duty" value={officers.filter((officer) => officer.status !== 'Off Duty').length} tone="success" />
        <MetricCard label="Available" value={officers.filter((officer) => officer.status === 'Available').length} tone="success" />
        <MetricCard label="Busy" value={officers.filter((officer) => officer.status === 'Busy').length} tone="warning" />
        <MetricCard label="Off Duty" value={officers.filter((officer) => officer.status === 'Off Duty').length} tone="neutral" />
        <MetricCard label="Staffing Issues" value={checkpoints.filter((checkpoint) => checkpoint.officersOnDuty < checkpoint.requiredOfficers).length} tone="warning" />
      </KpiGrid>
      <Card title="Officer Filters">
        <div className="grid gap-3 md:grid-cols-5">
          <SearchInput label="Search officers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ID, name, role, checkpoint" />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Busy', 'Available', 'Off Duty'].map((value) => ({ value, label: value }))} />
          <Select label="Role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} options={['All', 'Admin', 'Surveillance Officer', 'Duty Officer'].map((value) => ({ value, label: value }))} />
          <Select label="Workload" value={filters.workload} onChange={(event) => setFilters({ ...filters, workload: event.target.value })} options={['All', 'Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Officer Table">
        <DataTable caption="Surveillance officer visibility table" rowKey="id" columns={[
          { key: 'id', header: 'Officer ID' },
          { key: 'name', header: 'Name', render: (_, row) => <Button size="small" variant="ghost" onClick={() => setSelected(row)}>{row.name}</Button> },
          { key: 'role', header: 'Role' },
          { key: 'checkpointId', header: 'Assigned Checkpoint', render: (value) => checkpointName(checkpoints, value) },
          { key: 'shift', header: 'Shift' },
          { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
          { key: 'workload', header: 'Current Workload', render: (value) => `${value}%` },
          { key: 'lastActivity', header: 'Last Activity' },
          { key: 'actions', header: 'Actions', render: (_, row) => <div className="flex gap-2"><Button size="small" variant="outline" onClick={() => setSelected(row)}>View Activity</Button><Button size="small" variant="outline" onClick={() => navigate(`/surveillance/checkpoints/${row.checkpointId}`)}>View Checkpoint</Button></div> },
        ]} data={rows} emptyTitle="No officers found" emptyDescription="Adjust filters to view officers." />
      </Card>
      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name} description={selected?.id} footer={selected && <Button onClick={() => navigate(`/surveillance/checkpoints/${selected.checkpointId}`)}>View Checkpoint</Button>}>
        {selected && (
          <div className="space-y-4">
            <DetailGrid items={[
              { label: 'Officer Identity', value: selected.id },
              { label: 'Role', value: selected.role },
              { label: 'Checkpoint', value: checkpointName(checkpoints, selected.checkpointId) },
              { label: 'Shift', value: selected.shift },
              { label: 'Current Workload', value: `${selected.workload}%` },
              { label: 'Current Cases', value: selected.currentCases },
              { label: 'Status', value: <SurveillanceStatusBadge status={selected.status} /> },
              { label: 'Last Activity', value: selected.lastActivity },
            ]} />
            <Card title="Recent Activity">
              <ul className="space-y-2 text-body">{selected.recentActivity.map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
