import { Navigate } from 'react-router';
import SurveillanceAlertsPage from '../pages/surveillance/alerts/SurveillanceAlertsPage';
import CheckpointDetailPage from '../pages/surveillance/checkpoints/CheckpointDetailPage';
import MyCheckpointsPage from '../pages/surveillance/checkpoints/MyCheckpointsPage';
import SurveillanceDashboardPage from '../pages/surveillance/dashboard/SurveillanceDashboardPage';
import SurveillanceHistoryPage from '../pages/surveillance/history/SurveillanceHistoryPage';
import OfficerAccessManagementPage from '../pages/surveillance/officers/OfficerAccessManagementPage';
import PassengerDetailPage from '../pages/surveillance/passengers/PassengerDetailPage';
import SurveillanceReportsPage from '../pages/surveillance/reports/SurveillanceReportsPage';
import LiveScreeningPage from '../pages/surveillance/screening/LiveScreeningPage';

const surveillanceRoutes = [
  { index: true, element: <SurveillanceDashboardPage /> },
  { path: 'checkpoints', element: <MyCheckpointsPage /> },
  { path: 'checkpoints/:checkpointId', element: <CheckpointDetailPage /> },
  { path: 'screening', element: <LiveScreeningPage /> },
  { path: 'alerts', element: <SurveillanceAlertsPage /> },
  { path: 'officers', element: <OfficerAccessManagementPage /> },
  { path: 'history', element: <SurveillanceHistoryPage /> },
  { path: 'reports', element: <SurveillanceReportsPage /> },
  { path: 'passengers/:passengerId', element: <PassengerDetailPage /> },
  { path: '*', element: <Navigate to="/surveillance" replace /> },
];

export default surveillanceRoutes;
