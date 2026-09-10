import { Files } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import FileUpload from './FileUpload';
import { formatFileSize } from '../utils/documentFiles';

export default function DocumentList({ documents, selectedId, busy, onSelect, onAdd }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-section font-semibold text-navy">Captured documents</h2>
        <Badge>{documents.length} / 10</Badge>
      </div>
      {documents.length ? (
        <ol aria-label="Captured documents" className="divide-y divide-default">
          {documents.map((document, index) => (
            <li key={document.id} className="space-y-2 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-body font-semibold">Document {index + 1}</p>
                <Badge variant="success">Ready</Badge>
              </div>
              <p className="text-body">
                {document.documentType} &mdash; {document.pageLabel}
              </p>
              <p className="break-all text-caption text-muted">
                {document.name} &middot; {formatFileSize(document.size)}
              </p>
              <Button
                size="small"
                variant={selectedId === document.id ? 'secondary' : 'ghost'}
                aria-pressed={selectedId === document.id}
                aria-label={'Preview document ' + (index + 1) + ': ' + document.name}
                onClick={() => onSelect(document.id)}
              >
                Preview
              </Button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mb-4 flex items-start gap-3 text-body text-muted">
          <Files aria-hidden="true" className="icon-md shrink-0" />
          <p>No documents added. Capture the required pages before confirming.</p>
        </div>
      )}
      <div className="mt-4 border-t border-default pt-4">
        <FileUpload
          label="Add Another Document / Page"
          inputLabel="Add additional document files"
          disabled={busy || documents.length >= 10}
          onFiles={onAdd}
        />
      </div>
    </Card>
  );
}
