import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
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

  const [verificationFile, setVerificationFile] = useState(null);
  const [verificationError, setVerificationError] = useState('');

  function handleVerificationFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setVerificationError('');

    if (!file.type.startsWith('image/')) {
      setVerificationError(
        'Please select an image for face verification.',
      );
      setVerificationFile(null);
      return;
    }

    setVerificationFile(file);
  }

  function removeVerificationFile() {
    setVerificationFile(null);
    setVerificationError('');
  }

  function startScreening() {
    if (!upload.validateReady()) {
      return false;
    }

    const documentFile = upload.selectedDocument?.file;

    if (!documentFile) {
      console.error(
        'START SCREENING ERROR: selectedDocument/file is missing',
        upload.selectedDocument,
      );

      return false;
    }

    console.log('Starting screening with:', {
      document: {
        name: documentFile.name,
        type: documentFile.type,
        size: documentFile.size,
      },
      verification: verificationFile
        ? {
            name: verificationFile.name,
            type: verificationFile.type,
            size: verificationFile.size,
          }
        : null,
    });

    navigate('/duty-officer/screening/progress', {
      state: {
        documentFile,
        verificationFile,
        documentName: documentFile.name,
        documentType:
          upload.selectedDocument?.documentType || 'Passport',
        pageLabel:
          upload.selectedDocument?.pageLabel || 'Identity page',
      },
    });

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
          <h2 className="text-card font-semibold text-navy">
            New Screening
          </h2>

          <Badge variant="info">
            Prototype
          </Badge>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-body lg:grid-cols-4">
          <div>
            <dt className="text-caption text-muted">
              Checkpoint
            </dt>

            <dd className="font-semibold text-navy">
              {mockDocumentCapture.checkpoint}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Screening Type
            </dt>

            <dd>
              Document &amp; Identity Screening
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Face Verification
            </dt>

            <dd>
              {verificationFile ? 'Provided' : 'Optional'}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-muted">
              Status
            </dt>

            <dd>
              Ready for capture
            </dd>
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

          {/* Face Verification */}
          <Card aria-labelledby="verification-image-title">
            <div className="space-y-4">
              <div>
                <h2
                  id="verification-image-title"
                  className="text-section font-semibold text-navy"
                >
                  Face Verification
                </h2>

                <p className="mt-1 text-caption text-muted">
                  Optionally provide a current passenger photograph for
                  facial comparison with the document.
                </p>
              </div>

              <label className="block">
                <span className="text-body font-medium text-navy">
                  Verification image
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleVerificationFile}
                  className="mt-2 block w-full text-body"
                />
              </label>

              {verificationError && (
                <p
                  role="alert"
                  className="text-body text-danger"
                >
                  {verificationError}
                </p>
              )}

              {verificationFile && (
                <div className="rounded-md border border-default bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-navy">
                        {verificationFile.name}
                      </p>

                      <p className="text-caption text-muted">
                        {(verificationFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={removeVerificationFile}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-caption text-muted">
                Use only authorized, consenting test subjects for prototype
                demonstrations. Synthetic or controlled test images are
                recommended.
              </p>
            </div>
          </Card>
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

          <CaptureQuality
            documentCount={upload.documents.length}
          />

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

      <p className="mt-6 text-caption text-muted">
        Prototype screening uses synthetic test documents and controlled
        test data. Face verification is optional.
      </p>
    </>
  );
}