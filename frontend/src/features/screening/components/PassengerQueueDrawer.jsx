import { useNavigate } from 'react-router';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';
import StatusBadge from '../../../components/ui/StatusBadge';
import StepIndicator from '../../../components/ui/StepIndicator';
import QueueEntryProgress from './QueueEntryProgress';
import ReviewRequiredDrawer from './ReviewRequiredDrawer';

export default function PassengerQueueDrawer({ passenger, mode, onClose }) {
  const navigate = useNavigate();
  const caseId = passenger?.passengerId;
  const titles = {
    detail: 'Passenger Screening Details',
    review: 'Officer Review Required',
    result: 'Screening Summary',
  };
  const details = passenger
    ? [
        ['Passenger', passenger.name],
        ['Queue', '#' + passenger.queueNumber],
        ['Document Type', passenger.documentType],
        ['Nationality', passenger.nationality],
        ['Current Screening Stage', passenger.stage],
        [
          'Risk',
          <StatusBadge key="risk" status={passenger.risk}>
            {passenger.risk}
          </StatusBadge>,
        ],
        [
          'Status',
          <StatusBadge key="status" status={passenger.status}>
            {passenger.status}
          </StatusBadge>,
        ],
      ]
    : [];
  return (
    <Drawer
      open={Boolean(passenger)}
      onClose={onClose}
      title={titles[mode] || titles.detail}
      description="Fictional queue snapshot. No document or biometric analysis is performed."
      footer={
        <>
          {caseId && (
            <Button
              variant="outline"
              onClick={() => navigate('/duty-officer/passengers/' + caseId)}
            >
              Open Passenger Detail
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      {passenger && (
        <div className="space-y-5">
          {caseId && (
            <p className="text-caption text-muted">
              A separate completed demo case is available for this passenger. Its latest passport
              screening is independent of this earlier queue snapshot.
            </p>
          )}
          <dl className="space-y-3">
            {details.map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 items-start gap-3 text-body">
                <dt className="text-muted">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <QueueEntryProgress passenger={passenger} />
          {mode === 'review' && <ReviewRequiredDrawer key={passenger.id} passenger={passenger} />}
          {mode === 'result' && (
            <AlertBanner variant="success" title="Automatically cleared - demo">
              This fictional low-risk entry completed automated screening. This is a queue summary,
              not the full screening result.
            </AlertBanner>
          )}
          <section
            aria-label="Automated screening pipeline"
            className="space-y-3 border-t border-default pt-4"
          >
            <h3 className="text-card font-semibold text-navy">Automated Screening</h3>
            <p className="text-caption text-muted">
              Software performs the checks. Officers review exceptions; there are no manual
              verification steps here. Preliminary risk labels are not clearance decisions.
            </p>
            <StepIndicator
              steps={passenger.pipeline}
              orientation="vertical"
              label={'Automated stages for queue #' + passenger.queueNumber}
            />
          </section>
        </div>
      )}
    </Drawer>
  );
}
