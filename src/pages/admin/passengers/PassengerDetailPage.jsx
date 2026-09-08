import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { checkpointName, officerName } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  DemoStatusBadge,
  DetailGrid,
  RiskBadge,
} from '../../../features/admin/adminUtils';

export default function PassengerDetailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { checkpoints, officers, passengers, screenings, alerts } = useAdminData();
  const initialPassenger = passengers.find((passenger) => passenger.id === params.get('passenger')) || null;
  const [selectedPassenger, setSelectedPassenger] = useState(initialPassenger);
  const [search, setSearch] = useState(params.get('passenger') || '');
  const [filters, setFilters] = useState({
    risk: 'All',
    status: 'All',
    checkpoint: 'All',
    documentType: 'All',
    dateRange: 'All',
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return passengers.filter((passenger) => {
      const checkpoint = checkpointName(checkpoints, passenger.lastCheckpointId);
      return (
        [
          passenger.passengerId,
          passenger.documentNumber,
          passenger.nationality,
          checkpoint,
          passenger.lastScreening,
          passenger.risk,
          passenger.displayName,
        ].some((value) => value.toLowerCase().includes(term)) &&
        (filters.risk === 'All' || passenger.risk === filters.risk) &&
        (filters.status === 'All' || passenger.currentStatus === filters.status) &&
        (filters.checkpoint === 'All' || passenger.lastCheckpointId === filters.checkpoint) &&
        (filters.documentType === 'All' || passenger.documentType === filters.documentType)
      );
    });
  }, [checkpoints, filters, passengers, search]);

  const columns = [
    { key: 'displayName', header: 'Passenger', render: (_, row) => <Button variant="ghost" size="small" onClick={() => setSelectedPassenger(row)}>{row.displayName}</Button> },
    { key: 'passengerId', header: 'Passenger ID' },
    { key: 'nationality', header: 'Nationality' },
    { key: 'documentType', header: 'Document' },
    { key: 'lastCheckpointId', header: 'Last Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'lastScreening', header: 'Last Screening' },
    { key: 'risk', header: 'Risk', render: (value) => <RiskBadge risk={value} /> },
    { key: 'screenings', header: 'Screenings' },
    { key: 'alerts', header: 'Alerts' },
    { key: 'currentStatus', header: 'Current Status', render: (value) => <DemoStatusBadge status={value} /> },
  ];

  const selectedScreenings = selectedPassenger
    ? screenings.filter((screening) => screening.passengerId === selectedPassenger.id)
    : [];
  const selectedAlerts = selectedPassenger
    ? alerts.filter((alert) => alert.passengerId === selectedPassenger.id)
    : [];
  const historyColumns = [
    { key: 'timestamp', header: 'Date' },
    { key: 'checkpointId', header: 'Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'document', header: 'Document' },
    { key: 'risk', header: 'Risk', render: (value) => <RiskBadge risk={value} /> },
    { key: 'score', header: 'Score' },
    { key: 'result', header: 'Result', render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'officerId', header: 'Officer Decision', render: (value) => officerName(officers, value) },
  ];
  const alertColumns = [
    { key: 'title', header: 'Alert' },
    { key: 'severity', header: 'Severity', render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'status', header: 'Status', render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'created', header: 'Time' },
  ];

  return (
    <>
      <PageHeader
        title="Passenger Intelligence"
        description="Search and inspect fictional passenger screening intelligence."
        actions={<Button variant="outline" onClick={() => navigate('/admin/history')}>Open System History</Button>}
      />
      <DemoNotice />
      <Card title="Passenger Search">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SearchInput label="Search" placeholder="Passenger ID, document, nationality, checkpoint, date, risk" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Cleared', 'Under Review', 'Referred'].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Document Type" value={filters.documentType} onChange={(event) => setFilters({ ...filters, documentType: event.target.value })} options={['All', 'Passport', 'Visa', 'Crew ID'].map((value) => ({ value, label: value }))} />
          <Select label="Date Range" value={filters.dateRange} onChange={(event) => setFilters({ ...filters, dateRange: event.target.value })} options={['All', 'Today', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Passenger Table">
        <DataTable caption="Passenger intelligence table" rowKey="id" columns={columns} data={filtered} />
      </Card>
      {selectedPassenger && (
        <div className="space-y-6">
          <PageHeader title={selectedPassenger.displayName} description={`${selectedPassenger.passengerId} · Fictional detailed intelligence view`} />
          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Passenger Detail">
              <DetailGrid
                items={[
                  { label: 'Passenger ID', value: selectedPassenger.passengerId },
                  { label: 'Nationality', value: selectedPassenger.nationality },
                  { label: 'Date of Birth', value: selectedPassenger.dateOfBirth },
                  { label: 'Document Type', value: selectedPassenger.documentType },
                  { label: 'Document Number', value: selectedPassenger.documentNumber },
                  { label: 'Document Expiry', value: selectedPassenger.documentExpiry },
                  { label: 'Current Risk', value: <RiskBadge risk={selectedPassenger.risk} /> },
                  { label: 'Risk Score', value: selectedPassenger.riskScore },
                  { label: 'Current Status', value: <DemoStatusBadge status={selectedPassenger.currentStatus} /> },
                ]}
              />
            </Card>
            <Card title="Identity Intelligence">
              <DetailGrid
                items={[
                  { label: 'Identity Match', value: <DemoStatusBadge status={selectedPassenger.identity.identityMatch} /> },
                  { label: 'Document Match', value: <DemoStatusBadge status={selectedPassenger.identity.documentMatch} /> },
                  { label: 'Face Verification', value: <DemoStatusBadge status={selectedPassenger.identity.faceVerification} /> },
                  { label: 'MRZ Validation', value: <DemoStatusBadge status={selectedPassenger.identity.mrzValidation} /> },
                  { label: 'Database Cross-Verification', value: <DemoStatusBadge status={selectedPassenger.identity.databaseCrossVerification} /> },
                ]}
              />
            </Card>
          </div>
          <Card title="Screening History">
            <DataTable caption="Passenger screening history" rowKey="id" columns={historyColumns} data={selectedScreenings} />
          </Card>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Document History">
              <DetailGrid
                items={[
                  { label: 'Document Type', value: selectedPassenger.documentType },
                  { label: 'Document Number', value: selectedPassenger.documentNumber },
                  { label: 'Issue Date', value: selectedPassenger.issueDate },
                  { label: 'Expiry', value: selectedPassenger.documentExpiry },
                  { label: 'Validation', value: <DemoStatusBadge status={selectedPassenger.documentStatus} /> },
                  { label: 'Tampering Result', value: selectedPassenger.documentStatus === 'Failed' ? 'Flagged' : 'Not detected' },
                ]}
              />
            </Card>
            <Card title="Alert History">
              <DataTable caption="Passenger alert history" rowKey="id" columns={alertColumns} data={selectedAlerts} />
            </Card>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Decision History">
              <DetailGrid
                items={selectedScreenings.map((screening) => ({
                  label: `${screening.result} · ${screening.timestamp}`,
                  value: `${officerName(officers, screening.officerId)} at ${checkpointName(checkpoints, screening.checkpointId)} · ${screening.action}`,
                }))}
              />
            </Card>
            <Card title="Audit Trail">
              <DetailGrid
                items={[
                  { label: '10:18 Admin Demo User', value: 'Opened intelligence record · Success' },
                  { label: '10:12 Screening Engine', value: 'Generated fictional risk result · Success' },
                  { label: '10:08 Duty Officer', value: 'Recorded local decision state · Success' },
                ]}
              />
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
