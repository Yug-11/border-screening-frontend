import ProgressBar from '../../../components/ui/ProgressBar';

export default function QueueEntryProgress({ passenger, compact = false }) {
  const statuses = {
    Waiting: 'pending',
    Completed: 'completed',
    'Review Required': 'warning',
    'Anomaly Detected': 'failed',
  };
  return (
    <ProgressBar
      value={passenger.progress}
      status={statuses[passenger.status] || 'active'}
      label={'Automated screening for queue #' + passenger.queueNumber}
      compact={compact}
      className={compact ? 'min-w-24' : undefined}
    />
  );
}
