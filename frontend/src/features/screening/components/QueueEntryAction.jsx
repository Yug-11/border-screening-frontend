import Button from '../../../components/ui/Button';
import { attentionStatuses } from '../constants/queueOptions';

export default function QueueEntryAction({ passenger, onStart, onOpen }) {
  const waiting = passenger.status === 'Waiting';
  const review = attentionStatuses.includes(passenger.status);
  const completed = passenger.status === 'Completed';
  const label = waiting
    ? 'Start Screening'
    : review
      ? 'Review'
      : completed
        ? 'View Result'
        : 'View';
  return (
    <Button
      size="small"
      variant={review ? 'secondary' : 'outline'}
      className="whitespace-nowrap"
      aria-label={label + ' for queue #' + passenger.queueNumber}
      onClick={() =>
        waiting
          ? onStart(passenger.id)
          : onOpen(passenger, review ? 'review' : completed ? 'result' : 'detail')
      }
    >
      {label}
    </Button>
  );
}
