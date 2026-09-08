import Card from '../../../components/ui/Card';

export default function IdentitySummary({ passenger }) {
  const fields = [
    ['Name', passenger.name],
    ['Date of Birth', passenger.dateOfBirth],
    ['Nationality', passenger.nationality],
    ['Document', passenger.document],
    ['Document Expiry', passenger.documentExpiry],
    ['Document Type', passenger.documentType],
    ['Demo Document Identifier', passenger.documentId],
  ];
  return (
    <Card aria-labelledby="identity-summary-title">
      <h2 id="identity-summary-title" className="mb-4 text-section font-semibold text-navy">
        Identity Summary
      </h2>
      <dl className="grid gap-4 text-body sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-caption text-muted">{label}</dt>
            <dd className="mt-1 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-caption text-muted">
        All identity details are fictional. This is not a real document or passenger record.
      </p>
    </Card>
  );
}
