import StatusBadge from '../ui/StatusBadge';

export default function SystemStatus({ status = 'Operational', label }) {
  return <StatusBadge status={status}>{label || status}</StatusBadge>;
}
