import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import { captureQualityChecks } from '../constants/captureOptions';

export default function CaptureQuality({ documentCount }) {
  return (
    <Card>
      <h2 className="mb-2 text-section font-semibold text-navy">Capture Quality</h2>
      <p className="mb-3 text-caption text-muted">
        Preliminary file checks only. No computer vision or quality analysis is performed.
      </p>
      <dl className="divide-y divide-default text-body">
        <div className="flex flex-wrap justify-between gap-2 py-2">
          <dt>File format and size</dt>
          <dd>
            <Badge variant={documentCount ? 'success' : 'neutral'}>
              {documentCount ? 'Within limits' : 'No files'}
            </Badge>
          </dd>
        </div>
        {captureQualityChecks.map((label) => (
          <div key={label} className="flex flex-wrap justify-between gap-2 py-2">
            <dt>{label}</dt>
            <dd>
              <Badge>Not assessed</Badge>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-caption text-muted">
        Visual-quality results will come from a future screening service. File readiness is not
        document verification.
      </p>
    </Card>
  );
}
