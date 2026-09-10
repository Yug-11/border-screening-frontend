import Card from '../../../components/ui/Card';

export default function FaceVerificationCard({ face }) {
  /*
   * Face verification is optional for the current screening flow.
   * If no verification image was submitted, the backend returns null.
   */

  if (!face) {
    return (
      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-section font-semibold text-navy">
              Face Verification
            </h2>

            <p className="mt-1 text-caption text-muted">
              Identity verification using facial comparison.
            </p>
          </div>

          <div className="rounded-md border border-default bg-slate-50 p-4">
            <p className="font-medium text-navy">
              NOT PERFORMED
            </p>

            <p className="mt-1 text-caption text-muted">
              No verification image was submitted with this screening.
              Face comparison was therefore not performed.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const rawSimilarity =
    typeof face.similarity === 'number'
      ? face.similarity
      : null;

  const similarity =
    rawSimilarity !== null
      ? Math.abs(rawSimilarity) <= 1
        ? rawSimilarity * 100
        : rawSimilarity
      : null;

  const threshold =
    typeof face.threshold === 'number'
      ? face.threshold
      : null;

  const isMatch =
    face.match === true ||
    String(face.status).toUpperCase() === 'MATCH';

  const status =
    face.status ||
    (isMatch ? 'MATCH' : 'MISMATCH');

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2 className="text-section font-semibold text-navy">
            Face Verification
          </h2>

          <p className="mt-1 text-caption text-muted">
            Identity verification using facial comparison.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Verification Status
            </p>

            <p className="mt-1 font-semibold text-navy">
              {String(status).toUpperCase()}
            </p>
          </div>

          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Face Match
            </p>

            <p className="mt-1 font-semibold text-navy">
              {isMatch ? 'MATCH' : 'MISMATCH'}
            </p>
          </div>

          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Similarity
            </p>

            <p className="mt-1 font-semibold text-navy">
              {similarity !== null
                ? `${similarity.toFixed(2)}%`
                : 'N/A'}
            </p>
          </div>

          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Threshold
            </p>

            <p className="mt-1 font-semibold text-navy">
              {threshold !== null
                ? threshold.toFixed(2)
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Document Faces Detected
            </p>

            <p className="mt-1 font-semibold text-navy">
              {face.document_faces_detected ?? 'N/A'}
            </p>
          </div>

          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Verification Faces Detected
            </p>

            <p className="mt-1 font-semibold text-navy">
              {face.verification_faces_detected ?? 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}