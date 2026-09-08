import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router';
import { Navigate, useNavigate } from 'react-router';
import AppHeader from '../components/layout/AppHeader';
import PageContainer from '../components/layout/PageContainer';
import TopNavigation from '../components/layout/TopNavigation';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';
import { dutyOfficerNavigation } from '../config/navigation';
import { mockDutyDashboard } from '../data/mockDutyDashboard';
import { clearDemoSession, hasDemoRole } from '../features/auth/demoSession';
import { useDutyData } from '../features/duty/DutyDataContext';
import { DutyDataProvider } from '../features/duty/DutyDataContext.jsx';

function DutyOfficerLayoutContent() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { systemName, checkpoint, officer } = mockDutyDashboard;
  const { alerts } = useDutyData();
  if (!hasDemoRole('duty-officer')) return <Navigate to="/login" replace />;
  function signOut() {
    clearDemoSession();
    navigate('/login', { replace: true });
  }
  return (
    <div className="min-h-svh bg-canvas">
      <a
        href="#duty-content"
        className="sr-only z-50 rounded-control bg-primary p-3 text-surface focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <AppHeader
        systemName={systemName}
        checkpoint={checkpoint}
        officer={officer}
        notifications={alerts}
        alertsPath="/duty-officer/alerts"
        roleLabel="Duty / Border Officer"
        onSignOut={signOut}
        demo
      />
      <div className="border-b border-default bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="hidden overflow-x-auto md:block">
            <TopNavigation items={dutyOfficerNavigation} label="Duty officer navigation" />
          </div>
          <p className="py-3 text-caption font-semibold text-muted md:sr-only">
            Duty / Border Officer
          </p>
          <Button
            variant="ghost"
            className="my-1 md:hidden"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="icon-md" />
            Navigation
          </Button>
        </div>
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Duty Officer Navigation">
        <TopNavigation
          items={dutyOfficerNavigation}
          label="Duty officer navigation"
          vertical
          onNavigate={() => setMenuOpen(false)}
        />
      </Drawer>
      <main id="duty-content" tabIndex={-1}>
        <PageContainer className="space-y-6">
          <Outlet />
        </PageContainer>
      </main>
      <footer className="mx-auto max-w-7xl border-t border-default px-4 py-4 text-caption text-muted sm:px-8">
        Fictional demonstration data. Status indicators are illustrative; no live services or
        authentication are connected.
      </footer>
    </div>
  );
}

export default function DutyOfficerLayout() {
  return (
    <DutyDataProvider>
      <DutyOfficerLayoutContent />
    </DutyDataProvider>
  );
}
