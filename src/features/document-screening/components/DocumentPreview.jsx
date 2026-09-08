import { FileText } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import Select from '../../../components/ui/Select';
import { captureInstructions } from '../constants/captureOptions';
import { formatFileSize } from '../utils/documentFiles';
import FileUpload from './FileUpload';

export default function DocumentPreview({
  document,
  busy,
  onReplace,
  onRemove,
  onPageChange,
  headingRef,
}) {
  return (
    <Card>
      <h2 ref={headingRef} tabIndex={-1} className="mb-4 text-section font-semibold text-navy">
        Document preview
      </h2>
      {!document ? (
        <EmptyState
          icon={FileText}
          title="No document selected"
          description="Upload a file or capture a fictional sample to inspect it here."
        />
      ) : (
        <div className="space-y-4">
          {document.previewUrl ? (
            <div className="rounded-control border border-default bg-canvas p-3">
              <img
                src={document.previewUrl}
                alt={
                  document.documentType + ', ' + document.pageLabel + ' preview: ' + document.name
                }
                className="max-h-96 w-full object-contain"
              />
            </div>
          ) : (
            <div className="space-y-2 rounded-control border border-default bg-canvas p-6 text-center">
              <FileText aria-hidden="true" className="icon-lg mx-auto text-muted" />
              <p className="font-semibold text-navy">PDF document attached</p>
              <p className="text-body text-muted">
                Inline PDF preview is not available in this demo. Inspect the original PDF before
                confirming the documents.
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="min-w-0 break-all font-semibold text-navy">{document.name}</p>
            <Badge variant="success">Ready for screening</Badge>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-body">
            <div>
              <dt className="text-caption text-muted">Document type</dt>
              <dd>{document.documentType}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">File type / size</dt>
              <dd>
                {document.mime === 'application/pdf'
                  ? 'PDF'
                  : document.mime === 'image/png'
                    ? 'PNG'
                    : 'JPEG'}{' '}
                &middot; {formatFileSize(document.size)}
              </dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Added locally</dt>
              <dd>
                <time dateTime={document.capturedAt}>
                  {new Date(document.capturedAt).toLocaleString()}
                </time>
              </dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Source</dt>
              <dd>{document.source}</dd>
            </div>
          </dl>
          <Select
            label="Page / side of selected document"
            disabled={busy}
            value={document.pageLabel}
            options={captureInstructions[document.documentType].pages.map((value) => ({
              value,
              label: value,
            }))}
            onChange={(event) => onPageChange(document.id, event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <FileUpload
              label="Replace"
              inputLabel="Replace selected document"
              multiple={false}
              disabled={busy}
              onFiles={(files) => onReplace(files, document.id)}
            />
            <Button variant="ghost" disabled={busy} onClick={() => onRemove(document.id)}>
              Remove
            </Button>
          </div>
          <p className="text-caption text-muted">
            Ready means the file passed local format and size checks. No identity, document validity
            or visual quality verification has occurred.
          </p>
        </div>
      )}
    </Card>
  );
}
