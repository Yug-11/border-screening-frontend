import { useRef } from 'react';
import { TriangleAlert } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  children,
}) {
  const cancelRef = useRef(null);
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      description={description}
      role="alertdialog"
      size="small"
      initialFocusRef={cancelRef}
      footer={
        <>
          <Button ref={cancelRef} variant="outline" disabled={loading} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <TriangleAlert aria-hidden="true" className="icon-lg text-warning" />
        <div>{children || 'Please review this action before continuing.'}</div>
      </div>
    </Modal>
  );
}
