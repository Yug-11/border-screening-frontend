import {
  CircleCheck,
  MapPin,
  ScanLine,
  ShieldAlert,
  Timer,
  TriangleAlert,
  UsersRound,
} from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import Badge from '../../../components/ui/Badge';
import MetricCard from '../../../components/data-display/MetricCard';
import ScreeningQueue from '../../../features/screening/components/ScreeningQueue';
import ActiveScreeningPanel from '../../../features/screening/components/ActiveScreeningPanel';
import QuickActions from '../../../features/screening/components/QuickActions';
import RecentAlerts from '../../../features/alerts/components/RecentAlerts';
import SystemHealthPanel from '../../../features/monitoring/components/SystemHealthPanel';
import { dutyOfficerQuickActions } from '../../../config/navigation';
import { mockDutyDashboard } from '../../../data/mockDutyDashboard';
import { useDutyData } from '../../../features/duty/DutyDataContext';

const metricIcons = {
  screened: UsersRound,
  screening: ScanLine,
  cleared: CircleCheck,
  medium: TriangleAlert,
  high: ShieldAlert,
  average: Timer,
};

export default function DutyDashboardPage() {
  const { checkpoint, metrics, passengers, activeScreening } = mockDutyDashboard;
  const { alerts } = useDutyData();
  const recentAlerts = alerts
    .filter((alert) => alert.status !== 'Resolved')
    .slice(0, 4)
    .map((alert) => ({
      ...alert,
      queueNumber: alert.passengerId?.match(/\d+$/)?.[0],
      ageLabel: alert.time,
    }));
  return (
    <>
      <PageHeader
        title="Border Operations"
        eyebrow="Duty / Border Officer"
        description="Monitor passenger screening activity and review exceptions."
        actions={
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-body font-medium text-navy">
              <MapPin aria-hidden="true" className="icon-sm text-muted" />
              {checkpoint.name}
            </p>
            <Badge>Fictional demo / Static snapshot</Badge>
          </div>
        }
      />
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Checkpoint screening metrics
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} {...metric} icon={metricIcons[metric.id]} />
          ))}
        </div>
      </section>
      <section aria-labelledby="screening-heading">
        <h2 id="screening-heading" className="sr-only">
          Screening operations
        </h2>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <ScreeningQueue passengers={passengers} />
          <ActiveScreeningPanel screening={activeScreening} />
        </div>
      </section>
      <section aria-labelledby="checkpoint-heading">
        <h2 id="checkpoint-heading" className="sr-only">
          Checkpoint updates and actions
        </h2>
        <div className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
          <RecentAlerts alerts={recentAlerts} destination="/duty-officer/alerts" />
          <SystemHealthPanel checkpoint={checkpoint} />
          <QuickActions actions={dutyOfficerQuickActions} />
        </div>
      </section>
    </>
  );
}
