import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Checkbox from '../../../components/ui/Checkbox';

export default function ScreeningReadySummary({
  documents,
  confirmed,
  onConfirm,
  busy,
  error,
  onStart,
}) {
  const errorRef = useRef(null);
  const types = [...new Set(documents.map((document) => document.documentType))];
  return (
    <Card>
      <h2 className="mb-4 text-section font-semibold text-navy">Screening summary</h2>
      <dl className="space-y-3 text-body">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Documents</dt>
          <dd className="font-semibold">{documents.length}</dd>
        </div>
        <div>
          <dt className="text-muted">Document type</dt>
          <dd className="mt-1 font-medium">{types.join(' + ') || 'Not selected'}</dd>
        </div>
        <div>
          <dt className="text-muted">Capture status</dt>
          <dd className="mt-1 font-medium">
            {documents.length
              ? confirmed
                ? 'Confirmed'
                : 'Ready for confirmation'
              : 'Awaiting documents'}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Automated screening</dt>
          <dd className="mt-1 font-medium">
            {documents.length && confirmed ? 'Ready to start' : 'Awaiting document confirmation'}
          </dd>
        </div>
      </dl>
      <div className="mt-5 space-y-4 border-t border-default pt-4">
        <Checkbox
          label="I have reviewed the captured documents."
          helperText="Confirm the correct documents and pages are attached. This does not verify their authenticity."
          checked={confirmed}
          onChange={(event) => onConfirm(event.target.checked)}
          disabled={!documents.length || busy}
        />
        <div ref={errorRef} tabIndex={-1}>
          {error && (
            <AlertBanner variant="danger" title="Documents not confirmed" announce>
              {error}
            </AlertBanner>
          )}
        </div>
        <Button
          className="w-full"
          disabled={busy}
          onClick={() => {
            if (!onStart()) errorRef.current?.focus();
          }}
        >
          Start Automated Screening
          <ArrowRight aria-hidden="true" className="icon-sm shrink-0" />
        </Button>
        <p className="text-caption text-muted">
          Demo navigation only. The next screen uses independent fictional screening data; no real
          analysis starts. Files are discarded when you leave this page.
        </p>
      </div>
    </Card>
  );
}
