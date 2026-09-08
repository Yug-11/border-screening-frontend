import { Navigate } from 'react-router';
import DutyDashboardPage from '../pages/duty-officer/dashboard/DutyDashboardPage';
import DutyRoutePlaceholder from '../pages/duty-officer/DutyRoutePlaceholder';
import DutyAlertsPage from '../pages/duty-officer/alerts/DutyAlertsPage';
import LivePassengerQueuePage from '../pages/duty-officer/screening/LivePassengerQueuePage';
import DocumentUploadPage from '../pages/duty-officer/documents/DocumentUploadPage';
import ScreeningProgressPage from '../pages/duty-officer/screening/ScreeningProgressPage';
import ScreeningResultPage from '../pages/duty-officer/screening/ScreeningResultPage';
import PassengerDetailPage from '../pages/duty-officer/passengers/PassengerDetailPage';
import DutyPassengerHistoryPage from '../pages/duty-officer/passengers/DutyPassengerHistoryPage';
import DutyReportsPage from '../pages/duty-officer/reports/DutyReportsPage';

const dutyOfficerRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <DutyDashboardPage /> },
  { path: 'screening', element: <LivePassengerQueuePage /> },
  { path: 'screening/queue', element: <Navigate to="/duty-officer/screening" replace /> },
  { path: 'documents', element: <DocumentUploadPage /> },
  { path: 'screening/progress', element: <ScreeningProgressPage /> },
  { path: 'screening/result', element: <ScreeningResultPage /> },
  { path: 'passengers/:passengerId', element: <PassengerDetailPage /> },
  { path: 'passengers/history', element: <DutyPassengerHistoryPage /> },
  { path: 'history', element: <Navigate to="/duty-officer/passengers/history" replace /> },
  { path: 'alerts', element: <DutyAlertsPage /> },
  { path: 'reports', element: <DutyReportsPage /> },
  { path: '*', element: <DutyRoutePlaceholder title="Page unavailable" /> },
];

export default dutyOfficerRoutes;
