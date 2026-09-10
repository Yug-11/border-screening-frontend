import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import LoginPage from '../pages/auth/LoginPage';
import DesignSystemPage from '../pages/DesignSystemPage';
import DutyOfficerLayout from '../layouts/DutyOfficerLayout';
import AdminLayout from '../layouts/AdminLayout';
import SurveillanceLayout from '../layouts/SurveillanceLayout';
import adminRoutes from './adminRoutes';
import dutyOfficerRoutes from './dutyOfficerRoutes';
import surveillanceRoutes from './surveillanceRoutes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/duty-officer" element={<DutyOfficerLayout />}>
          {dutyOfficerRoutes.map((route) => (
            <Route key={route.path || 'index'} {...route} />
          ))}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route) => (
            <Route key={route.path || 'index'} {...route} />
          ))}
        </Route>
        <Route path="/surveillance" element={<SurveillanceLayout />}>
          {surveillanceRoutes.map((route) => (
            <Route key={route.path || 'index'} {...route} />
          ))}
        </Route>
        <Route path="*" element={null} />
      </Routes>
    </BrowserRouter>
  );
}
