import { FileText } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

export default function ScreeningDocumentSummary({ documents }) {
  return (
    <Card aria-labelledby="screening-documents-title">
      <h2 id="screening-documents-title" className="text-section font-semibold text-navy">
        Documents Submitted
      </h2>
      <p className="mt-2 text-caption text-muted">
        Fictional document set for this demo. Files from Document Capture are not used or retained.
        No previews are available.
      </p>
      <ul aria-label="Demo documents" className="mt-3 divide-y divide-default">
        {documents.map((document) => (
          <li key={document.id} className="flex items-start gap-3 py-4">
            <span className="rounded-control border border-default bg-canvas p-2 text-muted">
              <FileText aria-hidden="true" className="icon-md" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-body font-semibold">{document.type}</p>
              <p className="text-caption text-muted">{document.page}</p>
              <Badge>{document.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
