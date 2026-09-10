import { useLocation, useNavigate } from 'react-router';

import AlertBanner from '../../../components/feedback/AlertBanner';
import PageHeader from '../../../components/ui/PageHeader';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import FaceVerificationCard from '../../../features/screening/components/FaceVerificationCard';
import IdentitySummary from '../../../features/screening/components/IdentitySummary';
import OfficerDecisionActions from '../../../features/screening/components/OfficerDecisionActions';
import ResultEvidenceSection from '../../../features/screening/components/ResultEvidenceSection';
import ResultRiskAssessment from '../../../features/screening/components/ResultRiskAssessment';
import RiskFactorList from '../../../features/screening/components/RiskFactorList';
import ScreeningResultDrawer from '../../../features/screening/components/ScreeningResultDrawer';
import ScreeningResultHeader from '../../../features/screening/components/ScreeningResultHeader';
import ScreeningTimeline from '../../../features/screening/components/ScreeningTimeline';

import useScreeningResult from '../../../features/screening/hooks/useScreeningResult';

export default function ScreeningResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const screeningId =
    location.state?.screeningId;

  const state =
    useScreeningResult(
      screeningId,
    );

  const result = state.result;

  /*
   * -------------------------------------------------------------
   * Missing screening ID
   * -------------------------------------------------------------
   */

  if (!screeningId) {
    return (
      <>
        <PageHeader
          title="Passenger Screening Result"
          description="Automated document and identity screening summary."
          eyebrow="Screening Result"
        />

        <AlertBanner
          variant="danger"
          title="Screening ID missing"
        >
          No screening ID was provided. Return to the screening
          progress page and complete a screening first.
        </AlertBanner>

        <button
          type="button"
          className="mt-4 rounded-md bg-navy px-4 py-2 text-white"
          onClick={() =>
            navigate(
              '/duty-officer/documents',
            )
          }
        >
          Return to Document Capture
        </button>
      </>
    );
  }

  /*
   * -------------------------------------------------------------
   * Loading
   * -------------------------------------------------------------
   */

  if (state.loading && !result) {
    return (
      <>
        <PageHeader
          title="Passenger Screening Result"
          description="Loading the completed screening result."
          eyebrow="Live Backend Screening"
        />

        <div className="flex min-h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-muted">
            <LoadingSpinner />
            <span>
              Loading screening result...
            </span>
          </div>
        </div>
      </>
    );
  }

  /*
   * -------------------------------------------------------------
   * Error
   * -------------------------------------------------------------
   */

  if (state.error && !result) {
    return (
      <>
        <PageHeader
          title="Passenger Screening Result"
          description="Automated document and identity screening summary."
          eyebrow="Live Backend Screening"
        />

        <AlertBanner
          variant="danger"
          title="Unable to load screening result"
          announce
        >
          {state.error}
        </AlertBanner>

        <div className="mt-4 flex flex-wrap gap-3">

          <button
            type="button"
            className="rounded-md bg-navy px-4 py-2 text-white"
            onClick={state.reload}
          >
            Try Again
          </button>

          <button
            type="button"
            className="rounded-md border border-default px-4 py-2"
            onClick={() =>
              navigate(
                '/duty-officer/documents',
              )
            }
          >
            New Screening
          </button>

        </div>
      </>
    );
  }

  /*
   * -------------------------------------------------------------
   * Result is available
   * -------------------------------------------------------------
   */

  return (
    <>
      <PageHeader
        title="Passenger Screening Result"
        description="Automated document and identity screening summary."
        eyebrow={
          result.checkpoint ||
          'Live Backend Screening'
        }
      />

      <ScreeningResultHeader
        result={result}
      />

      <p
        role="status"
        className="sr-only"
      >
        {result.label}. Risk score{' '}
        {result.score} out of 100.{' '}
        {result.decision}.
      </p>

      {state.error && (
        <div className="mt-4">
          <AlertBanner
            variant="warning"
            title="Result refresh warning"
          >
            {state.error}
          </AlertBanner>
        </div>
      )}

      {state.finalizationError && (
        <div className="mt-4">
          <AlertBanner
            variant="danger"
            title="Decision could not be recorded"
            announce
          >
            {state.finalizationError}
          </AlertBanner>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-3">

        {/* -------------------------------------------------------
            RIGHT SIDE — RISK / OFFICER ACTIONS
        ------------------------------------------------------- */}

        <div className="min-w-0 space-y-6 lg:order-2">

          <ResultRiskAssessment
            result={result}
          />

          <OfficerDecisionActions
            state={state}
          />

          <div className="hidden lg:block">
            <RiskFactorList
              factors={
                result.factors || []
              }
              total={
                result.score || 0
              }
            />
          </div>

        </div>

        {/* -------------------------------------------------------
            LEFT SIDE — EVIDENCE
        ------------------------------------------------------- */}

        <div className="min-w-0 space-y-6 lg:order-1 lg:col-span-2">

          <IdentitySummary
            passenger={
              result.passenger
            }
          />

          <ResultEvidenceSection
            title="Document Validation"
            checks={
              result.documentValidation ||
              []
            }
          />

          <ResultEvidenceSection
            title="Tampering Analysis"
            checks={
              result.tamperingEvidence ||
              []
            }
          />

          <ResultEvidenceSection
            title="MRZ Validation"
            checks={
              result.mrz?.checks ||
              []
            }
            status={
              result.mrz?.status
            }
            explanation={
              result.mrz?.reason
            }
          />

          <FaceVerificationCard
            face={result.face}
          />

          <ResultEvidenceSection
            title="Identity Intelligence"
            checks={
              result.identityIntelligence ||
              []
            }
          />

          {/* Integrity information */}
          <IntegrityCard
            integrity={
              result.integrity
            }
            blockchain={
              result.blockchain
            }
          />

        </div>

      </div>

      {/* Mobile risk factors */}
      <div className="lg:hidden">
        <RiskFactorList
          factors={
            result.factors || []
          }
          total={
            result.score || 0
          }
        />
      </div>

      <ScreeningTimeline
        events={
          result.timeline || []
        }
      />

      <ScreeningResultDrawer
        state={state}
      />
    </>
  );
}

/*
 * ---------------------------------------------------------------
 * Integrity / Blockchain card
 * ---------------------------------------------------------------
 */

function IntegrityCard({
  integrity,
  blockchain,
}) {
  if (
    !integrity &&
    !blockchain
  ) {
    return null;
  }

  return (
    <section
      className="rounded-lg border border-default bg-white p-5"
      aria-labelledby="integrity-title"
    >
      <div className="mb-4">
        <h2
          id="integrity-title"
          className="text-section font-semibold text-navy"
        >
          Record Integrity
        </h2>

        <p className="mt-1 text-caption text-muted">
          Cryptographic integrity information for the completed
          screening record.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        {integrity && (
          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              SHA-256 Integrity
            </p>

            <p className="mt-1 font-semibold text-navy">
              {integrity.status ||
                'AVAILABLE'}
            </p>

            {integrity.hash && (
              <p className="mt-2 break-all font-mono text-caption text-muted">
                {integrity.hash}
              </p>
            )}
          </div>
        )}

        {blockchain && (
          <div className="rounded-md border border-default p-4">
            <p className="text-caption text-muted">
              Blockchain Proof
            </p>

            <p className="mt-1 font-semibold text-navy">
              {blockchain.status ||
                'AVAILABLE'}
            </p>

            {blockchain.network && (
              <p className="mt-1 text-caption text-muted">
                Network:{' '}
                {blockchain.network}
              </p>
            )}

            {blockchain.transaction_id && (
              <p className="mt-2 break-all font-mono text-caption text-muted">
                TX:{' '}
                {
                  blockchain.transaction_id
                }
              </p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}