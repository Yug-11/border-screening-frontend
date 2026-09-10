import { useState } from 'react';
import { Camera, FileUp } from 'lucide-react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import CameraCapture from './CameraCapture';
import DocumentTypeSelector from './DocumentTypeSelector';
import FileUpload from './FileUpload';

export default function DocumentCapture({ upload }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  return (
    <Card>
      <div className="space-y-5">
        <h2 className="text-section font-semibold text-navy">Capture documents</h2>
        <DocumentTypeSelector
          documentType={upload.documentType}
          pageLabel={upload.pageLabel}
          onTypeChange={upload.changeDocumentType}
          onPageChange={upload.setPageLabel}
          disabled={upload.busy}
        />
        <div className="space-y-4 rounded-panel border border-dashed border-control bg-canvas p-5">
          <div className="flex items-start gap-3">
            <FileUp aria-hidden="true" className="icon-lg shrink-0 text-primary" />
            <div>
              <p className="text-card font-semibold">Add a document or page</p>
              <p className="mt-1 text-body text-muted">
                JPG, JPEG, PNG or PDF. Up to 10 MB per file and 10 documents per screening.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <FileUpload disabled={upload.busy} onFiles={(files) => upload.addFiles(files)} />
            <Button variant="outline" disabled={upload.busy} onClick={() => setCameraOpen(true)}>
              <Camera aria-hidden="true" className="icon-sm" />
              Capture with Camera
            </Button>
          </div>
          <p className="text-caption text-muted">
            Fictional/demo documents only. Files remain in memory on this page and are discarded
            when you leave or reload.
          </p>
        </div>
        {upload.busy && (
          <p role="status" className="flex items-center gap-2 text-body text-muted">
            <LoadingSpinner decorative />
            Checking local files&hellip;
          </p>
        )}
        {upload.error && (
          <AlertBanner variant="danger" title="Document not added" announce className="break-all">
            {upload.error}
          </AlertBanner>
        )}
        {upload.notice && (
          <AlertBanner variant="success" title="Local documents updated" announce>
            {upload.notice}
          </AlertBanner>
        )}
      </div>
      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(file, signal) => upload.addFiles([file], null, 'Demo camera sample', signal)}
      />
    </Card>
  );
}
