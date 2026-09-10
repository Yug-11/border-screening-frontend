import { CircleAlert } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

export default function ErrorState({
  title = 'Unable to display this content',
  description = 'Please try again.',
  onRetry,
}) {
  return (
    <EmptyState
      icon={CircleAlert}
      title={title}
      description={description}
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}
