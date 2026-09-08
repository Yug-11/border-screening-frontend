import { useNavigate } from 'react-router';
import AlertBanner from '../../../components/feedback/AlertBanner';
import PageHeader from '../../../components/ui/PageHeader';
import { mockScreeningProgress } from '../../../data/mockScreeningProgress';
import CurrentAnalysisPanel from '../../../features/screening/components/CurrentAnalysisPanel';
import ScreeningActivity from '../../../features/screening/components/ScreeningActivity';
import ScreeningDocumentSummary from '../../../features/screening/components/ScreeningDocumentSummary';
import ScreeningPipeline from '../../../features/screening/components/ScreeningPipeline';
import ScreeningProgressHeader from '../../../features/screening/components/ScreeningProgressHeader';
import ScreeningSystemStatus from '../../../features/screening/components/ScreeningSystemStatus';
import useScreeningProgress from '../../../features/screening/hooks/useScreeningProgress';

export default function ScreeningProgressPage() {
  const navigate = useNavigate();
  const screening = useScreeningProgress();
  return (
    <>
      <PageHeader
        title="Automated Screening"
        description="Document and identity checks are being performed automatically."
        eyebrow={mockScreeningProgress.checkpoint}
      />
      <ScreeningProgressHeader
        screening={screening}
        context={mockScreeningProgress}
        onViewResult={() =>
          navigate('/duty-officer/screening/result', {
            state: { demoScenario: screening.warnings.length ? 'medium' : 'low' },
          })
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <ScreeningPipeline steps={screening.steps} processedCount={screening.processedCount} />
        </div>
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <CurrentAnalysisPanel screening={screening} />
          <AlertBanner variant="info" title="Automated Screening">
            In the connected system, the screening engine processes submitted documents
            automatically. Officer action is only required if an exception or elevated risk is
            detected. This demo does not run those checks.
          </AlertBanner>
        </div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <ScreeningDocumentSummary documents={mockScreeningProgress.documents} />
        <ScreeningActivity events={screening.events} />
        <ScreeningSystemStatus systems={mockScreeningProgress.systems} />
      </div>
    </>
  );
}
