import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import PageHeader from '../../../components/ui/PageHeader';
import Select from '../../../components/ui/Select';
import Tabs from '../../../components/ui/Tabs';
import MetricCard from '../../../components/data-display/MetricCard';
import { useDutyData } from '../../../features/duty/DutyDataContext';
import { downloadCsv, toCsv } from '../../../features/duty/dutyHelpers';
import {
  DutyDemoNotice,
  DutyStatusBadge,
  KpiGrid,
  MiniBar,
} from '../../../features/duty/dutyUi';

export default function DutyReportsPage() {
  const { alerts, passengerHistory, reportTrend } = useDutyData();
  const [date, setDate] = useState('Today');
  const screeningRows = reportTrend.map((row) => ({
    id: row.label,
    period: row.label,
    totalScreened: row.screened,
    completed: row.low + row.medium,
    inProgress: Math.max(1, Math.round(row.queue / 3)),
    referred: row.medium + row.high,
    averageScreeningTime: `${38 + row.high * 2} sec`,
  }));
  const alertRows = ['High-risk passenger', 'Document tampering suspected', 'Identity mismatch', 'Screening failure', 'Checkpoint system warning'].map((type) => {
    const matching = alerts.filter((alert) => alert.type === type);
    return {
      id: type,
      type,
      count: matching.length,
      open: matching.filter((alert) => alert.status === 'Open').length,
      acknowledged: matching.filter((alert) => alert.status === 'Acknowledged').length,
      resolved: matching.filter((alert) => alert.status === 'Resolved').length,
    };
  });

  function exportCsv() {
    const content = toCsv(screeningRows, [
      { header: 'Period', value: (row) => row.period },
      { header: 'Total Screened', value: (row) => row.totalScreened },
      { header: 'Completed', value: (row) => row.completed },
      { header: 'In Progress', value: (row) => row.inProgress },
      { header: 'Referred', value: (row) => row.referred },
      { header: 'Average Screening Time', value: (row) => row.averageScreeningTime },
    ]);
    downloadCsv('duty-officer-checkpoint-report.csv', content);
  }

  const tabs = [
    {
      id: 'screening',
      label: 'Screening Summary',
      content: (
        <Card title="Screening Summary" description="Checkpoint screening volume by operational period.">
          <DataTable caption="Screening summary report" rowKey="id" columns={[
            { key: 'period', header: 'Period' },
            { key: 'totalScreened', header: 'Total Screened' },
            { key: 'completed', header: 'Completed' },
            { key: 'inProgress', header: 'In Progress' },
            { key: 'referred', header: 'Referred' },
            { key: 'averageScreeningTime', header: 'Average Screening Time' },
          ]} data={screeningRows} />
        </Card>
      ),
    },
    {
      id: 'risk',
      label: 'Risk Activity',
      content: (
        <Card title="Risk Activity">
          <div className="space-y-3">
            <MiniBar label="Low Risk" value={1241} max={1284} variant="success" />
            <MiniBar label="Medium Risk" value={31} max={80} variant="warning" />
            <MiniBar label="High Risk" value={12} max={80} variant="danger" />
          </div>
          <div className="mt-5 space-y-3">
            {reportTrend.map((row) => (
              <div key={row.label} className="rounded-control border border-default bg-canvas p-3">
                <p className="font-semibold text-navy">{row.label}</p>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  <MiniBar label="Low" value={row.low} max={250} variant="success" />
                  <MiniBar label="Medium" value={row.medium} max={20} variant="warning" />
                  <MiniBar label="High" value={row.high} max={10} variant="danger" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ),
    },
    {
      id: 'alerts',
      label: 'Alert Activity',
      content: (
        <Card title="Alert Activity">
          <DataTable caption="Alert activity report" rowKey="id" columns={[
            { key: 'type', header: 'Alert Type' },
            { key: 'count', header: 'Count' },
            { key: 'open', header: 'Open' },
            { key: 'acknowledged', header: 'Acknowledged' },
            { key: 'resolved', header: 'Resolved' },
          ]} data={alertRows} />
        </Card>
      ),
    },
    {
      id: 'operations',
      label: 'Operational Performance',
      content: (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Operational Performance">
            <KpiGrid>
              <MetricCard label="Passenger Throughput" value="38/min" tone="info" />
              <MetricCard label="Average Screening Time" value="42 sec" />
              <MetricCard label="Queue Volume" value={18} tone="warning" />
              <MetricCard label="Officer Workload" value="72%" tone="warning" />
              <MetricCard label="System Status" value="Operational" tone="success" />
            </KpiGrid>
          </Card>
          <Card title="Queue Volume">
            <div className="space-y-3">{reportTrend.map((row) => <MiniBar key={row.label} label={row.label} value={row.queue} max={25} variant="info" />)}</div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Reports"
        eyebrow="Duty / Border Officer"
        description="Review checkpoint screening and operational performance"
        actions={<Button onClick={exportCsv}>Export CSV</Button>}
      />
      <DutyDemoNotice />
      <Card title="Report Filter">
        <Select label="Date" value={date} onChange={(event) => setDate(event.target.value)} options={['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom'].map((value) => ({ value, label: value }))} />
      </Card>
      <KpiGrid>
        <MetricCard label="Passengers Screened" value={1284} />
        <MetricCard label="Low Risk" value={1241} tone="success" />
        <MetricCard label="Medium Risk" value={31} tone="warning" />
        <MetricCard label="High Risk" value={12} tone="danger" />
        <MetricCard label="Referrals" value={43} tone="warning" />
        <MetricCard label="Cleared" value={1241} tone="success" />
        <MetricCard label="Average Screening Time" value="42 sec" />
        <MetricCard label="Alerts" value={alerts.length} tone="info" />
      </KpiGrid>
      <Card title={`Checkpoint Report · ${date}`}>
        <Tabs items={tabs} label="Duty officer report sections" />
      </Card>
      <Card title="Recent Report Records">
        <DataTable caption="Recent report records" rowKey="id" columns={[
          { key: 'passengerId', header: 'Passenger ID' },
          { key: 'screenedAt', header: 'Screened At' },
          { key: 'risk', header: 'Risk', render: (value) => <DutyStatusBadge status={value} /> },
          { key: 'outcome', header: 'Outcome', render: (value) => <DutyStatusBadge status={value} /> },
        ]} data={passengerHistory.slice(0, 5)} />
      </Card>
    </>
  );
}
