import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Checkbox from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import PageHeader from '../../../components/ui/PageHeader';
import Select from '../../../components/ui/Select';
import { initialAdminSettings } from '../../../data/mockAdminData';
import { useAdminData } from '../../../features/admin/AdminDataContext';
import { DemoNotice, DetailGrid } from '../../../features/admin/adminUtils';

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-control border border-default bg-canvas p-3 text-body font-semibold text-ink">
      <span>{label}</span>
      <Checkbox checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

export default function AdminSettingsPage() {
  const { settings, setSettings, resetSettings } = useAdminData();
  const [draft, setDraft] = useState(settings);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateSection(section, key, value) {
    setDraft((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  }

  function save() {
    const thresholds = draft.thresholds;
    if (
      Number(thresholds.lowMax) < 0 ||
      Number(thresholds.lowMax) >= Number(thresholds.mediumMin) ||
      Number(thresholds.mediumMin) > Number(thresholds.mediumMax) ||
      Number(thresholds.mediumMax) >= Number(thresholds.highMin) ||
      Number(thresholds.highMin) > 100
    ) {
      setError('Risk thresholds must remain ordered within 0–100.');
      setMessage('');
      return;
    }
    setSettings(draft);
    setError('');
    setMessage('Demo settings saved to local session state.');
  }

  function reset() {
    resetSettings();
    setDraft(initialAdminSettings);
    setError('');
    setMessage('Demo settings reset to defaults.');
  }

  return (
    <>
      <PageHeader title="Settings" description="UI-only administrative configuration for the fictional demo system." />
      <DemoNotice />
      {message && <p role="status" className="rounded-panel border border-default bg-success-soft p-3 text-body font-semibold text-success">{message}</p>}
      {error && <p role="alert" className="rounded-panel border border-default bg-danger-soft p-3 text-body font-semibold text-danger">{error}</p>}
      <Card title="System Settings">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="System Name" value={draft.systemName} onChange={(event) => setDraft({ ...draft, systemName: event.target.value })} />
          <Input label="Region" value={draft.region} onChange={(event) => setDraft({ ...draft, region: event.target.value })} />
          <Select label="Environment" value={draft.environment} onChange={(event) => setDraft({ ...draft, environment: event.target.value })} options={['Demo'].map((value) => ({ value, label: value }))} />
          <Select label="Timezone" value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })} options={['IST', 'UTC'].map((value) => ({ value, label: value }))} />
        </div>
      </Card>
      <Card title="Screening Settings" description="UI-only settings; no real screening services are connected.">
        <div className="grid gap-3 md:grid-cols-2">
          <ToggleField label="Automatic Low-Risk Clearance" checked={draft.screening.lowRiskClearance} onChange={(value) => updateSection('screening', 'lowRiskClearance', value)} />
          <ToggleField label="Medium-Risk Officer Review" checked={draft.screening.mediumRiskReview} onChange={(value) => updateSection('screening', 'mediumRiskReview', value)} />
          <ToggleField label="High-Risk Mandatory Review" checked={draft.screening.highRiskMandatoryReview} onChange={(value) => updateSection('screening', 'highRiskMandatoryReview', value)} />
          <ToggleField label="Face Verification" checked={draft.screening.faceVerification} onChange={(value) => updateSection('screening', 'faceVerification', value)} />
          <ToggleField label="MRZ Validation" checked={draft.screening.mrzValidation} onChange={(value) => updateSection('screening', 'mrzValidation', value)} />
          <ToggleField label="Document Tampering Detection" checked={draft.screening.tamperingDetection} onChange={(value) => updateSection('screening', 'tamperingDetection', value)} />
        </div>
      </Card>
      <Card title="Risk Thresholds" description="Demo configuration only. Low 0–39, Medium 40–69, High 70–100 by default.">
        <div className="grid gap-4 md:grid-cols-4">
          <Input label="Low Maximum" type="number" min="0" max="100" value={draft.thresholds.lowMax} onChange={(event) => updateSection('thresholds', 'lowMax', Number(event.target.value))} />
          <Input label="Medium Minimum" type="number" min="0" max="100" value={draft.thresholds.mediumMin} onChange={(event) => updateSection('thresholds', 'mediumMin', Number(event.target.value))} />
          <Input label="Medium Maximum" type="number" min="0" max="100" value={draft.thresholds.mediumMax} onChange={(event) => updateSection('thresholds', 'mediumMax', Number(event.target.value))} />
          <Input label="High Minimum" type="number" min="0" max="100" value={draft.thresholds.highMin} onChange={(event) => updateSection('thresholds', 'highMin', Number(event.target.value))} />
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Alert Settings">
          <div className="grid gap-3">
            <ToggleField label="High-Risk Alerts" checked={draft.alerts.highRisk} onChange={(value) => updateSection('alerts', 'highRisk', value)} />
            <ToggleField label="Checkpoint Offline Alerts" checked={draft.alerts.checkpointOffline} onChange={(value) => updateSection('alerts', 'checkpointOffline', value)} />
            <ToggleField label="System Health Alerts" checked={draft.alerts.systemHealth} onChange={(value) => updateSection('alerts', 'systemHealth', value)} />
            <ToggleField label="Officer Workload Alerts" checked={draft.alerts.officerWorkload} onChange={(value) => updateSection('alerts', 'officerWorkload', value)} />
          </div>
        </Card>
        <Card title="Checkpoint Settings">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Queue Warning Threshold" type="number" value={draft.checkpoints.queueWarning} onChange={(event) => updateSection('checkpoints', 'queueWarning', Number(event.target.value))} />
            <Input label="Queue Critical Threshold" type="number" value={draft.checkpoints.queueCritical} onChange={(event) => updateSection('checkpoints', 'queueCritical', Number(event.target.value))} />
            <Input label="Maximum Queue Capacity" type="number" value={draft.checkpoints.maxQueueCapacity} onChange={(event) => updateSection('checkpoints', 'maxQueueCapacity', Number(event.target.value))} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Notification Settings">
          <div className="grid gap-3">
            <ToggleField label="Dashboard Alerts" checked={draft.notifications.dashboardAlerts} onChange={(value) => updateSection('notifications', 'dashboardAlerts', value)} />
            <ToggleField label="Critical Alerts" checked={draft.notifications.criticalAlerts} onChange={(value) => updateSection('notifications', 'criticalAlerts', value)} />
            <ToggleField label="Officer Notifications" checked={draft.notifications.officerNotifications} onChange={(value) => updateSection('notifications', 'officerNotifications', value)} />
            <ToggleField label="System Notifications" checked={draft.notifications.systemNotifications} onChange={(value) => updateSection('notifications', 'systemNotifications', value)} />
          </div>
        </Card>
        <Card title="Access Control">
          <DetailGrid
            items={[
              { label: 'Admin', value: 'National oversight, checkpoints, officers, passengers, alerts, reports, settings' },
              { label: 'Surveillance Officer', value: 'Checkpoint monitoring, alert triage, surveillance reports' },
              { label: 'Duty Officer', value: 'Local queue, document capture, screening review, passenger decisions' },
            ]}
          />
          <p className="mt-3 text-caption text-muted">This display does not implement real authorization.</p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Audit Settings">
          <div className="grid gap-4 md:grid-cols-2">
            <ToggleField label="Audit Logging" checked={draft.audit.auditLogging} onChange={(value) => updateSection('audit', 'auditLogging', value)} />
            <Input label="Retention" type="number" min="1" value={draft.audit.retentionDays} endAdornment={<span className="px-2 text-caption text-muted">days</span>} onChange={(event) => updateSection('audit', 'retentionDays', Number(event.target.value))} />
          </div>
        </Card>
        <Card title="Security Settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Session Timeout" type="number" min="1" value={draft.security.sessionTimeout} endAdornment={<span className="px-2 text-caption text-muted">min</span>} onChange={(event) => updateSection('security', 'sessionTimeout', Number(event.target.value))} />
            <ToggleField label="Require Re-authentication" checked={draft.security.requireReauth} onChange={(value) => updateSection('security', 'requireReauth', value)} />
            <ToggleField label="Two-Factor Authentication" checked={draft.security.twoFactorDemo} onChange={(value) => updateSection('security', 'twoFactorDemo', value)} />
          </div>
          <p className="mt-3 text-caption text-muted">Security settings are UI-only and demo enabled.</p>
        </Card>
      </div>
      <Card>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={reset}>Reset to Defaults</Button>
          <Button onClick={save}>Save Changes</Button>
        </div>
      </Card>
    </>
  );
}
