import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { passengerVolume, riskTrend } from '../../../data/mockAdminData';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { checkpointName } from '../../../features/admin/adminHelpers';
import {
  DemoNotice,
  KpiGrid,
  MiniBar,
  RiskBadge,
} from '../../../features/admin/adminUtils';

const categories = [
  'Passenger Screening',
  'Risk',
  'Checkpoint Performance',
  'Officer Performance',
  'Document Validation',
  'System Health',
  'Alerts',
];

export default function AdminReportsPage() {
  const { checkpoints, officers } = useAdminData();
  const [filters, setFilters] = useState({
    date: 'Today',
    checkpoint: 'All',
    risk: 'All',
    document: 'All',
    officer: 'All',
  });
  const [category, setCategory] = useState('Passenger Screening');
  const checkpointRows = checkpoints.map((checkpoint) => ({
    id: checkpoint.id,
    checkpoint: checkpoint.name,
    passengers: checkpoint.passengersToday,
    averageQueue: Math.max(4, Math.round(checkpoint.currentQueue * 0.7)),
    averageScreeningTime: `${38 + (checkpoint.highRisk * 4)} sec`,
    highRisk: checkpoint.highRisk,
    systemHealth: `${checkpoint.systemHealth}%`,
  }));
  const officerRows = officers.slice(0, 8).map((officer) => ({
    id: officer.id,
    officer: officer.name,
    casesHandled: officer.casesToday,
    casesReferred: Math.max(1, Math.round(officer.casesToday * 0.12)),
    casesResolved: Math.max(1, officer.casesToday - officer.pendingReviews),
    pendingReviews: officer.pendingReviews,
    averageReviewTime: `${8 + officer.pendingReviews} min`,
  }));

  return (
    <>
      <PageHeader title="Reports" description="Fictional operational reporting dashboard with local filters." actions={<Button variant="outline">Export Demo Report</Button>} />
      <DemoNotice />
      <Card title="Report Categories">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Button key={item} variant={category === item ? 'primary' : 'outline'} size="small" onClick={() => setCategory(item)}>{item}</Button>
          ))}
        </div>
      </Card>
      <Card title="Report Filters">
        <div className="grid gap-3 md:grid-cols-5">
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom'].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
          <Select label="Risk" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })} options={['All', 'Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} />
          <Select label="Document Type" value={filters.document} onChange={(event) => setFilters({ ...filters, document: event.target.value })} options={['All', 'Passport', 'Visa', 'Crew ID'].map((value) => ({ value, label: value }))} />
          <Select label="Officer" value={filters.officer} onChange={(event) => setFilters({ ...filters, officer: event.target.value })} options={[{ value: 'All', label: 'All' }, ...officers.map((officer) => ({ value: officer.id, label: officer.name }))]} />
        </div>
      </Card>
      <KpiGrid>
        <MetricCard label="Passengers Screened" value={18426} />
        <MetricCard label="Low Risk" value={17920} tone="success" />
        <MetricCard label="Medium Risk" value={46} tone="warning" />
        <MetricCard label="High Risk" value={12} tone="danger" />
        <MetricCard label="Referrals" value={23} tone="warning" />
        <MetricCard label="Cleared" value={18391} tone="success" />
      </KpiGrid>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Passenger Screening Report">
          <KpiGrid>
            <MetricCard label="Total Screened" value={18426} />
            <MetricCard label="Cleared" value={18391} tone="success" />
            <MetricCard label="Referred" value={23} tone="warning" />
            <MetricCard label="Average Screening Time" value="42 sec" />
            <MetricCard label="Peak Volume" value="142/min" tone="info" />
          </KpiGrid>
          <div className="mt-4 space-y-3">
            {checkpoints.slice(0, 6).map((checkpoint) => <MiniBar key={checkpoint.id} label={checkpoint.name} value={checkpoint.passengersToday} max={5000} variant="info" />)}
          </div>
        </Card>
        <Card title="Risk Report">
          <div className="space-y-3">
            <MiniBar label="Low" value={17920} max={18426} variant="success" />
            <MiniBar label="Medium" value={46} max={100} variant="warning" />
            <MiniBar label="High" value={12} max={100} variant="danger" />
          </div>
          <div className="mt-4 space-y-2">
            {riskTrend.map((point) => (
              <div key={point.time} className="rounded-control border border-default bg-canvas p-2">
                <span className="font-semibold text-navy">{point.time}</span>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <RiskBadge risk="Low" /> <span>{point.low}</span>
                  <RiskBadge risk="Medium" /> <span>{point.medium}</span>
                  <RiskBadge risk="High" /> <span>{point.high}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Checkpoint Performance">
        <DataTable caption="Checkpoint performance report" rowKey="id" columns={[
          { key: 'checkpoint', header: 'Checkpoint' },
          { key: 'passengers', header: 'Passengers' },
          { key: 'averageQueue', header: 'Average Queue' },
          { key: 'averageScreeningTime', header: 'Average Screening Time' },
          { key: 'highRisk', header: 'High Risk' },
          { key: 'systemHealth', header: 'System Health' },
        ]} data={checkpointRows} />
      </Card>
      <Card title="Officer Performance">
        <DataTable caption="Officer performance report" rowKey="id" columns={[
          { key: 'officer', header: 'Officer' },
          { key: 'casesHandled', header: 'Cases Handled' },
          { key: 'casesReferred', header: 'Cases Referred' },
          { key: 'casesResolved', header: 'Cases Resolved' },
          { key: 'pendingReviews', header: 'Pending Reviews' },
          { key: 'averageReviewTime', header: 'Average Review Time' },
        ]} data={officerRows} />
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Document Report">
          <KpiGrid>
            <MetricCard label="Valid Documents" value={18102} tone="success" />
            <MetricCard label="Invalid Documents" value={41} tone="danger" />
            <MetricCard label="MRZ Failures" value={28} tone="warning" />
            <MetricCard label="Tampering Flags" value={9} tone="danger" />
            <MetricCard label="Face Verification Failures" value={15} tone="warning" />
          </KpiGrid>
        </Card>
        <Card title="Alert Report">
          <KpiGrid>
            <MetricCard label="Total Alerts" value={8} />
            <MetricCard label="Critical" value={2} tone="danger" />
            <MetricCard label="Warning" value={3} tone="warning" />
            <MetricCard label="Resolved" value={1} tone="success" />
            <MetricCard label="Average Resolution Time" value="18 min" />
          </KpiGrid>
        </Card>
        <Card title="System Health Report">
          <div className="space-y-3">
            {passengerVolume.map((point) => <MiniBar key={point.time} label={point.time} value={point.passengers} max={5680} variant="info" />)}
          </div>
          <p className="mt-3 text-caption text-muted">Selected checkpoint: {filters.checkpoint === 'All' ? 'All' : checkpointName(checkpoints, filters.checkpoint)}</p>
        </Card>
      </div>
    </>
  );
}
