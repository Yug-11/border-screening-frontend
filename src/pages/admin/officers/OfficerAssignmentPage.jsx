import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { checkpointName } from '../../../features/admin/adminHelpers';
import { DemoNotice, DemoStatusBadge, DetailGrid, KpiGrid } from '../../../features/admin/adminUtils';

const roles = ['Admin', 'Surveillance Officer', 'Duty Officer'];
const statuses = ['On Duty', 'Available', 'Reviewing', 'Off Duty', 'Inactive'];

export default function OfficerAssignmentPage() {
  const { checkpoints, officers, setOfficers } = useAdminData();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: 'All', checkpoint: 'All', status: 'All' });
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignment, setAssignment] = useState({
    officerId: '',
    checkpointId: '',
    assignmentType: 'Primary',
    startTime: '10:00',
    endTime: '18:00',
    notes: '',
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return officers.filter((officer) => {
      const checkpoint = checkpointName(checkpoints, officer.assignedCheckpointId);
      return (
        [officer.name, officer.officerId, checkpoint].some((value) =>
          value.toLowerCase().includes(term),
        ) &&
        (filters.role === 'All' || officer.role === filters.role) &&
        (filters.checkpoint === 'All' || officer.assignedCheckpointId === filters.checkpoint) &&
        (filters.status === 'All' || officer.status === filters.status)
      );
    });
  }, [checkpoints, filters, officers, search]);

  const kpis = [
    { label: 'Total Officers', value: 86 },
    { label: 'On Duty', value: 86, tone: 'success' },
    { label: 'Available', value: 58, tone: 'success' },
    { label: 'Reviewing Cases', value: 14, tone: 'info' },
    { label: 'Pending Reviews', value: 14, tone: 'warning' },
    { label: 'Inactive', value: officers.filter((officer) => officer.status === 'Inactive').length, tone: 'neutral' },
  ];

  const columns = [
    { key: 'name', header: 'Officer', render: (_, row) => <Button variant="ghost" size="small" onClick={() => setSelectedOfficer(row)}>{row.name}</Button> },
    { key: 'officerId', header: 'Officer ID' },
    { key: 'role', header: 'Role' },
    { key: 'assignedCheckpointId', header: 'Assigned Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'status', header: 'Status', render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'currentCase', header: 'Current Case' },
    { key: 'casesToday', header: 'Cases Today' },
    { key: 'pendingReviews', header: 'Pending Reviews' },
    { key: 'lastActive', header: 'Last Active' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="outline" onClick={() => setSelectedOfficer(row)}>Details</Button>
          <Button size="small" variant="outline" onClick={() => openAssignment(row)}>Assign</Button>
          <Button size="small" variant="danger" onClick={() => deactivate(row.id)}>Deactivate</Button>
        </div>
      ),
    },
  ];

  const staffingRows = checkpoints.map((checkpoint) => {
    const assigned = officers.filter((officer) => officer.assignedCheckpointId === checkpoint.id);
    const available = assigned.filter((officer) => officer.status === 'Available').length;
    const onDuty = assigned.filter((officer) => ['On Duty', 'Reviewing', 'Available'].includes(officer.status)).length;
    const staffingStatus =
      assigned.length < checkpoint.requiredOfficers
        ? 'Understaffed'
        : assigned.length > checkpoint.requiredOfficers + 2
          ? 'Overstaffed'
          : 'Fully Staffed';
    return { ...checkpoint, required: checkpoint.requiredOfficers, assigned: assigned.length, onDuty, available, staffingStatus };
  });
  const staffingColumns = [
    { key: 'name', header: 'Checkpoint' },
    { key: 'required', header: 'Required Officers' },
    { key: 'assigned', header: 'Assigned' },
    { key: 'onDuty', header: 'On Duty' },
    { key: 'available', header: 'Available' },
    { key: 'staffingStatus', header: 'Staffing Status', render: (value) => <DemoStatusBadge status={value === 'Understaffed' ? 'Warning' : value === 'Overstaffed' ? 'Info' : 'Operational'}>{value}</DemoStatusBadge> },
  ];

  function openAssignment(officer = null) {
    setAssignment({
      officerId: officer?.id || '',
      checkpointId: officer?.assignedCheckpointId || checkpoints[0]?.id || '',
      assignmentType: 'Primary',
      startTime: '10:00',
      endTime: '18:00',
      notes: '',
    });
    setAssignmentOpen(true);
  }

  function saveAssignment(event) {
    event.preventDefault();
    setOfficers((current) =>
      current.map((officer) =>
        officer.id === assignment.officerId
          ? {
              ...officer,
              assignedCheckpointId: assignment.checkpointId,
              status: assignment.assignmentType === 'Relief' ? 'Available' : 'On Duty',
              lastActive: 'Just now',
              recentActivity: [
                `${assignment.assignmentType} assignment to ${checkpointName(checkpoints, assignment.checkpointId)} saved`,
                ...officer.recentActivity,
              ],
            }
          : officer,
      ),
    );
    setAssignmentOpen(false);
  }

  function deactivate(officerId) {
    setOfficers((current) =>
      current.map((officer) =>
        officer.id === officerId
          ? { ...officer, status: 'Inactive', currentCase: '—', lastActive: 'Just now' }
          : officer,
      ),
    );
  }

  return (
    <>
      <PageHeader
        title="Officer Management / Assignment"
        description="Manage fictional admin, surveillance officer, and duty officer staffing."
        actions={<Button onClick={() => openAssignment()}>Assign Officer</Button>}
      />
      <DemoNotice />
      <KpiGrid>{kpis.map((kpi) => <MetricCard key={kpi.label} {...kpi} />)}</KpiGrid>
      <Card title="Officer Directory">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <SearchInput label="Search officers" placeholder="Name, officer ID, checkpoint" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select label="Role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} options={['All', ...roles].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', ...statuses].map((value) => ({ value, label: value }))} />
        </div>
        <DataTable caption="Officer management table" rowKey="id" columns={columns} data={filtered} />
      </Card>
      <Card title="Staffing Overview">
        <DataTable caption="Staffing overview" rowKey="id" columns={staffingColumns} data={staffingRows} />
      </Card>

      <Drawer
        open={Boolean(selectedOfficer)}
        onClose={() => setSelectedOfficer(null)}
        title={selectedOfficer?.name}
        description={selectedOfficer?.officerId}
        footer={
          selectedOfficer && (
            <>
              <Button variant="outline" onClick={() => openAssignment(selectedOfficer)}>Assign Checkpoint</Button>
              <Button variant="outline" onClick={() => openAssignment(selectedOfficer)}>Reassign</Button>
              <Button variant="danger" onClick={() => deactivate(selectedOfficer.id)}>Deactivate</Button>
            </>
          )
        }
      >
        {selectedOfficer && (
          <div className="space-y-4">
            <DetailGrid
              items={[
                { label: 'Role', value: selectedOfficer.role },
                { label: 'Assigned Checkpoint', value: checkpointName(checkpoints, selectedOfficer.assignedCheckpointId) },
                { label: 'Status', value: <DemoStatusBadge status={selectedOfficer.status} /> },
                { label: 'Current Case', value: selectedOfficer.currentCase },
                { label: 'Cases Today', value: selectedOfficer.casesToday },
                { label: 'Pending Reviews', value: selectedOfficer.pendingReviews },
                { label: 'Last Active', value: selectedOfficer.lastActive },
              ]}
            />
            <Card title="Recent Activity">
              <ul className="space-y-2 text-body">
                {selectedOfficer.recentActivity.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>
          </div>
        )}
      </Drawer>

      <Modal open={assignmentOpen} onClose={() => setAssignmentOpen(false)} title="Officer Assignment" size="large">
        <form className="space-y-4" onSubmit={saveAssignment}>
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Officer" required value={assignment.officerId} onChange={(event) => setAssignment({ ...assignment, officerId: event.target.value })} placeholder="Choose officer" options={officers.map((officer) => ({ value: officer.id, label: `${officer.name} · ${officer.role}` }))} />
            <Select label="Checkpoint" required value={assignment.checkpointId} onChange={(event) => setAssignment({ ...assignment, checkpointId: event.target.value })} options={checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))} />
            <Select label="Assignment Type" value={assignment.assignmentType} onChange={(event) => setAssignment({ ...assignment, assignmentType: event.target.value })} options={['Primary', 'Temporary', 'Relief'].map((value) => ({ value, label: value }))} />
            <Input label="Start Time" type="time" value={assignment.startTime} onChange={(event) => setAssignment({ ...assignment, startTime: event.target.value })} />
            <Input label="End Time" type="time" value={assignment.endTime} onChange={(event) => setAssignment({ ...assignment, endTime: event.target.value })} />
            <Input label="Notes" value={assignment.notes} onChange={(event) => setAssignment({ ...assignment, notes: event.target.value })} />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignmentOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!assignment.officerId || !assignment.checkpointId}>Save Assignment</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
