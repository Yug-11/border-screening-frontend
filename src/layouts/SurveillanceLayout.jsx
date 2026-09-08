import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router';
import { Navigate, useNavigate } from 'react-router';
import AppHeader from '../components/layout/AppHeader';
import PageContainer from '../components/layout/PageContainer';
import TopNavigation from '../components/layout/TopNavigation';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';
import { surveillanceNavigation } from '../config/navigation';
import { useSurveillanceData } from '../features/surveillance/SurveillanceDataContext';
import { SurveillanceDataProvider } from '../features/surveillance/SurveillanceDataContext.jsx';
import { clearDemoSession, hasDemoRole } from '../features/auth/demoSession';

function SurveillanceLayoutContent() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { alerts } = useSurveillanceData();
  if (!hasDemoRole('surveillance-officer')) return <Navigate to="/login" replace />;
  function signOut() {
    clearDemoSession();
    navigate('/login', { replace: true });
  }
  return (
    <div className="min-h-svh bg-canvas">
      <a
        href="#surveillance-content"
        className="sr-only z-50 rounded-control bg-primary p-3 text-surface focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <AppHeader
        systemName="Border Security Screening System"
        checkpoint={{ name: 'Multi-checkpoint surveillance', status: 'Operational' }}
        officer={{ name: 'Surveillance Officer Demo', employeeId: 'SURV-DEMO-001' }}
        notifications={alerts.filter((alert) => alert.status !== 'Resolved').slice(0, 5)}
        alertsPath="/surveillance/alerts"
        roleLabel="Surveillance Officer"
        onSignOut={signOut}
        demo
      />
      <div className="border-b border-default bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="hidden overflow-x-auto lg:block">
            <TopNavigation items={surveillanceNavigation} label="Surveillance officer navigation" />
          </div>
          <p className="py-3 text-caption font-semibold text-muted lg:sr-only">
            Surveillance Officer
          </p>
          <Button
            variant="ghost"
            className="my-1 lg:hidden"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="icon-md" />
            Navigation
          </Button>
        </div>
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Surveillance Officer Navigation">
        <TopNavigation
          items={surveillanceNavigation}
          label="Surveillance officer navigation"
          vertical
          onNavigate={() => setMenuOpen(false)}
        />
      </Drawer>
      <main id="surveillance-content" tabIndex={-1}>
        <PageContainer className="space-y-6">
          <Outlet />
        </PageContainer>
      </main>
      <footer className="mx-auto max-w-7xl border-t border-default px-4 py-4 text-caption text-muted sm:px-8">
        Surveillance Officer demo module. Fictional local data only; no live feeds, external APIs,
        AI services, biometrics, or government systems are connected.
      </footer>
    </div>
  );
}

export default function SurveillanceLayout() {
  return (
    <SurveillanceDataProvider>
      <SurveillanceLayoutContent />
    </SurveillanceDataProvider>
  );
}
