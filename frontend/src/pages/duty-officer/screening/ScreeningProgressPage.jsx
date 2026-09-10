import { useLocation, useNavigate } from 'react-router';

import AlertBanner from '../../../components/feedback/AlertBanner';
import PageHeader from '../../../components/ui/PageHeader';

import CurrentAnalysisPanel from '../../../features/screening/components/CurrentAnalysisPanel';
import ScreeningActivity from '../../../features/screening/components/ScreeningActivity';
import ScreeningDocumentSummary from '../../../features/screening/components/ScreeningDocumentSummary';
import ScreeningPipeline from '../../../features/screening/components/ScreeningPipeline';
import ScreeningProgressHeader from '../../../features/screening/components/ScreeningProgressHeader';
import ScreeningSystemStatus from '../../../features/screening/components/ScreeningSystemStatus';

import useScreeningProgress from '../../../features/screening/hooks/useScreeningProgress';

export default function ScreeningProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Files passed from DocumentUploadPage
  const documentFile = location.state?.documentFile;
  const verificationFile = location.state?.verificationFile;

  console.log('PROGRESS PAGE - document:', documentFile);
  console.log('PROGRESS PAGE - verification:', verificationFile);

  const screening = useScreeningProgress(
    documentFile,
    verificationFile,
  );

  function handleViewResult() {
    if (!screening?.screeningId) {
      return;
    }

    navigate('/duty-officer/screening/result', {
      state: {
        screeningId: screening.screeningId,
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Automated Screening"
        description="Document and identity checks are being performed automatically."
        eyebrow="Live Backend Screening"
      />

      {!documentFile && (
        <AlertBanner
          variant="danger"
          title="No document was provided"
          announce
        >
          No document was passed from the document capture page.
          Return to document capture and start the screening again.
        </AlertBanner>
      )}

      <ScreeningProgressHeader
        screening={screening}
        context={{
          checkpoint: 'Live Backend Screening',
        }}
        onViewResult={handleViewResult}
      />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <ScreeningPipeline
            steps={screening.steps || []}
            processedCount={screening.processedCount || 0}
          />
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-2">
          <CurrentAnalysisPanel
            screening={screening}
          />

          {screening.error && (
            <AlertBanner
              variant="danger"
              title="Screening failed"
              announce
            >
              {screening.error}
            </AlertBanner>
          )}

          {!screening.error &&
            screening.status === 'running' && (
              <AlertBanner
                variant="info"
                title="Live Backend Screening"
              >
                {verificationFile
                  ? 'The screening engine is processing the document and verification image. Progress shown here comes directly from the backend.'
                  : 'The screening engine is processing the submitted document. Progress shown here comes directly from the backend.'}
              </AlertBanner>
            )}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <ScreeningDocumentSummary
          documents={
            documentFile
              ? [
                  {
                    id: 'screening-document',
                    name: documentFile.name,
                    mime: documentFile.type,
                    size: documentFile.size,
                  },
                ]
              : []
          }
        />

        <ScreeningActivity
          events={screening.events || []}
        />

        <ScreeningSystemStatus
          systems={[]}
        />
      </div>
    </>
  );
}