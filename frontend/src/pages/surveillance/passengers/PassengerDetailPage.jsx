import { useNavigate, useParams } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import {
  checkpointName,
  officerName,
  passengerById,
} from '../../../features/surveillance/surveillanceHelpers';
import {
  DetailGrid,
  SurveillanceDemoNotice,
  SurveillanceRiskBadge,
  SurveillanceSeverityBadge,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

export default function PassengerDetailPage() {
  const { passengerId } = useParams();
  const navigate = useNavigate();
  const { checkpoints, passengers, screenings, alerts, officers, history } = useSurveillanceData();
  const passenger = passengerById(passengers, passengerId) || passengers[0];
  const passengerScreenings = screenings.filter((screening) => screening.passengerId === passenger.id);
  const passengerAlerts = alerts.filter((alert) => alert.reference === passenger.id);
  const passengerHistory = history.filter((event) => event.reference === passenger.id);

  return (
    <>
      <PageHeader
        title={passenger.id}
        description="Passenger investigation view using fictional demo data only."
        actions={<Button variant="outline" onClick={() => navigate('/surveillance/history')}>View History</Button>}
      />
      <SurveillanceDemoNotice />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Passenger Summary">
          <DetailGrid items={[
            { label: 'Passenger ID', value: passenger.id },
            { label: 'Nationality', value: passenger.nationality },
            { label: 'Document Type', value: passenger.documentType },
            { label: 'Current Risk', value: <SurveillanceRiskBadge risk={passenger.risk} /> },
            { label: 'Risk Score', value: passenger.riskScore },
            { label: 'Screening Status', value: <SurveillanceStatusBadge status={passenger.screeningStatus} /> },
            { label: 'Checkpoint', value: checkpointName(checkpoints, passenger.checkpointId) },
          ]} />
        </Card>
        <Card title="Verification Status">
          <DetailGrid items={[
            { label: 'Identity Verification', value: <SurveillanceStatusBadge status={passenger.identityStatus} /> },
            { label: 'Document Verification', value: <SurveillanceStatusBadge status={passenger.documentStatus} /> },
            { label: 'Face Verification', value: <SurveillanceStatusBadge status={passenger.faceStatus} /> },
            { label: 'MRZ Status', value: <SurveillanceStatusBadge status={passenger.mrzStatus} /> },
            { label: 'Database Verification', value: <SurveillanceStatusBadge status={passenger.databaseStatus} /> },
          ]} />
        </Card>
      </div>
      <Card title="Screening History">
        <DataTable caption="Passenger screening history" rowKey="id" columns={[
          { key: 'id', header: 'Screening' },
          { key: 'checkpointId', header: 'Checkpoint', render: (value) => checkpointName(checkpoints, value) },
          { key: 'document', header: 'Document' },
          { key: 'currentStage', header: 'Stage' },
          { key: 'risk', header: 'Risk', render: (value) => <SurveillanceRiskBadge risk={value} /> },
          { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
          { key: 'officerId', header: 'Officer', render: (value) => officerName(officers, value) },
        ]} data={passengerScreenings} />
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Alert History">
          <DataTable caption="Passenger alert history" rowKey="id" columns={[
            { key: 'severity', header: 'Severity', render: (value) => <SurveillanceSeverityBadge severity={value} /> },
            { key: 'title', header: 'Alert' },
            { key: 'created', header: 'Created' },
            { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
          ]} data={passengerAlerts} />
        </Card>
        <Card title="Decision / Referral History">
          <DataTable caption="Passenger decision history" rowKey="id" columns={[
            { key: 'timestamp', header: 'Time' },
            { key: 'event', header: 'Event' },
            { key: 'officerId', header: 'Officer', render: (value) => officerName(officers, value) },
            { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
            { key: 'action', header: 'Action' },
          ]} data={passengerHistory} />
        </Card>
      </div>
      <Card title="Audit Timeline">
        <ol className="space-y-2 text-body">
          <li>Record opened in Surveillance Officer demo interface.</li>
          {passengerHistory.map((event) => <li key={event.id}>{event.timestamp} · {event.detail}</li>)}
          {!passengerHistory.length && <li>No additional audit events for this fictional passenger.</li>}
        </ol>
      </Card>
    </>
  );
}
