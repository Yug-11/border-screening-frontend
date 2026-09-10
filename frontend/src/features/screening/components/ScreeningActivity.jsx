import ActivityFeed from '../../../components/data-display/ActivityFeed';
import Card from '../../../components/ui/Card';

export default function ScreeningActivity({ events }) {
  const recent = events.slice(-6);
  return (
    <Card aria-labelledby="screening-activity-title">
      <h2 id="screening-activity-title" className="text-section font-semibold text-navy">
        Screening Activity
      </h2>
      <p className="mt-2 text-caption text-muted">
        Latest {recent.length} of {events.length} demo events, oldest first. Times are illustrative,
        not live readings.
      </p>
      <ActivityFeed items={recent} label="Screening activity events" />
    </Card>
  );
}
