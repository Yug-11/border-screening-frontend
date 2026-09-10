import { useEffect, useRef, useState } from 'react';
import { FileImage } from 'lucide-react';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { createDemoDocument } from '../utils/documentFiles';

export default function CameraCapture({ open, onClose, onCapture }) {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  const controller = useRef(null);
  useEffect(
    () => () => {
      controller.current?.abort();
      request.current += 1;
    },
    [],
  );
  function close() {
    controller.current?.abort();
    request.current += 1;
    setCapturing(false);
    setError('');
    onClose();
  }
  async function capture() {
    const current = ++request.current;
    controller.current = new AbortController();
    setCapturing(true);
    setError('');
    try {
      const file = await createDemoDocument();
      if (request.current !== current) return;
      const added = await onCapture(file, controller.current.signal);
      if (request.current !== current) return;
      if (added) close();
      else
        setError(
          'The sample could not be added. Cancel to check the file limits, or use Upload File instead.',
        );
    } catch {
      if (request.current === current)
        setError('Demo capture is unavailable. Cancel and use Upload File instead.');
    } finally {
      if (request.current === current) setCapturing(false);
    }
  }
  return (
    <Modal
      open={open}
      onClose={close}
      title="Capture with Camera"
      description="Demo capture only. No camera or scanner is connected."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button variant="secondary" loading={capturing} onClick={capture}>
            Capture Document
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <AlertBanner variant="info" title="Camera access is not enabled">
          This demo does not request camera permissions or access hardware. Use Capture Document to
          add a fictional sample, or cancel and upload a file.
        </AlertBanner>
        <div className="space-y-3 rounded-panel border border-default bg-canvas p-6 text-center">
          <FileImage aria-hidden="true" className="icon-lg mx-auto text-muted" />
          <p className="text-card font-semibold text-navy">Fictional capture sample</p>
          <p className="text-body text-muted">
            A clearly marked PNG sample will be generated locally. It contains no official document
            number or biometric image.
          </p>
        </div>
        {error && (
          <AlertBanner variant="danger" title="Capture unavailable" announce>
            {error}
          </AlertBanner>
        )}
      </div>
    </Modal>
  );
}
