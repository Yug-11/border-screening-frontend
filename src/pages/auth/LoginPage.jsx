import { LockKeyhole } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Card from '../../components/ui/Card';
import InstitutionalPanel from '../../features/auth/components/InstitutionalPanel';
import LoginForm from '../../features/auth/components/LoginForm';
import SecurityNetworkIndicator from '../../features/auth/components/SecurityNetworkIndicator';

export default function LoginPage() {
  return (
    <AuthLayout institutionalContent={<InstitutionalPanel />}>
      <div className="mb-4 flex items-center gap-2 text-caption font-semibold tracking-wider text-muted uppercase">
        <LockKeyhole aria-hidden="true" className="icon-sm" />
        Authorized personnel access
      </div>
      <Card padding={false} aria-labelledby="sign-in-title">
        <div id="sign-in" tabIndex={-1} className="scroll-mt-4 p-5 sm:p-6">
          <header className="mb-5 space-y-2">
            <h2 id="sign-in-title" className="text-page font-semibold text-navy">
              Sign in
            </h2>
            <p className="text-body text-muted">
              Enter your authorized credentials to access the border screening system.
            </p>
          </header>
          <LoginForm />
        </div>
        <div className="border-t border-default bg-canvas px-5 py-4 sm:px-6">
          <SecurityNetworkIndicator />
        </div>
      </Card>
      <p className="mt-4 text-center text-caption text-muted">
        Fictional prototype. Not connected to government systems.
      </p>
    </AuthLayout>
  );
}
