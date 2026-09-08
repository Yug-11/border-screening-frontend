import { useLocation } from 'react-router';
import PageHeader from '../../../components/ui/PageHeader';
import DemoScenarioSelector from '../../../features/screening/components/DemoScenarioSelector';
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
  const state = useScreeningResult(location.state?.demoScenario);
  const result = state.result;
  return (
    <>
      <PageHeader
        title="Passenger Screening Result"
        description="Automated document and identity screening summary."
        eyebrow={result.checkpoint}
        actions={<DemoScenarioSelector value={state.scenario} onChange={state.selectScenario} />}
      />
      <ScreeningResultHeader result={result} />
      <p role="status" className="sr-only">
        {result.label} demo selected. Risk score {result.score} out of 100. {result.decision}.
      </p>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:order-2">
          <ResultRiskAssessment result={result} />
          <OfficerDecisionActions state={state} />
          <div className="hidden lg:block">
            <RiskFactorList factors={result.factors} total={result.score} />
          </div>
        </div>
        <div className="min-w-0 space-y-6 lg:order-1 lg:col-span-2">
          <IdentitySummary passenger={result.passenger} />
          <ResultEvidenceSection title="Document Validation" checks={result.documentValidation} />
          <ResultEvidenceSection title="Tampering Analysis" checks={result.tamperingEvidence} />
          <ResultEvidenceSection
            title="MRZ Validation"
            checks={result.mrz.checks}
            status={result.mrz.status}
            explanation={result.mrz.reason}
          />
          <FaceVerificationCard face={result.face} />
          <ResultEvidenceSection
            title="Identity Intelligence"
            checks={result.identityIntelligence}
          />
        </div>
      </div>
      <div className="lg:hidden">
        <RiskFactorList factors={result.factors} total={result.score} />
      </div>
      <ScreeningTimeline events={result.timeline} />
      <ScreeningResultDrawer state={state} />
    </>
  );
}
