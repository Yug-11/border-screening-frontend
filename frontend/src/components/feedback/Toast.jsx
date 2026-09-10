import AlertBanner from './AlertBanner';

export default function Toast({ open = false, onClose, title, children, variant = 'info' }) {
  return (
    <div
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="fixed right-4 bottom-4 left-4 z-40 sm:left-auto sm:w-96"
    >
      {open && (
        <div className="rounded-panel border border-default bg-surface shadow-md">
          <AlertBanner title={title} variant={variant} onDismiss={onClose}>
            {children}
          </AlertBanner>
        </div>
      )}
    </div>
  );
}
