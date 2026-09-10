import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import DataTable from '../../../components/ui/DataTable';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import {
  checkpointStatuses,
  checkpointTypes,
  regions,
} from '../../../data/mockAdminData';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { nextSort, sortRows } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  DemoStatusBadge,
  KpiGrid,
  RouteLink,
} from '../../../features/admin/adminUtils';

const blankForm = {
  name: '',
  code: '',
  region: 'North',
  type: 'Land Border',
  area: '',
  operatingHours: '',
  status: 'Operational',
  queueCapacity: 100,
  notes: '',
};

export default function CheckpointsPage() {
  const navigate = useNavigate();
  const { checkpoints, setCheckpoints } = useAdminData();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All', type: 'All', region: 'All' });
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = checkpoints.filter((checkpoint) => {
      const matchesSearch = [checkpoint.name, checkpoint.code, checkpoint.region].some((value) =>
        value.toLowerCase().includes(term),
      );
      return (
        matchesSearch &&
        (filters.status === 'All' || checkpoint.status === filters.status) &&
        (filters.type === 'All' || checkpoint.type === filters.type) &&
        (filters.region === 'All' || checkpoint.region === filters.region)
      );
    });
    return sortRows(rows, sort, {
      passengers: (row) => row.passengersToday,
      queue: (row) => row.currentQueue,
      systemHealth: (row) => row.systemHealth,
    });
  }, [checkpoints, filters, search, sort]);

  const kpis = [
    { label: 'Total Checkpoints', value: 24 },
    { label: 'Operational', value: 19, tone: 'success' },
    { label: 'Warning', value: 3, tone: 'warning' },
    { label: 'Critical', value: 1, tone: 'danger' },
    { label: 'Offline', value: 1, tone: 'neutral' },
  ];

  const columns = [
    { key: 'name', header: 'Checkpoint', sortable: true, render: (_, row) => <RouteLink to={`/admin/checkpoints/${row.id}`}>{row.name}</RouteLink> },
    { key: 'code', header: 'Code' },
    { key: 'region', header: 'Region' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status', sortable: true, render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'passengersToday', header: 'Passengers Today', sortable: true, render: (value) => value.toLocaleString('en-US') },
    { key: 'currentQueue', header: 'Current Queue', sortable: true },
    { key: 'officersOnDuty', header: 'Officers' },
    { key: 'systemHealth', header: 'System Health', sortable: true, render: (value) => `${value}%` },
    { key: 'lastActivity', header: 'Last Activity' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="outline" onClick={() => navigate(`/admin/checkpoints/${row.id}`)}>View Details</Button>
          <Button size="small" variant="outline" onClick={() => openEdit(row)}>Edit</Button>
          <Button size="small" variant="outline" onClick={() => navigate('/admin/officers')}>Manage Officers</Button>
          <Button size="small" variant="outline" onClick={() => navigate(`/admin/alerts?checkpoint=${row.id}`)}>View Alerts</Button>
          <Button size="small" variant="danger" onClick={() => setDeactivateTarget(row)}>Deactivate</Button>
        </div>
      ),
    },
  ];

  function openAdd() {
    setEditing(null);
    setForm(blankForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(checkpoint) {
    setEditing(checkpoint);
    setForm({
      name: checkpoint.name,
      code: checkpoint.code,
      region: checkpoint.region,
      type: checkpoint.type,
      area: checkpoint.area,
      operatingHours: checkpoint.operatingHours,
      status: checkpoint.status,
      queueCapacity: checkpoint.queueCapacity,
      notes: checkpoint.notes,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const nextErrors = {};
    ['name', 'code', 'area', 'operatingHours'].forEach((field) => {
      if (!String(form[field]).trim()) nextErrors[field] = 'Required';
    });
    if (!Number(form.queueCapacity) || Number(form.queueCapacity) < 1) {
      nextErrors.queueCapacity = 'Enter a positive capacity';
    }
    setErrors(nextErrors);
    return !Object.keys(nextErrors).length;
  }

  function saveCheckpoint(event) {
    event.preventDefault();
    if (!validate()) return;
    if (editing) {
      setCheckpoints((current) =>
        current.map((checkpoint) =>
          checkpoint.id === editing.id
            ? { ...checkpoint, ...form, queueCapacity: Number(form.queueCapacity), lastActivity: 'Just now' }
            : checkpoint,
        ),
      );
    } else {
      const id = form.code.trim().toUpperCase();
      setCheckpoints((current) => [
        ...current,
        {
          ...blankForm,
          ...form,
          id,
          code: id,
          queueCapacity: Number(form.queueCapacity),
          passengersToday: 0,
          passengersPerMin: 0,
          currentQueue: 0,
          officersOnDuty: 0,
          highRisk: 0,
          mediumRisk: 0,
          systemHealth: form.status === 'Offline' ? 0 : 100,
          lastActivity: 'Just now',
          lastSystemEvent: 'Checkpoint created in local demo state',
          screeningStatus: form.status,
          requiredOfficers: 4,
          map: { x: 50, y: 50 },
        },
      ]);
    }
    setModalOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Checkpoint Management"
        description="Manage fictional national checkpoint operations and local demo status."
        actions={<Button onClick={openAdd}><Plus aria-hidden="true" className="icon-sm" />Add Checkpoint</Button>}
      />
      <DemoNotice />
      <KpiGrid>
        {kpis.map((kpi) => <MetricCard key={kpi.label} {...kpi} />)}
      </KpiGrid>
      <Card title="Checkpoint Directory" description="Search, filter, sort, edit, or deactivate checkpoints.">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <SearchInput label="Search checkpoints" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, code, or region" />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', ...checkpointStatuses].map((value) => ({ value, label: value }))} />
          <Select label="Type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} options={['All', ...checkpointTypes].map((value) => ({ value, label: value }))} />
          <Select label="Region" value={filters.region} onChange={(event) => setFilters({ ...filters, region: event.target.value })} options={['All', ...regions].map((value) => ({ value, label: value }))} />
        </div>
        <DataTable
          caption="Checkpoint management table"
          rowKey="id"
          columns={columns}
          data={filtered}
          sort={sort}
          onSort={(key) => setSort((current) => nextSort(current, key))}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Checkpoint' : 'Add Checkpoint'}
        description="Required fields are validated locally for this frontend demo."
        size="large"
      >
        <form className="space-y-4" onSubmit={saveCheckpoint}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Checkpoint Name" required value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Checkpoint Code" required value={form.code} error={errors.code} onChange={(event) => setForm({ ...form, code: event.target.value })} disabled={Boolean(editing)} />
            <Select label="Region" required value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} options={regions.map((value) => ({ value, label: value }))} />
            <Select label="Type" required value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} options={checkpointTypes.map((value) => ({ value, label: value }))} />
            <Input label="Area" required value={form.area} error={errors.area} onChange={(event) => setForm({ ...form, area: event.target.value })} />
            <Input label="Operating Hours" required value={form.operatingHours} error={errors.operatingHours} onChange={(event) => setForm({ ...form, operatingHours: event.target.value })} />
            <Select label="Status" required value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} options={checkpointStatuses.map((value) => ({ value, label: value }))} />
            <Input label="Maximum Queue Capacity" required type="number" min="1" value={form.queueCapacity} error={errors.queueCapacity} onChange={(event) => setForm({ ...form, queueCapacity: event.target.value })} />
          </div>
          <Input label="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Checkpoint</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => {
          setCheckpoints((current) =>
            current.map((checkpoint) =>
              checkpoint.id === deactivateTarget.id
                ? { ...checkpoint, status: 'Offline', screeningStatus: 'Offline', systemHealth: 0, lastActivity: 'Just now' }
                : checkpoint,
            ),
          );
          setDeactivateTarget(null);
        }}
        title="Deactivate Checkpoint"
        description="This does not delete data. It marks the checkpoint offline in local demo state."
        confirmLabel="Deactivate Checkpoint"
      >
        {deactivateTarget?.name} will be marked Offline.
      </ConfirmDialog>
    </>
  );
}
