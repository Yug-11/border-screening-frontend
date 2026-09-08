import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { checkpointName, nextSort, officerName, passengerName, sortRows } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  DemoStatusBadge,
  RiskBadge,
} from '../../../features/admin/adminUtils';

export default function PassengerHistoryPage() {
  const navigate = useNavigate();
  const { checkpoints, officers, passengers, screenings } = useAdminData();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'timestamp', direction: 'desc' });
  const [filters, setFilters] = useState({
    date: 'Today',
    checkpoint: 'All',
    risk: 'All',
    document: 'All',
    result: 'All',
    officer: 'All',
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = screenings.filter((screening) => {
      const passenger = passengerName(passengers, screening.passengerId);
      return (
        [screening.timestamp, passenger, checkpointName(checkpoints, screening.checkpointId), screening.document, screening.risk, screening.result, officerName(officers, screening.officerId)].some((value) =>
          String(value).toLowerCase().includes(term),
        ) &&
        (filters.checkpoint === 'All' || screening.checkpointId === filters.checkpoint) &&
        (filters.risk === 'All' || screening.risk === filters.risk) &&
        (filters.document === 'All' || screening.document === filters.document) &&
        (filters.result === 'All' || screening.result === filters.result) &&
        (filters.officer === 'All' || screening.officerId === filters.officer)
      );
    });
    return sortRows(filtered, sort, {
      passenger: (row) => passengerName(passengers, row.passengerId),
      checkpoint: (row) => checkpointName(checkpoints, row.checkpointId),
      officer: (row) => officerName(officers, row.officerId),
    });
  }, [checkpoints, filters, officers, passengers, screenings, search, sort]);

  const columns = [
    { key: 'timestamp', header: 'Timestamp', sortable: true },
    { key: 'passengerId', header: 'Passenger', sortable: true, render: (value) => <Button size="small" variant="ghost" onClick={() => navigate(`/admin/passengers?passenger=${value}`)}>{passengerName(passengers, value)}</Button> },
    { key: 'checkpointId', header: 'Checkpoint', sortable: true, render: (value) => checkpointName(checkpoints, value) },
    { key: 'document', header: 'Document', sortable: true },
    { key: 'risk', header: 'Risk', sortable: true, render: (value) => <RiskBadge risk={value} /> },
    { key: 'score', header: 'Score', sortable: true },
    { key: 'result', header: 'Result', sortable: true, render: (value) => <DemoStatusBadge status={value} /> },
    { key: 'officerId', header: 'Officer', sortable: true, render: (value) => officerName(officers, value) },
    { key: 'action', header: 'Action' },
  ];

  return (
    <>
      <PageHeader title="Passenger Screening History" description="System-wide fictional historical screening activity." />
      <DemoNotice />
      <Card title="History Filters">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
          <SearchInput label="Search history" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Passenger, checkpoint, document, officer" />
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} />
          <Select label="Document Type" value={filters.document} onChange={(event) => setFilters({ ...filters, document: event.target.value })} options={['All', 'Passport', 'Visa', 'Crew ID'].map((value) => ({ value, label: value }))} />
          <Select label="Screening Result" value={filters.result} onChange={(event) => setFilters({ ...filters, result: event.target.value })} options={['All', 'Cleared', 'Referred', 'Under Review'].map((value) => ({ value, label: value }))} />
          <Select label="Officer" value={filters.officer} onChange={(event) => setFilters({ ...filters, officer: event.target.value })} options={[{ value: 'All', label: 'All' }, ...officers.map((officer) => ({ value: officer.id, label: officer.name }))]} />
        </div>
      </Card>
      <Card title="Historical Screening Activity">
        <DataTable
          caption="System screening history"
          rowKey="id"
          columns={columns}
          data={rows}
          sort={sort}
          onSort={(key) => setSort((current) => nextSort(current, key))}
        />
      </Card>
    </>
  );
}
