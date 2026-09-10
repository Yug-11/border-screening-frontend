import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { systemHealthServices } from '../../../data/mockAdminData';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { officerName, passengerName } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  DemoStatusBadge,
  DetailGrid,
  KpiGrid,
  MiniBar,
  RiskBadge,
  SeverityBadge,
} from '../../../features/admin/adminUtils';

export default function CheckpointDetailPage() {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const { checkpoints, officers, passengers, screenings, alerts, setOfficers } = useAdminData();
  const checkpoint = checkpoints.find((item) => item.id === checkpointId) || checkpoints[0];
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const checkpointOfficers = officers.filter((officer) => officer.assignedCheckpointId === checkpoint.id);
  const checkpointScreenings = screenings.filter((screening) => screening.checkpointId === checkpoint.id);
  const checkpointAlerts = alerts.filter((alert) => alert.checkpointId === checkpoint.id);
  const queueRows = checkpointScreenings.map((screening) => ({
    ...screening,
    passenger: passengerName(passengers, screening.passengerId),
    officer: officerName(officers, screening.officerId),
  }));
  const activityRows = useMemo(
    () => [
      { id: 'act-1', label: 'Completed', count: 126, timestamp: '10:20' },
      { id: 'act-2', label: 'In Progress', count: checkpoint.currentQueue, timestamp: '10:18' },
      { id: 'act-3', label: 'Referred', count: checkpoint.highRisk + checkpoint.mediumRisk, timestamp: '10:15' },
      { id: 'act-4', label: 'Cleared', count: 112, timestamp: '10:12' },
    ],
    [checkpoint],
  );

  function assignOfficer() {
    if (!assignOfficerId) return;
    setOfficers((current) =>
      current.map((officer) =>
        officer.id === assignOfficerId
          ? { ...officer, assignedCheckpointId: checkpoint.id, status: 'Available', lastActive: 'Just now' }
          : officer,
      ),
    );
    setAssignOfficerId('');
  }

  const queueColumns = [
    { key: 'passenger', header: 'Passenger' },
    { key: 'arrival', header: 'Arrival' },
    { key: 'stage', header: 'Screening Stage' },
    { key: 'risk', header: 'Risk', render: (value) => <RiskBadge risk={value} /> },
    { key: 'status', header: 'Status', render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'officer', header: 'Officer' },
  ];
  const alertColumns = [
    { key: 'severity', header: 'Severity', render: (value) => <SeverityBadge severity={value} /> },
    { key: 'title', header: 'Alert' },
    { key: 'created', header: 'Created' },
    { key: 'status', header: 'Status', render: (value) => <DemoStatusBadge status={value} /> },
  ];

  return (
    <>
      <PageHeader
        title={checkpoint.name}
        description={`${checkpoint.code} · ${checkpoint.region} · ${checkpoint.type}`}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/checkpoints')}>Edit Checkpoint</Button>
            <Button variant="outline" onClick={() => navigate('/admin/officers')}>Manage Officers</Button>
            <Button onClick={() => navigate(`/admin/alerts?checkpoint=${checkpoint.id}`)}>View Alerts</Button>
          </>
        }
      />
      <DemoNotice />
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <DemoStatusBadge status={checkpoint.status} />
          <span className="text-caption text-muted">Last event: {checkpoint.lastSystemEvent}</span>
        </div>
      </Card>
      <KpiGrid>
        <MetricCard label="Passengers Today" value={checkpoint.passengersToday} />
        <MetricCard label="Passengers/min" value={checkpoint.passengersPerMin} tone="info" />
        <MetricCard label="Current Queue" value={checkpoint.currentQueue} tone="warning" />
        <MetricCard label="Officers On Duty" value={checkpoint.officersOnDuty} />
        <MetricCard label="High Risk" value={checkpoint.highRisk} tone="danger" />
        <MetricCard label="Medium Risk" value={checkpoint.mediumRisk} tone="warning" />
        <MetricCard label="System Health" value={`${checkpoint.systemHealth}%`} tone={checkpoint.status === 'Critical' ? 'danger' : 'success'} />
      </KpiGrid>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Checkpoint Health">
          <div className="space-y-3">
            {systemHealthServices.slice(0, 7).map((service) => (
              <div key={service.name} className="flex items-center justify-between gap-3 rounded-control border border-default bg-canvas p-3">
                <span className="font-semibold text-ink">{service.name.replace('OCR Service', 'OCR')}</span>
                <DemoStatusBadge status={checkpoint.status === 'Offline' ? 'Offline' : service.status} />
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-control border border-default bg-canvas p-3">
              <span className="font-semibold text-ink">Connectivity</span>
              <DemoStatusBadge status={checkpoint.status === 'Critical' ? 'Degraded' : checkpoint.status === 'Offline' ? 'Offline' : 'Operational'} />
            </div>
          </div>
        </Card>
        <Card title="Risk Activity">
          <div className="space-y-4">
            <MiniBar label="Low" value={Math.max(checkpoint.passengersToday - checkpoint.highRisk - checkpoint.mediumRisk, 0)} max={checkpoint.passengersToday || 1} variant="success" />
            <MiniBar label="Medium" value={checkpoint.mediumRisk} max={25} variant="warning" />
            <MiniBar label="High" value={checkpoint.highRisk} max={10} variant="danger" />
          </div>
          <p className="mt-4 text-caption text-muted">Trend is a static fictional summary derived from local demo data.</p>
        </Card>
      </div>
      <Card title="Live Queue">
        <DataTable caption="Checkpoint live queue" rowKey="id" columns={queueColumns} data={queueRows} emptyTitle="No queue records" emptyDescription="No current fictional records for this checkpoint." />
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Screening Activity">
          <div className="space-y-3">
            {activityRows.map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-control border border-default bg-canvas p-3">
                <span className="font-semibold text-navy">{row.label}</span>
                <span className="text-body text-muted">{row.count} · {row.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Officer Assignments">
          <DetailGrid
            items={[
              { label: 'Assigned Officers', value: checkpointOfficers.length },
              { label: 'On Duty', value: checkpointOfficers.filter((officer) => officer.status === 'On Duty').length },
              { label: 'Available', value: checkpointOfficers.filter((officer) => officer.status === 'Available').length },
              { label: 'Reviewing Cases', value: checkpointOfficers.filter((officer) => officer.status === 'Reviewing').length },
            ]}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Select
              label="Assign Officer"
              value={assignOfficerId}
              onChange={(event) => setAssignOfficerId(event.target.value)}
              placeholder="Choose officer"
              options={officers.map((officer) => ({ value: officer.id, label: `${officer.name} · ${officer.role}` }))}
            />
            <Button className="self-end" onClick={assignOfficer}>Assign Officer</Button>
          </div>
          <div className="mt-4 space-y-2">
            {checkpointOfficers.map((officer) => (
              <div key={officer.id} className="flex flex-wrap items-center justify-between gap-2 rounded-control border border-default bg-canvas p-2">
                <span>{officer.name} · {officer.role}</span>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => setOfficers((current) => current.map((item) => item.id === officer.id ? { ...item, assignedCheckpointId: '', status: 'Off Duty' } : item))}
                >
                  Remove Assignment
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Checkpoint Alerts">
        <DataTable caption="Checkpoint alerts" rowKey="id" columns={alertColumns} data={checkpointAlerts} />
      </Card>
    </>
  );
}
