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
import { useDutyData } from '../../../features/duty/DutyDataContext';
import { nextSort, sortRows } from '../../../features/duty/dutyHelpers';
import {
  DetailGrid,
  DutyDemoNotice,
  DutyRiskBadge,
  DutyStatusBadge,
  KpiGrid,
} from '../../../features/duty/dutyUi';

export default function DutyPassengerHistoryPage() {
  const navigate = useNavigate();
  const { passengerHistory } = useDutyData();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'screenedAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    risk: 'All',
    status: 'All',
    documentType: 'All',
    date: 'Today',
    outcome: 'All',
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = passengerHistory.filter(
      (row) =>
        [row.passengerId, row.documentRef, row.nationality].some((value) =>
          value.toLowerCase().includes(term),
        ) &&
        (filters.risk === 'All' || row.risk === filters.risk) &&
        (filters.status === 'All' || row.status === filters.status) &&
        (filters.documentType === 'All' || row.documentType === filters.documentType) &&
        (filters.outcome === 'All' || row.outcome === filters.outcome),
    );
    return sortRows(filtered, sort);
  }, [filters, passengerHistory, search, sort]);

  const columns = [
    { key: 'passengerId', header: 'Passenger ID', sortable: true, render: (_, row) => <Button size="small" variant="ghost" onClick={() => setSelected(row)}>{row.passengerId}</Button> },
    { key: 'nationality', header: 'Nationality', sortable: true },
    { key: 'documentType', header: 'Document Type', sortable: true },
    { key: 'checkpoint', header: 'Checkpoint' },
    { key: 'screenedAt', header: 'Screened At', sortable: true },
    { key: 'risk', header: 'Risk', sortable: true, render: (value) => <DutyRiskBadge risk={value} /> },
    { key: 'outcome', header: 'Outcome', sortable: true, render: (value) => <DutyStatusBadge status={value} /> },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="outline" onClick={() => setSelected(row)}>Inspect</Button>
          {row.passengerId === 'PAX-DEMO-1029' && (
            <Button size="small" onClick={() => navigate(`/duty-officer/passengers/${row.passengerId}`)}>Open Detail</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Passenger History"
        eyebrow="Duty / Border Officer"
        description="Review previous passenger screening activity"
      />
      <DutyDemoNotice />
      <KpiGrid>
        <MetricCard label="Passengers Processed" value={1284} />
        <MetricCard label="Cleared" value={1241} tone="success" />
        <MetricCard label="Referred" value={31} tone="warning" />
        <MetricCard label="High Risk" value={12} tone="danger" />
        <MetricCard label="Recent Screenings" value={passengerHistory.length} tone="info" />
      </KpiGrid>
      <Card title="History Search and Filters">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SearchInput label="Search history" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Passenger ID, masked document, nationality" />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'LOW', 'MEDIUM', 'HIGH', 'PENDING'].map((value) => ({ value, label: value }))} />
          <Select label="Screening Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={['All', 'Completed', 'Review Required', 'Referred', 'In Progress'].map((value) => ({ value, label: value }))} />
          <Select label="Document Type" value={filters.documentType} onChange={(event) => setFilters({ ...filters, documentType: event.target.value })} options={['All', 'Passport', 'National ID', 'Driving License', 'Visa / Travel Authorization'].map((value) => ({ value, label: value }))} />
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
          <Select label="Screening Outcome" value={filters.outcome} onChange={(event) => setFilters({ ...filters, outcome: event.target.value })} options={['All', 'Cleared', 'Officer Review', 'Manual Review', 'Referred', 'Pending'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Checkpoint Passenger History" description="Fictional operational history for the current checkpoint.">
        <DataTable
          caption="Duty officer passenger history"
          rowKey="id"
          columns={columns}
          data={rows}
          sort={sort}
          onSort={(key) => setSort((current) => nextSort(current, key))}
          emptyTitle="No passenger history found"
          emptyDescription="Adjust search or filters to find checkpoint-level records."
        />
      </Card>
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.passengerId}
        description={selected?.screeningId}
        footer={
          selected?.passengerId === 'PAX-DEMO-1029' && (
            <Button onClick={() => navigate(`/duty-officer/passengers/${selected.passengerId}`)}>
              Open Existing Passenger Detail
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <DetailGrid
              items={[
                { label: 'Passenger ID', value: selected.passengerId },
                { label: 'Nationality', value: selected.nationality },
                { label: 'Document Type', value: selected.documentType },
                { label: 'Screening Status', value: <DutyStatusBadge status={selected.status} /> },
                { label: 'Risk Level', value: <DutyRiskBadge risk={selected.risk} /> },
                { label: 'Decision / Outcome', value: selected.decision },
                { label: 'Document Verification', value: <DutyStatusBadge status={selected.verification.document} /> },
                { label: 'MRZ Status', value: <DutyStatusBadge status={selected.verification.mrz} /> },
                { label: 'Face Verification', value: <DutyStatusBadge status={selected.verification.face} /> },
                { label: 'Identity Summary', value: <DutyStatusBadge status={selected.verification.identity} /> },
              ]}
            />
            <Card title="Screening Timeline">
              <ol className="space-y-2 text-body">{selected.timeline.map((item) => <li key={item}>{item}</li>)}</ol>
            </Card>
            <Card title="Previous Screening Events">
              <ul className="space-y-2 text-body">{selected.previousEvents.map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
