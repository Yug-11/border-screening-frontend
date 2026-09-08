import Breadcrumbs from './Breadcrumbs';

export default function PageHeader({ title, description, breadcrumbs, actions, eyebrow }) {
  return (
    <header className="space-y-4">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-2 text-caption font-semibold tracking-wider text-muted uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-page font-semibold tracking-tight text-navy">{title}</h1>
          {description && <p className="mt-2 text-body text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
