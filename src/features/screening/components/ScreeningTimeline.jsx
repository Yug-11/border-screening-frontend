import ActivityFeed from '../../../components/data-display/ActivityFeed';
import Card from '../../../components/ui/Card';

export default function ScreeningTimeline({ events = [] }) {
  return (
    <Card aria-labelledby="result-timeline-title">
      <h2
        id="result-timeline-title"
        className="text-section font-semibold text-navy"
      >
        Screening Timeline
      </h2>

      <p className="mt-2 text-caption text-muted">
        Automated screening stages completed by the BorderGuard AI backend.
      </p>

      {events.length > 0 ? (
        <ActivityFeed
          items={events}
          label="Screening result timeline"
        />
      ) : (
        <p className="mt-4 text-body text-muted">
          No screening timeline events are available.
        </p>
      )}

      <p className="mt-4 text-caption text-muted">
        Prototype screening uses synthetic test documents and reference
        records.
      </p>
    </Card>
  );
}