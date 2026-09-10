import Card from '../../../components/ui/Card';

export default function PassengerIdentityCard({ passenger }) {
  const fields = [
    ['Name', passenger.name],
    ['Demo Passenger ID', passenger.id],
    ['Date of Birth', passenger.dateOfBirth],
    ['Nationality', passenger.nationality],
    ['Document Type', passenger.documentType],
    ['Document Identifier', passenger.documentId],
    ['Issue Date', passenger.documentIssueDate],
    ['Expiry Date', passenger.documentExpiry],
  ];
  return (
    <Card aria-labelledby="passenger-identity-title">
      <h2 id="passenger-identity-title" className="mb-4 text-section font-semibold text-navy">
        Identity Information
      </h2>
      <dl className="grid gap-4 text-body sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-caption text-muted">{label}</dt>
            <dd className="mt-1 wrap-anywhere font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-caption text-muted">
        Fictional identity details only. No real personal or biometric information.
      </p>
    </Card>
  );
}
