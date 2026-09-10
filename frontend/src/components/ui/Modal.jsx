import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import cn from '../../utils/cn';

export default function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'medium',
  placement = 'center',
  initialFocusRef,
  closeOnBackdrop = true,
  role = 'dialog',
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
      initialFocusRef?.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open, initialFocusRef]);
  const isDrawer = placement === 'right';
  const widths = { small: 'max-w-sm', medium: 'max-w-lg', large: 'max-w-3xl' };
  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const dialog = event.currentTarget;
        const focusable = [
          ...dialog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex], [contenteditable="true"]',
          ),
        ].filter(
          (element) =>
            !element.matches(':disabled') &&
            element.getClientRects().length &&
            (element.tabIndex >= 0 || element.isContentEditable),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) {
          event.preventDefault();
          dialog.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === dialog)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === dialog)
        ) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClick={(event) => {
        if (!closeOnBackdrop || event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose?.();
      }}
      className={cn(
        'fixed m-0 flex-col overflow-hidden border border-default bg-surface p-0 text-ink shadow-lg open:flex',
        isDrawer
          ? 'inset-y-0 right-0 left-auto h-dvh max-h-dvh w-full max-w-md'
          : 'top-1/2 left-1/2 max-h-[90dvh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-panel',
        !isDrawer && (widths[size] || widths.medium),
      )}
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-default p-5">
        <div>
          <h2 id={titleId} className="text-section font-semibold text-navy">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-1 text-body text-muted">
              {description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={onClose}
          aria-label="Close dialog"
          className="px-2"
        >
          <X aria-hidden="true" className="icon-md" />
        </Button>
      </header>
      <div tabIndex={0} className={cn('min-h-0 overflow-y-auto p-5', isDrawer && 'flex-1')}>
        {children}
      </div>
      {footer && (
        <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-default p-5">
          {footer}
        </footer>
      )}
    </dialog>
  );
}
