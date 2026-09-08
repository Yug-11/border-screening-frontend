import { FileText } from 'lucide-react';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function CurrentDocumentCard({ document }) {
  return (
    <Card aria-labelledby="current-document-title">
      <h2 id="current-document-title" className="mb-4 text-section font-semibold text-navy">
        Current Document
      </h2>
      <div
        role="img"
        aria-label="Fictional document placeholder, not a passport image"
        className="mb-4 flex items-center gap-4 rounded-control border border-default bg-subtle p-4"
      >
        <FileText aria-hidden="true" className="icon-lg shrink-0 text-muted" />
        <div>
          <p className="text-body font-semibold text-navy">DEMO DOCUMENT</p>
          <p className="mt-1 text-caption text-muted">No real identity information</p>
        </div>
      </div>
      <dl className="space-y-3 text-body">
        {[
          ['Document Type', document.type],
          ['Document Status', <StatusBadge key="status" status={document.status} />],
          ['Expiry', document.expiry],
          ['MRZ', <StatusBadge key="mrz" status={document.mrz} />],
          ['Document Analysis', document.analysis],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-caption text-muted">
        Demo document &mdash; no real identity information. Analysis statuses are supplied fixtures,
        not processed files.
      </p>
    </Card>
  );
}
