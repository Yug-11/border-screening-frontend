import { Link } from 'react-router';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import AlertCard from './AlertCard';

export default function RecentAlerts({ alerts = [], destination }) {
  return (
    <Card
      id="recent-alerts"
      title="Recent Alerts"
      description="Exceptions and checkpoint notices."
      actions={
        destination && (
          <Link
            to={destination}
            className="inline-flex min-h-8 items-center text-caption font-semibold text-primary hover:underline"
          >
            View alerts
          </Link>
        )
      }
    >
      {alerts.length ? (
        <ul className="divide-y divide-default">
          {alerts.map((alert) => (
            <li key={alert.id} className="py-4 first:pt-0 last:pb-0">
              <AlertCard alert={alert} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No recent alerts" description="There are no notices in this snapshot." />
      )}
      <p className="mt-4 border-t border-default pt-3 text-caption text-muted">
        Relative times refer to the fictional snapshot.
      </p>
    </Card>
  );
}
