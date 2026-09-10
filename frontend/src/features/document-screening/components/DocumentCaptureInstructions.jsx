import { ClipboardList } from 'lucide-react';
import Card from '../../../components/ui/Card';

export default function DocumentCaptureInstructions() {
  return (
    <Card>
      <h2 className="mb-3 flex items-center gap-2 text-card font-semibold text-navy">
        <ClipboardList aria-hidden="true" className="icon-md" />
        Capture guidelines
      </h2>
      <ul className="list-disc space-y-1 pl-5 text-body text-muted">
        <li>Ensure all document edges are visible.</li>
        <li>Avoid glare and heavy shadows.</li>
        <li>Keep text readable.</li>
        <li>Place the document on a flat surface.</li>
        <li>Capture the complete identity page.</li>
      </ul>
    </Card>
  );
}
