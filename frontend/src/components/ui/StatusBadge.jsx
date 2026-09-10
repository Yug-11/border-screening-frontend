import Badge from './Badge';
import { statusTypes } from '../../constants/statusTypes';

export default function StatusBadge({ status, variant, children, ...props }) {
  const normalized = String(status || '')
    .trim()
    .replaceAll('_', ' ')
    .toUpperCase();
  return (
    <Badge dot {...props} variant={variant || statusTypes[normalized] || 'neutral'}>
      {children || normalized || 'Unknown'}
    </Badge>
  );
}
