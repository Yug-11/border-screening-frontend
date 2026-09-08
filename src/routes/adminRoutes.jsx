import { Navigate } from 'react-router';
import AdminAlertsPage from '../pages/admin/alerts/AdminAlertsPage';
import CheckpointDetailPage from '../pages/admin/checkpoints/CheckpointDetailPage';
import CheckpointsPage from '../pages/admin/checkpoints/CheckpointsPage';
import AdminDashboardPage from '../pages/admin/dashboard/AdminDashboardPage';
import OfficerAssignmentPage from '../pages/admin/officers/OfficerAssignmentPage';
import PassengerDetailPage from '../pages/admin/passengers/PassengerDetailPage';
import PassengerHistoryPage from '../pages/admin/passengers/PassengerHistoryPage';
import AdminReportsPage from '../pages/admin/reports/AdminReportsPage';
import AdminSettingsPage from '../pages/admin/settings/AdminSettingsPage';

const adminRoutes = [
  { index: true, element: <AdminDashboardPage /> },
  { path: 'checkpoints', element: <CheckpointsPage /> },
  { path: 'checkpoints/:checkpointId', element: <CheckpointDetailPage /> },
  { path: 'officers', element: <OfficerAssignmentPage /> },
  { path: 'passengers', element: <PassengerDetailPage /> },
  { path: 'history', element: <PassengerHistoryPage /> },
  { path: 'alerts', element: <AdminAlertsPage /> },
  { path: 'reports', element: <AdminReportsPage /> },
  { path: 'settings', element: <AdminSettingsPage /> },
  { path: '*', element: <Navigate to="/admin" replace /> },
];

export default adminRoutes;
