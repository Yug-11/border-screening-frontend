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
import { surveillanceStages } from '../../../data/mockSurveillanceData';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import {
  checkpointName,
  passengerById,
} from '../../../features/surveillance/surveillanceHelpers';
import {
  DetailGrid,
  KpiGrid,
  ProgressIndicator,
  SurveillanceDemoNotice,
  SurveillanceRiskBadge,
  SurveillanceStatusBadge,
} from '../../../features/surveillance/surveillanceUi';

export default function LiveScreeningPage() {
  const navigate = useNavigate();
  const { checkpoints, passengers, screenings } = useSurveillanceData();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ checkpoint: 'All', status: 'All', risk: 'All', stage: 'All' });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return screenings.filter(
      (screening) =>
        screening.passengerId.toLowerCase().includes(term) &&
        (filters.checkpoint === 'All' || screening.checkpointId === filters.checkpoint) &&
        (filters.status === 'All' || screening.status === filters.status) &&
        (filters.risk === 'All' || screening.risk === filters.risk) &&
        (filters.stage === 'All' || screening.currentStage === filters.stage),
    );
  }, [filters, screenings, search]);

  const columns = [
    { key: 'passengerId', header: 'Passenger ID', render: (_, row) => <Button size="small" variant="ghost" onClick={() => setSelected(row)}>{row.passengerId}</Button> },
    { key: 'checkpointId', header: 'Checkpoint', render: (value) => checkpointName(checkpoints, value) },
    { key: 'document', header: 'Document' },
    { key: 'currentStage', header: 'Current Stage' },
    { key: 'progress', header: 'Progress', render: (value) => <ProgressIndicator value={value} /> },
    { key: 'risk', header: 'Risk', render: (value) => <SurveillanceRiskBadge risk={value} /> },
    { key: 'started', header: 'Started' },
    { key: 'elapsed', header: 'Elapsed' },
    { key: 'status', header: 'Status', render: (value) => <SurveillanceStatusBadge status={value} /> },
  ];

  return (
    <>
      <PageHeader title="Live Screening" description="Monitor automated passenger screening across assigned checkpoints." />
      <SurveillanceDemoNotice />
      <KpiGrid>
        <MetricCard label="Active Screenings" value={screenings.filter((item) => item.status === 'In Progress').length + screenings.filter((item) => item.status === 'Flagged').length} tone="info" />
        <MetricCard label="Screening Throughput" value="142/min" tone="info" />
        <MetricCard label="Completed Screenings" value={screenings.filter((item) => item.status === 'Completed').length} tone="success" />
        <MetricCard label="Flagged Screenings" value={screenings.filter((item) => item.status === 'Flagged').length} tone="warning" />
        <MetricCard label="Failed Screenings" value={screenings.filter((item) => item.status === 'Failed').length} tone="danger" />
      </KpiGrid>
      <Card title="Screening Filters">
        <div className="grid gap-3 md:grid-cols-5">
          <SearchInput label="Search passenger" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Passenger ID" />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Queued', 'In Progress', 'Completed', 'Flagged', 'Failed'].map((value) => ({ value, label: value }))} />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} />
          <Select label="Screening Stage" value={filters.stage} onChange={(event) => setFilters({ ...filters, stage: event.target.value })} options={['All', 'Completed', ...surveillanceStages].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Live Screening Sessions" description="Surveillance view only. Stages are not manually executed here.">
        <DataTable caption="Live screening sessions" rowKey="id" columns={columns} data={rows} emptyTitle="No active screenings" emptyDescription="Adjust filters to view demo screening sessions." />
      </Card>
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.passengerId}
        description={selected ? `${checkpointName(checkpoints, selected.checkpointId)} · ${selected.id}` : undefined}
        footer={selected && <Button onClick={() => navigate(`/surveillance/passengers/${selected.passengerId}`)}>View Passenger</Button>}
      >
        {selected && (
          <div className="space-y-4">
            <DetailGrid items={[
              { label: 'Passenger ID', value: selected.passengerId },
              { label: 'Checkpoint', value: checkpointName(checkpoints, selected.checkpointId) },
              { label: 'Current Stage', value: selected.currentStage },
              { label: 'Progress', value: <ProgressIndicator value={selected.progress} /> },
              { label: 'Risk Status', value: <SurveillanceRiskBadge risk={selected.risk} /> },
              { label: 'Started', value: selected.started },
              { label: 'Elapsed', value: selected.elapsed },
              { label: 'Referral Status', value: selected.referralStatus },
            ]} />
            <Card title="Completed Stages">
              <ul className="space-y-1 text-body">{selected.completedStages.map((stage) => <li key={stage}>✓ {stage}</li>)}</ul>
            </Card>
            <Card title="Failed Stages">
              {selected.failedStages.length ? <ul className="space-y-1 text-body">{selected.failedStages.map((stage) => <li key={stage}>{stage}</li>)}</ul> : <p className="text-body text-muted">No failed stages in this fictional screening session.</p>}
            </Card>
            <Card title="Passenger Summary">
              <DetailGrid items={[
                { label: 'Nationality', value: passengerById(passengers, selected.passengerId)?.nationality },
                { label: 'Document Type', value: passengerById(passengers, selected.passengerId)?.documentType },
                { label: 'Screening Status', value: <SurveillanceStatusBadge status={selected.status} /> },
              ]} />
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
