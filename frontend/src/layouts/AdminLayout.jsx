import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router';
import { Navigate, useNavigate } from 'react-router';
import AppHeader from '../components/layout/AppHeader';
import PageContainer from '../components/layout/PageContainer';
import TopNavigation from '../components/layout/TopNavigation';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';
import { adminNavigation } from '../config/navigation';
import { useAdminData } from '../features/admin/AdminDataContext';
import { AdminDataProvider } from '../features/admin/AdminDataContext.jsx';
import { clearDemoSession, hasDemoRole } from '../features/auth/demoSession';

function AdminLayoutContent() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { alerts } = useAdminData();
  if (!hasDemoRole('admin')) return <Navigate to="/login" replace />;
  function signOut() {
    clearDemoSession();
    navigate('/login', { replace: true });
  }
  return (
    <div className="min-h-svh bg-canvas">
      <a
        href="#admin-content"
        className="sr-only z-50 rounded-control bg-primary p-3 text-surface focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <AppHeader
        systemName="Border Security Screening System"
        checkpoint={{ name: 'National Border Network', status: 'Operational' }}
        officer={{ name: 'Admin Demo User', employeeId: 'ADMIN-DEMO-001' }}
        notifications={alerts.filter((alert) => alert.status !== 'Resolved').slice(0, 5)}
        alertsPath="/admin/alerts"
        roleLabel="Admin"
        onSignOut={signOut}
        demo
      />
      <div className="border-b border-default bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="hidden overflow-x-auto lg:block">
            <TopNavigation items={adminNavigation} label="Admin navigation" />
          </div>
          <p className="py-3 text-caption font-semibold text-muted lg:sr-only">Admin Console</p>
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
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Admin Navigation">
        <TopNavigation
          items={adminNavigation}
          label="Admin navigation"
          vertical
          onNavigate={() => setMenuOpen(false)}
        />
      </Drawer>
      <main id="admin-content" tabIndex={-1}>
        <PageContainer className="space-y-6">
          <Outlet />
        </PageContainer>
      </main>
      <footer className="mx-auto max-w-7xl border-t border-default px-4 py-4 text-caption text-muted sm:px-8">
        Complete frontend demonstration using fictional local data only. No live services,
        authentication, identity databases, or government systems are connected.
      </footer>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminDataProvider>
      <AdminLayoutContent />
    </AdminDataProvider>
  );
}
