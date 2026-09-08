import { useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function QuickActions({ actions = [] }) {
  const navigate = useNavigate();
  return (
    <Card title="Quick Actions" description="Begin or follow an operational task.">
      <div className="space-y-3">
        {actions.map(({ label, to, icon: Icon, variant }) => (
          <Button
            key={to}
            variant={variant}
            className="w-full justify-start"
            onClick={() => navigate(to)}
          >
            <Icon aria-hidden="true" className="icon-md" />
            {label}
          </Button>
        ))}
      </div>
      <p className="mt-4 text-caption text-muted">
        These destinations are placeholders. No screening or upload starts in this demo.
      </p>
    </Card>
  );
}
