import { useNavigate } from 'react-router';
import { PanelTop } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';

export default function DutyRoutePlaceholder({ title }) {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title={title}
        eyebrow="Duty / Border Officer"
        description="This destination is reserved for a future implementation."
      />
      <section aria-labelledby="placeholder-heading">
        <h2 id="placeholder-heading" className="sr-only">
          Feature availability
        </h2>
        <Card>
          <EmptyState
            icon={PanelTop}
            title="Not implemented yet"
            description="This feature is not available in the demo. No operation has been started."
            action={
              <Button variant="outline" onClick={() => navigate('/duty-officer/dashboard')}>
                Return to Border Operations
              </Button>
            }
          />
        </Card>
      </section>
    </>
  );
}
