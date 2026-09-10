import StatusBadge from '../../../components/ui/StatusBadge';
import QueueEntryAction from './QueueEntryAction';
import QueueEntryProgress from './QueueEntryProgress';

export default function ScreeningQueueRow({ passenger, onStart, onOpen }) {
  return (
    <li className="space-y-3 p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <p className="font-semibold tabular-nums text-navy">#{passenger.queueNumber}</p>
          <h3 className="text-body font-semibold">{passenger.name}</h3>
        </div>
        <span>
          <span className="sr-only">Risk: </span>
          <StatusBadge status={passenger.risk}>{passenger.risk}</StatusBadge>
        </span>
      </div>
      <p className="text-caption text-muted">
        {passenger.documentType} &middot; {passenger.nationality}
      </p>
      <div>
        <p className="text-caption text-muted">Automated screening</p>
        <p className="text-body font-medium">{passenger.stage}</p>
      </div>
      <QueueEntryProgress passenger={passenger} compact />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={passenger.status}>{passenger.status}</StatusBadge>
        <QueueEntryAction passenger={passenger} onStart={onStart} onOpen={onOpen} />
      </div>
    </li>
  );
}
