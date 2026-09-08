import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Activity, Bell, MapPinned, ShieldAlert, UsersRound } from 'lucide-react';
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
  nextSort,
  officerName,
  passengerById,
  sortRows,
} from '../../../features/surveillance/surveillanceHelpers';
import {
  DetailGrid,
  KpiGrid,
  MiniBar,
  ProgressIndicator,
  SurveillanceDemoNotice,
  SurveillanceRiskBadge,
  SurveillanceSeverityBadge,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

export default function SurveillanceDashboardPage() {
  const navigate = useNavigate();
  const { checkpoints, passengers, screenings, alerts, officers, health } = useSurveillanceData();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activitySort, setActivitySort] = useState({ key: 'throughput', direction: 'desc' });

  const activeAlerts = alerts.filter((alert) => alert.status !== 'Resolved');
  const filteredCheckpoints = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = checkpoints.filter(
      (checkpoint) =>
        [checkpoint.name, checkpoint.region, checkpoint.type].some((value) =>
          value.toLowerCase().includes(term),
        ) &&
        (statusFilter === 'All' || checkpoint.status === statusFilter),
    );
    return sortRows(rows, activitySort);
  }, [activitySort, checkpoints, search, statusFilter]);

  const kpis = [
    { label: 'Active Checkpoints', value: `${checkpoints.filter((item) => item.status !== 'Offline').length} / 26`, tone: 'success', icon: MapPinned },
    { label: 'Passengers Today', value: 18426, tone: 'info' },
    { label: 'Currently Screening', value: screenings.filter((item) => ['In Progress', 'Flagged', 'Queued'].includes(item.status)).length, tone: 'info', icon: Activity },
    { label: 'High-Risk Cases', value: checkpoints.reduce((sum, item) => sum + item.highRisk, 0), tone: 'danger', icon: ShieldAlert },
    { label: 'Medium-Risk Cases', value: checkpoints.reduce((sum, item) => sum + item.mediumRisk, 0), tone: 'warning' },
    { label: 'Active Alerts', value: activeAlerts.length, tone: 'danger', icon: Bell },
    { label: 'Officers On Duty', value: officers.filter((item) => item.status !== 'Off Duty').length, tone: 'success', icon: UsersRound },
    { label: 'System Health', value: '98.7%', tone: 'success' },
  ];

  const checkpointColumns = [
    { key: 'name', header: 'Checkpoint', sortable: true, render: (_, row) => <Button size="small" variant="ghost" onClick={() => setSelectedCheckpoint(row)}>{row.name}</Button> },
    { key: 'throughput', header: 'Passengers/min', sortable: true },
    { key: 'queue', header: 'Queue', sortable: true },
    { key: 'activeScreenings', header: 'Active Screening', sortable: true },
    { key: 'highRisk', header: 'High Risk', sortable: true, render: (value) => <span className="font-semibold text-danger">{value}</span> },
    { key: 'officersOnDuty', header: 'Officers', sortable: true },
    { key: 'health', header: 'System Health', sortable: true, render: (value) => `${value}%` },
    { key: 'status', header: 'Status', sortable: true, render: (value) => <SurveillanceStatusBadge status={value} /> },
  ];

  const passengerRows = screenings.slice(0, 7).map((screening) => {
    const passenger = passengerById(passengers, screening.passengerId);
    return { ...screening, nationality: passenger?.nationality, documentType: passenger?.documentType };
  });
  const passengerColumns = [
    { key: 'passengerId', header: 'Passenger ID', render: (value, row) => <Button size="small" variant="ghost" onClick={() => setSelectedPassenger(row)}>{value}</Button> },
    { key: 'checkpointId', header: 'Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'nationality', header: 'Nationality' },
    { key: 'documentType', header: 'Document Type' },
    { key: 'status', header: 'Screening Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
    { key: 'risk', header: 'Risk', render: (value) => <SurveillanceRiskBadge risk={value} /> },
    { key: 'started', header: 'Time' },
    { key: 'action', header: 'Action', render: (_, row) => <Button size="small" variant="outline" onClick={() => navigate(`/surveillance/passengers/${row.passengerId}`)}>View Passenger</Button> },
  ];
  const staffingRows = checkpoints.map((checkpoint) => ({
    id: checkpoint.id,
    checkpoint: checkpoint.name,
    required: checkpoint.requiredOfficers,
    assigned: officers.filter((officer) => officer.checkpointId === checkpoint.id).length,
    onDuty: checkpoint.officersOnDuty,
    status: checkpoint.officersOnDuty < checkpoint.requiredOfficers ? 'Understaffed' : 'Fully Staffed',
  }));

  return (
    <>
      <PageHeader
        eyebrow="Surveillance Officer"
        title="Surveillance Command Center"
        description="Multi-checkpoint operational monitoring"
        actions={<Button onClick={() => navigate('/surveillance/alerts')}>Review Alerts</Button>}
      />
      <SurveillanceDemoNotice />
      <KpiGrid>{kpis.map((kpi) => <MetricCard key={kpi.label} {...kpi} />)}</KpiGrid>

      <Card title="Checkpoint Network Overview" description="Operational status across assigned fictional checkpoints.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {checkpoints.map((checkpoint) => (
            <button
              key={checkpoint.id}
              type="button"
              onClick={() => setSelectedCheckpoint(checkpoint)}
              className="rounded-panel border border-default bg-surface p-4 text-left shadow-panel hover:border-primary focus-visible:outline-primary"
              aria-label={`Open ${checkpoint.name} details`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-navy">{checkpoint.name}</h3>
                  <p className="text-caption text-muted">{checkpoint.region} · {checkpoint.type}</p>
                </div>
                <SurveillanceStatusBadge status={checkpoint.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-caption">
                <span>Throughput: <strong>{checkpoint.throughput}/min</strong></span>
                <span>Queue: <strong>{checkpoint.queue}</strong></span>
                <span>Officers: <strong>{checkpoint.officersOnDuty}</strong></span>
                <span>Screening: <strong>{checkpoint.activeScreenings}</strong></span>
                <span>High risk: <strong className="text-danger">{checkpoint.highRisk}</strong></span>
                <span>Health: <strong>{checkpoint.health}%</strong></span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Live Border Activity" description="Demo operational snapshot.">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <SearchInput label="Checkpoint search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, region, or type" />
          <Select label="Status filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} options={['All', 'Operational', 'Warning', 'Critical', 'Offline'].map((value) => ({ value, label: value }))} />
        </div>
        <DataTable
          caption="Live border activity"
          rowKey="id"
          columns={checkpointColumns}
          data={filteredCheckpoints}
          sort={activitySort}
          onSort={(key) => setActivitySort((current) => nextSort(current, key))}
          emptyTitle="No checkpoints found"
          emptyDescription="Adjust search or status filters."
        />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Passenger Screening Activity">
          <DataTable caption="Recent passenger screening activity" rowKey="id" columns={passengerColumns} data={passengerRows} />
        </Card>
        <Card title="Active Alerts">
          <div className="space-y-3">
            {activeAlerts.slice(0, 7).map((alert) => (
              <button key={alert.id} type="button" onClick={() => setSelectedAlert(alert)} className="w-full rounded-control border border-default bg-canvas p-3 text-left hover:border-primary">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <SurveillanceSeverityBadge severity={alert.severity} />
                    <p className="mt-1 font-semibold text-navy">{alert.title}</p>
                    <p className="text-caption text-muted">{checkpointName(checkpoints, alert.checkpointId)} · {alert.created}</p>
                  </div>
                  <SurveillanceStatusBadge status={alert.status} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Risk Activity">
          <div className="space-y-3">
            <MiniBar label="Low Risk" value={17920} max={18426} variant="success" />
            <MiniBar label="Medium Risk" value={46} max={100} variant="warning" />
            <MiniBar label="High Risk" value={12} max={100} variant="danger" />
          </div>
          <div className="mt-4 space-y-2">
            {passengers.filter((passenger) => passenger.risk === 'High').map((passenger) => (
              <Button key={passenger.id} size="small" variant="outline" onClick={() => navigate(`/surveillance/passengers/${passenger.id}`)}>{passenger.id} · {checkpointName(checkpoints, passenger.checkpointId)}</Button>
            ))}
          </div>
        </Card>
        <Card title="Checkpoint Health">
          <div className="space-y-3">
            {health.map((service) => (
              <div key={service.service} className="flex items-center justify-between gap-3 rounded-control border border-default bg-canvas p-3">
                <span className="font-semibold text-ink">{service.service}</span>
                <SurveillanceStatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Officer Operations">
          <DetailGrid
            items={[
              { label: 'Officers On Duty', value: officers.filter((officer) => officer.status !== 'Off Duty').length },
              { label: 'Available', value: officers.filter((officer) => officer.status === 'Available').length },
              { label: 'Busy', value: officers.filter((officer) => officer.status === 'Busy').length },
              { label: 'Off Duty', value: officers.filter((officer) => officer.status === 'Off Duty').length },
              { label: 'Staffing Issues', value: staffingRows.filter((row) => row.status === 'Understaffed').length },
            ]}
          />
        </Card>
      </div>

      <Card title="Checkpoint Staffing Summary">
        <DataTable
          caption="Checkpoint staffing summary"
          rowKey="id"
          columns={[
            { key: 'checkpoint', header: 'Checkpoint' },
            { key: 'required', header: 'Required' },
            { key: 'assigned', header: 'Assigned' },
            { key: 'onDuty', header: 'On Duty' },
            { key: 'status', header: 'Staffing Status', render: (value) => <SurveillanceStatusBadge status={value === 'Understaffed' ? 'Warning' : 'Operational'}>{value}</SurveillanceStatusBadge> },
          ]}
          data={staffingRows}
        />
      </Card>

      <Card title="Quick Actions">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/surveillance/checkpoints')}>View Checkpoints</Button>
          <Button variant="outline" onClick={() => navigate('/surveillance/screening')}>View Live Screening</Button>
          <Button variant="outline" onClick={() => navigate('/surveillance/alerts')}>Review Alerts</Button>
          <Button variant="outline" onClick={() => navigate('/surveillance/officers')}>View Officers</Button>
          <Button variant="outline" onClick={() => navigate('/surveillance/history')}>View History</Button>
          <Button variant="outline" onClick={() => navigate('/surveillance/reports')}>View Reports</Button>
        </div>
      </Card>

      <Drawer
        open={Boolean(selectedCheckpoint)}
        onClose={() => setSelectedCheckpoint(null)}
        title={selectedCheckpoint?.name}
        description={selectedCheckpoint?.id}
        footer={selectedCheckpoint && <Button onClick={() => navigate(`/surveillance/checkpoints/${selectedCheckpoint.id}`)}>Open Checkpoint Detail</Button>}
      >
        {selectedCheckpoint && (
          <DetailGrid
            items={[
              { label: 'Region', value: selectedCheckpoint.region },
              { label: 'Type', value: selectedCheckpoint.type },
              { label: 'Status', value: <SurveillanceStatusBadge status={selectedCheckpoint.status} /> },
              { label: 'Throughput', value: `${selectedCheckpoint.throughput}/min` },
              { label: 'Queue', value: selectedCheckpoint.queue },
              { label: 'Active Screenings', value: selectedCheckpoint.activeScreenings },
              { label: 'High Risk', value: selectedCheckpoint.highRisk },
              { label: 'System Health', value: `${selectedCheckpoint.health}%` },
            ]}
          />
        )}
      </Drawer>

      <Drawer
        open={Boolean(selectedPassenger)}
        onClose={() => setSelectedPassenger(null)}
        title={selectedPassenger?.passengerId}
        description={selectedPassenger ? checkpointName(checkpoints, selectedPassenger.checkpointId) : undefined}
        footer={selectedPassenger && <Button onClick={() => navigate(`/surveillance/passengers/${selectedPassenger.passengerId}`)}>View Passenger</Button>}
      >
        {selectedPassenger && (
          <DetailGrid
            items={[
              { label: 'Document', value: selectedPassenger.document },
              { label: 'Current Stage', value: selectedPassenger.currentStage },
              { label: 'Progress', value: <ProgressIndicator value={selectedPassenger.progress} /> },
              { label: 'Risk', value: <SurveillanceRiskBadge risk={selectedPassenger.risk} /> },
              { label: 'Status', value: <SurveillanceStatusBadge status={selectedPassenger.status} /> },
              { label: 'Elapsed', value: selectedPassenger.elapsed },
            ]}
          />
        )}
      </Drawer>

      <Drawer
        open={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title}
        description={selectedAlert?.id}
        footer={selectedAlert && <Button onClick={() => navigate('/surveillance/alerts')}>Open Alert Center</Button>}
      >
        {selectedAlert && (
          <DetailGrid
            items={[
              { label: 'Severity', value: <SurveillanceSeverityBadge severity={selectedAlert.severity} /> },
              { label: 'Checkpoint', value: checkpointName(checkpoints, selectedAlert.checkpointId) },
              { label: 'Reference', value: selectedAlert.reference },
              { label: 'Status', value: <SurveillanceStatusBadge status={selectedAlert.status} /> },
              { label: 'Assigned To', value: officerName(officers, selectedAlert.assignedTo) },
              { label: 'Description', value: selectedAlert.description },
            ]}
          />
        )}
      </Drawer>
    </>
  );
}
