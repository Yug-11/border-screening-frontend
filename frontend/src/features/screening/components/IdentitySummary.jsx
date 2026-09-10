import Card from '../../../components/ui/Card';

export default function IdentitySummary({ passenger = {} }) {
  const fields = [
    ['Name', passenger.name || 'N/A'],
    ['Date of Birth', passenger.dateOfBirth || 'N/A'],
    ['Nationality', passenger.nationality || 'N/A'],
    ['Document Number', passenger.document || 'N/A'],
    ['Document Expiry', passenger.documentExpiry || 'N/A'],
    ['Document Type', passenger.documentType || 'N/A'],
    ['Document Identifier', passenger.documentId || 'N/A'],
  ];

  return (
    <Card aria-labelledby="identity-summary-title">
      <h2
        id="identity-summary-title"
        className="mb-4 text-section font-semibold text-navy"
      >
        Identity Summary
      </h2>

      <dl className="grid gap-4 text-body sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-caption text-muted">
              {label}
            </dt>

            <dd className="mt-1 font-medium break-words">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-caption text-muted">
        Prototype screening uses synthetic test documents and reference
        records. This information is not a real passenger identity record.
      </p>
    </Card>
  );
}