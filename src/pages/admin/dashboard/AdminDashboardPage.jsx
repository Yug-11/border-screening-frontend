import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, MapPinned, ShieldAlert, UsersRound } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import PageHeader from '../../../components/ui/PageHeader';
import MetricCard from '../../../components/data-display/MetricCard';
import { passengerVolume, riskTrend, systemHealthServices } from '../../../data/mockAdminData';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { checkpointName, nextSort, sortRows } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  DemoStatusBadge,
  DetailGrid,
  KpiGrid,
  MiniBar,
  RiskBadge,
  RouteLink,
  SeverityBadge,
} from '../../../features/admin/adminUtils';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { checkpoints, passengers, screenings, alerts } = useAdminData();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [activitySort, setActivitySort] = useState({ key: 'passengersPerMin', direction: 'desc' });
  const activeAlerts = alerts.filter((alert) => alert.status !== 'Resolved');
  const sortedCheckpoints = useMemo(
    () => sortRows(checkpoints, activitySort, { checkpoint: (row) => row.name }),
    [activitySort, checkpoints],
  );
  const recentRows = screenings.slice(0, 6).map((screening) => {
    const passenger = passengers.find((item) => item.id === screening.passengerId);
    return {
      ...screening,
      passenger: passenger?.displayName,
      nationality: passenger?.nationality,
      checkpoint: checkpointName(checkpoints, screening.checkpointId),
      time: screening.timestamp.split(' ')[1],
      documentStatus: passenger?.documentStatus,
      faceVerification: passenger?.faceVerification,
      screeningStatus: passenger?.screeningStatus,
    };
  });
  const statusCounts = {
    Operational: 19,
    Warning: 3,
    Critical: 1,
    Offline: 1,
  };

  const activityColumns = [
    { key: 'name', header: 'Checkpoint', sortable: true, render: (_, row) => <RouteLink to={`/admin/checkpoints/${row.id}`}>{row.name}</RouteLink> },
    { key: 'passengersPerMin', header: 'Passengers/min', sortable: true },
    { key: 'currentQueue', header: 'Queue', sortable: true },
    { key: 'officersOnDuty', header: 'Officers', sortable: true },
    { key: 'screeningStatus', header: 'Screening Status', render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'highRisk', header: 'High-Risk Alerts', sortable: true, render: (value) => <span className="font-semibold text-danger">{value}</span> },
    { key: 'systemHealth', header: 'System Health', sortable: true, render: (value) => `${value}%` },
  ];
  const passengerColumns = [
    { key: 'passenger', header: 'Passenger', render: (_, row) => <Button variant="ghost" size="small" onClick={() => setSelectedPassenger(row)}>{row.passenger}</Button> },
    { key: 'passengerId', header: 'Passenger ID' },
    { key: 'checkpoint', header: 'Checkpoint' },
    { key: 'time', header: 'Time' },
    { key: 'document', header: 'Document' },
    { key: 'risk', header: 'Risk', render: (value) => <RiskBadge risk={value} /> },
    { key: 'status', header: 'Status', render: (value) => <DemoStatusBadge status={value} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Border Security Overview"
        description="National Border Network · Last updated: Just now"
        actions={<Button onClick={() => navigate('/admin/alerts')}>View All Alerts</Button>}
      />
      <DemoNotice />

      <KpiGrid>
        <MetricCard label="Active Checkpoints" value={24} description="19 operational" icon={MapPinned} tone="success" />
        <MetricCard label="Passengers Today" value={18426} description="+8.4% vs yesterday" tone="info" />
        <MetricCard label="Currently Screening" value={37} description="Across active lanes" tone="info" />
        <MetricCard label="High Risk" value={12} description="3 requiring immediate attention" icon={ShieldAlert} tone="danger" />
        <MetricCard label="Medium Risk" value={46} description="11 awaiting review" tone="warning" />
        <MetricCard label="Alerts" value={8} description="2 critical" icon={Bell} tone="danger" />
      </KpiGrid>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Checkpoint Network" description="Interactive 2D schematic of fictional national checkpoints.">
          <div className="relative min-h-80 overflow-hidden rounded-panel border border-default bg-canvas p-4">
            <div aria-hidden="true" className="absolute inset-8 rounded-[45%] border-2 border-dashed border-default" />
            <div aria-hidden="true" className="absolute top-1/2 right-8 left-8 border-t border-default" />
            <div aria-hidden="true" className="absolute top-8 bottom-8 left-1/2 border-l border-default" />
            {checkpoints.slice(0, 8).map((checkpoint) => (
              <button
                key={checkpoint.id}
                type="button"
                onClick={() => setSelectedCheckpoint(checkpoint)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-control border border-default bg-surface px-2 py-1 text-left text-caption shadow-panel hover:border-primary focus-visible:outline-primary"
                style={{ left: `${checkpoint.map.x}%`, top: `${checkpoint.map.y}%` }}
                aria-label={`Open ${checkpoint.name} checkpoint detail`}
              >
                <span className="block font-semibold text-navy">{checkpoint.name}</span>
                <DemoStatusBadge status={checkpoint.status} />
              </button>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Checkpoint Status Summary">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="rounded-control border border-default bg-canvas p-3">
                  <div className="flex items-center justify-between gap-3">
                    <DemoStatusBadge status={status} />
                    <span className="text-xl font-semibold text-navy">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Risk Activity">
            <div className="space-y-3">
              <MiniBar label="Low / Cleared" value={17920} max={18426} variant="success" />
              <MiniBar label="Medium Risk" value={46} max={100} variant="warning" />
              <MiniBar label="High Risk" value={12} max={100} variant="danger" />
            </div>
            <DetailGrid
              items={[
                { label: 'High-risk cases today', value: 12 },
                { label: 'Referred', value: 8 },
                { label: 'Under Review', value: 3 },
                { label: 'Resolved', value: 1 },
              ]}
            />
          </Card>
        </div>
      </div>

      <Card title="Live Border Activity" description="Sortable operational activity across checkpoints.">
        <DataTable
          caption="Live border activity"
          rowKey="id"
          columns={activityColumns}
          data={sortedCheckpoints}
          sort={activitySort}
          onSort={(key) => setActivitySort((current) => nextSort(current, key))}
        />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Recent Passenger Activity">
          <DataTable caption="Recent passenger activity" rowKey="id" columns={passengerColumns} data={recentRows} />
        </Card>
        <Card title="Active Alerts" actions={<Button variant="outline" onClick={() => navigate('/admin/alerts')}>View All Alerts</Button>}>
          <div className="space-y-3">
            {activeAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="rounded-control border border-default bg-canvas p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <SeverityBadge severity={alert.severity} />
                    <p className="mt-2 font-semibold text-navy">{alert.title}</p>
                    <p className="text-caption text-muted">{checkpointName(checkpoints, alert.checkpointId)}</p>
                  </div>
                  <Button size="small" variant="outline" onClick={() => navigate('/admin/alerts')}>Review Alert</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Risk Trend" description="Accessible summary by time and risk level.">
          <div className="space-y-3">
            {riskTrend.map((point) => (
              <div key={point.time} className="grid grid-cols-[3rem_1fr] items-center gap-3">
                <span className="text-caption font-semibold text-muted">{point.time}</span>
                <div className="grid gap-1">
                  <MiniBar label="Low" value={point.low} max={5500} variant="success" />
                  <MiniBar label="Medium" value={point.medium} max={20} variant="warning" />
                  <MiniBar label="High" value={point.high} max={8} variant="danger" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="System Health" description="Overall 98.7%">
          <div className="space-y-3">
            {systemHealthServices.map((service) => (
              <div key={service.name} className="flex items-center justify-between gap-3 rounded-control border border-default bg-canvas p-2">
                <span className="font-semibold text-ink">{service.name}</span>
                <DemoStatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Passenger Volume" description="Total 18,426 · Peak 142 passengers/min · 12:00–14:00">
          <div className="space-y-3">
            {passengerVolume.map((point) => (
              <MiniBar key={point.time} label={point.time} value={point.passengers} max={5680} variant="info" />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Officer Operations">
          <DetailGrid
            items={[
              { label: 'Officers On Duty', value: 86 },
              { label: 'Currently Reviewing', value: 14 },
              { label: 'Available', value: 58 },
              { label: 'Pending Reviews', value: 14 },
            ]}
          />
          <Button className="mt-4" onClick={() => navigate('/admin/officers')}><UsersRound className="icon-sm" aria-hidden="true" />Manage Officers</Button>
        </Card>
        <Card title="Case Review Workload">
          <DetailGrid
            items={[
              { label: 'New Referrals', value: 8 },
              { label: 'Under Review', value: 17 },
              { label: 'Awaiting Decision', value: 11 },
              { label: 'Resolved Today', value: 34 },
              { label: 'Officer Review Capacity', value: '72%' },
            ]}
          />
        </Card>
        <Card title="Operational Summary" description="Requires Attention">
          <ul className="space-y-2 text-body">
            <li>2 critical alerts</li>
            <li>3 checkpoints in warning</li>
            <li>8 high-risk referrals awaiting review</li>
            <li>14 officer cases pending</li>
          </ul>
        </Card>
      </div>

      <Drawer
        open={Boolean(selectedCheckpoint)}
        onClose={() => setSelectedCheckpoint(null)}
        title={selectedCheckpoint?.name}
        description={selectedCheckpoint?.code}
        footer={
          selectedCheckpoint && (
            <>
              <Button variant="outline" onClick={() => navigate(`/admin/checkpoints/${selectedCheckpoint.id}`)}>View Checkpoint</Button>
              <Button variant="outline" onClick={() => navigate('/admin/officers')}>Manage Officers</Button>
              <Button onClick={() => navigate('/admin/alerts')}>View Alerts</Button>
            </>
          )
        }
      >
        {selectedCheckpoint && (
          <DetailGrid
            items={[
              { label: 'Region', value: selectedCheckpoint.region },
              { label: 'Status', value: <DemoStatusBadge status={selectedCheckpoint.status} /> },
              { label: 'Passengers Today', value: selectedCheckpoint.passengersToday.toLocaleString('en-US') },
              { label: 'Passengers/min', value: selectedCheckpoint.passengersPerMin },
              { label: 'Current Queue', value: selectedCheckpoint.currentQueue },
              { label: 'Officers On Duty', value: selectedCheckpoint.officersOnDuty },
              { label: 'High Risk', value: selectedCheckpoint.highRisk },
              { label: 'Medium Risk', value: selectedCheckpoint.mediumRisk },
              { label: 'System Health', value: `${selectedCheckpoint.systemHealth}%` },
              { label: 'Last System Event', value: selectedCheckpoint.lastSystemEvent },
            ]}
          />
        )}
      </Drawer>

      <Drawer
        open={Boolean(selectedPassenger)}
        onClose={() => setSelectedPassenger(null)}
        title={selectedPassenger?.passenger}
        description={selectedPassenger?.passengerId}
        footer={
          selectedPassenger && (
            <Button onClick={() => navigate(`/admin/passengers?passenger=${selectedPassenger.passengerId}`)}>
              View Passenger Intelligence
            </Button>
          )
        }
      >
        {selectedPassenger && (
          <DetailGrid
            items={[
              { label: 'Passenger ID', value: selectedPassenger.passengerId },
              { label: 'Nationality', value: selectedPassenger.nationality },
              { label: 'Checkpoint', value: selectedPassenger.checkpoint },
              { label: 'Risk', value: <RiskBadge risk={selectedPassenger.risk} /> },
              { label: 'Risk Score', value: selectedPassenger.score },
              { label: 'Document Status', value: selectedPassenger.documentStatus },
              { label: 'Face Verification', value: selectedPassenger.faceVerification },
              { label: 'Screening Status', value: selectedPassenger.screeningStatus },
              { label: 'Time Screened', value: selectedPassenger.time },
            ]}
          />
        )}
      </Drawer>
    </>
  );
}
