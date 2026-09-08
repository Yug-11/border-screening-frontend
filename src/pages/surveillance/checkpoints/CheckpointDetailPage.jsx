import { useNavigate, useParams } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import MetricCard from '../../../components/data-display/MetricCard';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import {
  checkpointName,
  officerName,
  passengerById,
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

export default function CheckpointDetailPage() {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const { checkpoints, screenings, passengers, alerts, officers, history, health, setCheckpoints } = useSurveillanceData();
  const checkpoint = checkpoints.find((item) => item.id === checkpointId) || checkpoints[0];
  const checkpointScreenings = screenings.filter((item) => item.checkpointId === checkpoint.id);
  const checkpointAlerts = alerts.filter((item) => item.checkpointId === checkpoint.id);
  const checkpointOfficers = officers.filter((item) => item.checkpointId === checkpoint.id);
  const checkpointHistory = history.filter((item) => item.checkpointId === checkpoint.id);

  function acknowledgeWarning() {
    setCheckpoints((current) =>
      current.map((item) =>
        item.id === checkpoint.id && item.status !== 'Operational'
          ? { ...item, status: 'Warning', lastActivity: 'Warning acknowledged just now', lastUpdated: 'Just now' }
          : item,
      ),
    );
  }

  const queueRows = checkpointScreenings.map((screening) => {
    const passenger = passengerById(passengers, screening.passengerId);
    return { ...screening, nationality: passenger?.nationality };
  });

  return (
    <>
      <PageHeader
        title={checkpoint.name}
        description={`${checkpoint.id} · ${checkpoint.region} · ${checkpoint.type} · Last updated ${checkpoint.lastUpdated}`}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(`/surveillance/alerts?checkpoint=${checkpoint.id}`)}>View Alerts</Button>
            <Button variant="outline" onClick={() => navigate('/surveillance/officers')}>View Officers</Button>
            <Button variant="outline" onClick={() => navigate('/surveillance/screening')}>View Screening</Button>
            {checkpoint.status !== 'Operational' && <Button onClick={acknowledgeWarning}>Acknowledge Warning</Button>}
          </>
        }
      />
      <SurveillanceDemoNotice />
      <Card><SurveillanceStatusBadge status={checkpoint.status} /> <span className="ml-3 text-caption text-muted">{checkpoint.notes}</span></Card>
      <KpiGrid>
        <MetricCard label="Passengers Today" value={Math.round(checkpoint.throughput * 520)} />
        <MetricCard label="Current Queue" value={checkpoint.queue} tone="warning" />
        <MetricCard label="Active Screening" value={checkpoint.activeScreenings} tone="info" />
        <MetricCard label="High Risk" value={checkpoint.highRisk} tone="danger" />
        <MetricCard label="Officers On Duty" value={checkpoint.officersOnDuty} />
        <MetricCard label="System Health" value={`${checkpoint.health}%`} tone={checkpoint.health < 90 ? 'danger' : 'success'} />
      </KpiGrid>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Current Queue">
          <DataTable caption="Current checkpoint queue" rowKey="id" columns={[
            { key: 'passengerId', header: 'Passenger', render: (value) => <Button size="small" variant="ghost" onClick={() => navigate(`/surveillance/passengers/${value}`)}>{value}</Button> },
            { key: 'currentStage', header: 'Stage' },
            { key: 'progress', header: 'Progress', render: (value) => <ProgressIndicator value={value} /> },
            { key: 'risk', header: 'Risk', render: (value) => <SurveillanceRiskBadge risk={value} /> },
            { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
          ]} data={queueRows} />
        </Card>
        <Card title="Screening Activity">
          <DetailGrid items={[
            { label: 'Completed', value: checkpointScreenings.filter((item) => item.status === 'Completed').length },
            { label: 'In Progress', value: checkpointScreenings.filter((item) => item.status === 'In Progress').length },
            { label: 'Flagged', value: checkpointScreenings.filter((item) => item.status === 'Flagged').length },
            { label: 'Failed', value: checkpointScreenings.filter((item) => item.status === 'Failed').length },
          ]} />
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Risk Activity">
          <div className="space-y-3">
            <MiniBar label="Low" value={Math.max(checkpoint.throughput * 10 - checkpoint.mediumRisk - checkpoint.highRisk, 1)} max={checkpoint.throughput * 10 || 1} variant="success" />
            <MiniBar label="Medium" value={checkpoint.mediumRisk} max={20} variant="warning" />
            <MiniBar label="High" value={checkpoint.highRisk} max={10} variant="danger" />
          </div>
        </Card>
        <Card title="Checkpoint Health">
          <div className="space-y-3">{health.map((item) => <div key={item.service} className="flex items-center justify-between rounded-control border border-default bg-canvas p-3"><span>{item.service}</span><SurveillanceStatusBadge status={checkpoint.status === 'Offline' ? 'Unavailable' : item.status} /></div>)}</div>
        </Card>
        <Card title="Officer Staffing">
          <DetailGrid items={[
            { label: 'Required', value: checkpoint.requiredOfficers },
            { label: 'Assigned', value: checkpointOfficers.length },
            { label: 'On Duty', value: checkpoint.officersOnDuty },
            { label: 'Staffing Status', value: <SurveillanceStatusBadge status={checkpoint.officersOnDuty < checkpoint.requiredOfficers ? 'Warning' : 'Operational'}>{checkpoint.officersOnDuty < checkpoint.requiredOfficers ? 'Understaffed' : 'Fully Staffed'}</SurveillanceStatusBadge> },
          ]} />
        </Card>
      </div>
      <Card title="Active Alerts">
        <DataTable caption="Checkpoint active alerts" rowKey="id" columns={[
          { key: 'severity', header: 'Severity', render: (value) => <SurveillanceSeverityBadge severity={value} /> },
          { key: 'title', header: 'Alert' },
          { key: 'reference', header: 'Reference' },
          { key: 'created', header: 'Created' },
          { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
        ]} data={checkpointAlerts} />
      </Card>
      <Card title="Recent History">
        <DataTable caption="Checkpoint recent history" rowKey="id" columns={[
          { key: 'timestamp', header: 'Timestamp' },
          { key: 'event', header: 'Event' },
          { key: 'reference', header: 'Reference' },
          { key: 'risk', header: 'Risk', render: (value) => <SurveillanceRiskBadge risk={value} /> },
          { key: 'officerId', header: 'Officer', render: (value) => officerName(officers, value) },
          { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
          { key: 'action', header: 'Action' },
        ]} data={checkpointHistory.map((row) => ({ ...row, checkpoint: checkpointName(checkpoints, row.checkpointId) }))} />
      </Card>
    </>
  );
}
