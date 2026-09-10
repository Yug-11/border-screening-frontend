import { LoaderCircle } from 'lucide-react';
import cn from '../../utils/cn';

export default function LoadingSpinner({
  label = 'Loading',
  size = 'medium',
  decorative = false,
  className,
}) {
  return (
    <span
      role={decorative ? undefined : 'status'}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <LoaderCircle
        aria-hidden="true"
        className={cn(
          'animate-spin motion-reduce:animate-none',
          size === 'small' ? 'icon-sm' : 'icon-md',
        )}
      />
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  );
}
