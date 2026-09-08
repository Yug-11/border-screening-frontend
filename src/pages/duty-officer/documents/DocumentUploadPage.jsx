import { useNavigate } from 'react-router';
import { useRef } from 'react';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import { mockDocumentCapture } from '../../../data/mockDocumentCapture';
import CaptureQuality from '../../../features/document-screening/components/CaptureQuality';
import DocumentCapture from '../../../features/document-screening/components/DocumentCapture';
import DocumentCaptureInstructions from '../../../features/document-screening/components/DocumentCaptureInstructions';
import DocumentList from '../../../features/document-screening/components/DocumentList';
import DocumentPreview from '../../../features/document-screening/components/DocumentPreview';
import ScreeningReadySummary from '../../../features/document-screening/components/ScreeningReadySummary';
import useDocumentUpload from '../../../features/document-screening/hooks/useDocumentUpload';

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const upload = useDocumentUpload();
  const previewHeadingRef = useRef(null);
  function startScreening() {
    if (!upload.validateReady()) return false;
    navigate('/duty-officer/screening/progress');
    return true;
  }
  return (
    <>
      <PageHeader
        title="Document Capture"
        description="Capture or upload passenger documents before automated screening."
        eyebrow={mockDocumentCapture.checkpoint}
      />
      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-card font-semibold text-navy">New Screening</h2>
          <Badge>Fictional demo</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-body lg:grid-cols-4">
          <div>
            <dt className="text-caption text-muted">Queue</dt>
            <dd className="font-semibold tabular-nums">#{mockDocumentCapture.queueNumber}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Passenger</dt>
            <dd>{mockDocumentCapture.passenger}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Nationality</dt>
            <dd>{mockDocumentCapture.nationality}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Status</dt>
            <dd>{mockDocumentCapture.status}</dd>
          </div>
        </dl>
      </Card>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="min-w-0 space-y-6 lg:col-span-3">
          <DocumentCapture upload={upload} />
          <DocumentPreview
            document={upload.selectedDocument}
            busy={upload.busy}
            onReplace={upload.addFiles}
            onRemove={(id) => {
              upload.removeDocument(id);
              previewHeadingRef.current?.focus();
            }}
            headingRef={previewHeadingRef}
            onPageChange={upload.updatePage}
          />
          <DocumentCaptureInstructions />
        </div>
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <DocumentList
            documents={upload.documents}
            selectedId={upload.selectedDocument?.id}
            busy={upload.busy}
            onSelect={(id) => {
              upload.selectDocument(id);
              previewHeadingRef.current?.focus();
            }}
            onAdd={(files) => upload.addFiles(files)}
          />
          <CaptureQuality documentCount={upload.documents.length} />
          <ScreeningReadySummary
            documents={upload.documents}
            confirmed={upload.confirmed}
            onConfirm={upload.confirmDocuments}
            busy={upload.busy}
            error={upload.submissionError}
            onStart={startScreening}
          />
        </div>
      </div>
    </>
  );
}
