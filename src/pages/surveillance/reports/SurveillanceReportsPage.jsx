import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import Select from '../../../components/ui/Select';
import MetricCard from '../../../components/data-display/MetricCard';
import { useSurveillanceData } from '../../../features/surveillance/SurveillanceDataContext';
import {
  checkpointName,
  downloadCsv,
  toCsv,
} from '../../../features/surveillance/surveillanceHelpers';
import {
  KpiGrid,
  MiniBar,
  SurveillanceDemoNotice,
  SurveillanceRiskBadge,
} from '../../../features/surveillance/surveillanceUi';

const categories = ['Checkpoint Performance', 'Passenger Screening', 'Risk Activity', 'Alert Activity', 'Officer Operations', 'System Health'];

export default function SurveillanceReportsPage() {
  const { checkpoints, officers, alerts, reportTrend } = useSurveillanceData();
  const [category, setCategory] = useState('Checkpoint Performance');
  const [filters, setFilters] = useState({ date: 'Today', checkpoint: 'All' });
  const checkpointRows = checkpoints
    .filter((checkpoint) => filters.checkpoint === 'All' || checkpoint.id === filters.checkpoint)
    .map((checkpoint) => ({
      id: checkpoint.id,
      checkpoint: checkpoint.name,
      passengers: checkpoint.throughput * 520,
      avgThroughput: `${checkpoint.throughput}/min`,
      avgQueue: Math.round(checkpoint.queue * 0.74),
      highRisk: checkpoint.highRisk,
      alerts: alerts.filter((alert) => alert.checkpointId === checkpoint.id).length,
      officers: checkpoint.officersOnDuty,
      systemHealth: `${checkpoint.health}%`,
    }));
  const officerRows = officers.map((officer) => ({
    id: officer.id,
    officer: officer.name,
    checkpoint: checkpointName(checkpoints, officer.checkpointId),
    casesHandled: Math.max(8, Math.round(officer.workload / 2)),
    referrals: Math.max(1, Math.round(officer.currentCases * 0.6)),
    avgResponse: `${Math.max(4, 18 - Math.round(officer.workload / 10))} min`,
    workload: `${officer.workload}%`,
  }));

  function exportCsv() {
    const content = toCsv(checkpointRows, [
      { header: 'Checkpoint', value: (row) => row.checkpoint },
      { header: 'Passengers', value: (row) => row.passengers },
      { header: 'Avg Throughput', value: (row) => row.avgThroughput },
      { header: 'Avg Queue', value: (row) => row.avgQueue },
      { header: 'High Risk', value: (row) => row.highRisk },
      { header: 'Alerts', value: (row) => row.alerts },
      { header: 'Officers', value: (row) => row.officers },
      { header: 'System Health', value: (row) => row.systemHealth },
    ]);
    downloadCsv('surveillance-demo-report.csv', content);
  }

  return (
    <>
      <PageHeader title="Reports" description="Operational reporting for checkpoint surveillance and investigation." actions={<Button onClick={exportCsv}>Export CSV</Button>} />
      <SurveillanceDemoNotice />
      <Card title="Report Categories">
        <div className="flex flex-wrap gap-2">{categories.map((item) => <Button key={item} size="small" variant={category === item ? 'primary' : 'outline'} onClick={() => setCategory(item)}>{item}</Button>)}</div>
      </Card>
      <Card title="Report Filters">
        <div className="grid gap-3 md:grid-cols-2">
          <Select label="Date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom'].map((value) => ({ value, label: value }))} />
          <Select label="Checkpoint" value={filters.checkpoint} onChange={(event) => setFilters({ ...filters, checkpoint: event.target.value })} options={[{ value: 'All', label: 'All' }, ...checkpoints.map((checkpoint) => ({ value: checkpoint.id, label: checkpoint.name }))]} />
        </div>
      </Card>
      <KpiGrid>
        <MetricCard label="Passengers Screened" value={18426} />
        <MetricCard label="Low Risk" value={17920} tone="success" />
        <MetricCard label="Medium Risk" value={46} tone="warning" />
        <MetricCard label="High Risk" value={12} tone="danger" />
        <MetricCard label="Referrals" value={23} tone="warning" />
        <MetricCard label="Average Screening Time" value="42 sec" />
        <MetricCard label="Average Queue" value={27} />
        <MetricCard label="Alerts Generated" value={alerts.length} tone="info" />
      </KpiGrid>
      <Card title="Checkpoint Performance">
        <DataTable caption="Checkpoint performance report" rowKey="id" columns={[
          { key: 'checkpoint', header: 'Checkpoint' },
          { key: 'passengers', header: 'Passengers' },
          { key: 'avgThroughput', header: 'Avg Throughput' },
          { key: 'avgQueue', header: 'Avg Queue' },
          { key: 'highRisk', header: 'High Risk' },
          { key: 'alerts', header: 'Alerts' },
          { key: 'officers', header: 'Officers' },
          { key: 'systemHealth', header: 'System Health' },
        ]} data={checkpointRows} />
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Risk Report">
          <div className="space-y-3">
            <MiniBar label="Low" value={17920} max={18426} variant="success" />
            <MiniBar label="Medium" value={46} max={100} variant="warning" />
            <MiniBar label="High" value={12} max={100} variant="danger" />
          </div>
          <div className="mt-4 space-y-2">
            {reportTrend.map((point) => <div key={point.time} className="grid grid-cols-[4rem_1fr] gap-3 rounded-control border border-default bg-canvas p-2"><span className="font-semibold">{point.time}</span><span><SurveillanceRiskBadge risk="Low" /> {point.low} <SurveillanceRiskBadge risk="Medium" /> {point.medium} <SurveillanceRiskBadge risk="High" /> {point.high}</span></div>)}
          </div>
        </Card>
        <Card title="Passenger Screening Volume">
          <div className="space-y-3">{reportTrend.map((point) => <MiniBar key={point.time} label={point.time} value={point.passengers} max={5680} variant="info" />)}</div>
        </Card>
      </div>
      <Card title="Officer Operations">
        <DataTable caption="Officer operations report" rowKey="id" columns={[
          { key: 'officer', header: 'Officer' },
          { key: 'checkpoint', header: 'Checkpoint' },
          { key: 'casesHandled', header: 'Cases Handled' },
          { key: 'referrals', header: 'Referrals' },
          { key: 'avgResponse', header: 'Avg Response' },
          { key: 'workload', header: 'Workload' },
        ]} data={officerRows} />
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Alert Activity">
          <KpiGrid>
            <MetricCard label="Alerts Generated" value={alerts.length} />
            <MetricCard label="Alerts Resolved" value={alerts.filter((alert) => alert.status === 'Resolved').length} tone="success" />
            <MetricCard label="Critical" value={alerts.filter((alert) => alert.severity === 'Critical').length} tone="danger" />
          </KpiGrid>
        </Card>
        <Card title="System Health">
          <KpiGrid>
            <MetricCard label="Network Health" value="98.7%" tone="success" />
            <MetricCard label="Degraded Services" value={2} tone="warning" />
          </KpiGrid>
        </Card>
        <Card title="Selected Category">
          <p className="text-body text-muted">{category} report is filtered by {filters.date} and {filters.checkpoint === 'All' ? 'all checkpoints' : checkpointName(checkpoints, filters.checkpoint)}.</p>
        </Card>
      </div>
    </>
  );
}
