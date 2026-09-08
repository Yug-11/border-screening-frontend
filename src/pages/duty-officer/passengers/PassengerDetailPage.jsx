import { useLocation, useNavigate, useParams } from 'react-router';
import AlertBanner from '../../../components/feedback/AlertBanner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import PageHeader from '../../../components/ui/PageHeader';
import CurrentDocumentCard from '../../../features/passengers/components/CurrentDocumentCard';
import PassengerActionBar from '../../../features/passengers/components/PassengerActionBar';
import PassengerAuditTrail from '../../../features/passengers/components/PassengerAuditTrail';
import PassengerIdentityCard from '../../../features/passengers/components/PassengerIdentityCard';
import PassengerScreeningSummary from '../../../features/passengers/components/PassengerScreeningSummary';
import {
  ScreeningHistoryTable,
  DocumentHistoryTable,
  PassengerAlertHistory,
  OfficerDecisionHistory,
} from '../../../features/passengers/components/PassengerHistoryTables';
import usePassengerDetails from '../../../features/passengers/hooks/usePassengerDetails';
import DemoScenarioSelector from '../../../features/screening/components/DemoScenarioSelector';
import ResultEvidenceSection from '../../../features/screening/components/ResultEvidenceSection';
import RiskFactorList from '../../../features/screening/components/RiskFactorList';

const breadcrumbs = [
  { label: 'Duty Officer', href: '/duty-officer/dashboard' },
  { label: 'Passenger History', href: '/duty-officer/history' },
  { label: 'Passenger Detail' },
];
function PassengerCase({ passengerId, initialScenario }) {
  const state = usePassengerDetails(passengerId, initialScenario);
  const navigate = useNavigate();
  const { details } = state;
  if (!details)
    return (
      <>
        <PageHeader
          title="Passenger Detail"
          description="Passenger identity, screening history, alerts, and audit information."
          breadcrumbs={breadcrumbs}
        />
        <EmptyState
          title="Demo passenger not found"
          description="No fictional case file is available for this passenger ID. No records were fetched."
          action={
            <Button onClick={() => navigate('/duty-officer/screening')}>
              Return to Live Screening
            </Button>
          }
        />
      </>
    );
  const result = details.latestScreening;
  return (
    <>
      <PageHeader
        title="Passenger Detail"
        description="Passenger identity, screening history, alerts, and audit information."
        breadcrumbs={breadcrumbs}
        eyebrow={result.checkpoint}
        actions={<DemoScenarioSelector value={state.scenario} onChange={state.selectScenario} />}
      />
      <PassengerScreeningSummary result={result} date={details.screeningDate} />
      {result.id !== 'low' && (
        <AlertBanner variant="warning" title="Officer review required">
          Automated screening identified one or more signals requiring human review. Fictional demo
          findings only; no determination of fraud.
        </AlertBanner>
      )}
      <PassengerActionBar state={state} />
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <PassengerIdentityCard passenger={details.passenger} />
        </div>
        <CurrentDocumentCard document={details.currentDocument} />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <ResultEvidenceSection
            title="Latest Screening"
            checks={details.latestChecks}
            explanation="Automated check outcomes from the same demo result. Completed does not mean every check passed. View Latest Screening for full evidence."
          />
        </div>
        <div className="min-w-0 space-y-4">
          <Card aria-labelledby="case-why-title">
            <h2 id="case-why-title" className="text-section font-semibold text-navy">
              Why this result?
            </h2>
            <p className="mt-3 text-body">{result.explanation}</p>
            {result.reviewReasons.length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-caption text-muted">
                {result.reviewReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
          </Card>
          <RiskFactorList factors={result.factors} total={result.score} />
        </div>
      </div>
      <ScreeningHistoryTable rows={details.screeningHistory} />
      <DocumentHistoryTable rows={details.documentHistory} />
      <div className="space-y-3">
        <ResultEvidenceSection
          title="Identity Intelligence"
          checks={details.identityIntelligence}
          explanation="Current demo reference-match signals, not a count of the historical rows below or a connection to any government database."
        />
        <dl className="text-body">
          <dt className="font-medium text-navy">Previous Checkpoints</dt>
          <dd className="mt-1 text-muted">{details.previousCheckpoints.join(' / ')}</dd>
        </dl>
      </div>
      <PassengerAlertHistory rows={details.alerts} />
      <OfficerDecisionHistory rows={details.officerDecisions} />
      <PassengerAuditTrail events={details.auditTrail} date={details.screeningDate} />
    </>
  );
}
export default function PassengerDetailPage() {
  const { passengerId } = useParams();
  const location = useLocation();
  return (
    <PassengerCase
      key={passengerId}
      passengerId={passengerId}
      initialScenario={location.state?.demoScenario}
    />
  );
}
