import cn from '../../utils/cn';

export default function Card({
  title,
  description,
  actions,
  children,
  footer,
  padding = true,
  className,
  ...props
}) {
  return (
    <section
      {...props}
      className={cn(
        'min-w-0 rounded-panel border border-default bg-surface shadow-panel',
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-default px-5 py-4">
          <div>
            {title && <h3 className="text-card font-semibold text-navy">{title}</h3>}
            {description && <p className="mt-1 text-body text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={cn(padding && 'p-5')}>{children}</div>
      {footer && <div className="border-t border-default px-5 py-3">{footer}</div>}
    </section>
  );
}
