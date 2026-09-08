import ActivityFeed from '../../../components/data-display/ActivityFeed';
import Card from '../../../components/ui/Card';

export default function ScreeningTimeline({ events }) {
  return (
    <Card aria-labelledby="result-timeline-title">
      <h2 id="result-timeline-title" className="text-section font-semibold text-navy">
        Screening Timeline
      </h2>
      <p className="mt-2 text-caption text-muted">
        Fictional assessment events in chronological order. Times and findings are illustrative.
      </p>
      <ActivityFeed items={events} label="Screening result timeline" />
    </Card>
  );
}
