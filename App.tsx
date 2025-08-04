
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import { useAuth } from './hooks/useAuth';
import { useHotkeys } from './hooks/useHotkeys';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CrewListPage from './pages/CrewListPage';
import VesselListPage from './pages/VesselListPage';
import PayrollPage from './pages/PayrollPage';
import CompliancePage from './pages/CompliancePage';
import PrincipalListPage from './pages/PrincipalListPage';
import AppraisalsPage from './pages/AppraisalsPage';
import JobAssignmentPage from './pages/JobAssignmentPage';
import SurveyorPage from './pages/SurveyorPage';
import BillingPage from './pages/BillingPage';
import AIPlannerPage from './pages/AIPlannerPage';
import AIHRAssistantPage from './pages/AIHRAssistantPage';
import ReportsPage from './pages/ReportsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ECrewLayout from './layouts/ECrewLayout';
import ECrewProfilePage from './pages/ECrewProfilePage';
import ECrewPayrollPage from './pages/ECrewPayrollPage';
import SessionTimeoutModal from './components/SessionTimeoutModal';
import SessionExpiredOverlay from './components/SessionExpiredOverlay';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import WhatsNewModal from './components/WhatsNewModal';
import CommandPalette from './components/CommandPalette';

function AppRoutes() {
  const { isSessionExpired, isWarningVisible, countdown, extendSession, logout, isAuthenticated, isWhatsNewVisible, whatsNewContent, dismissWhatsNew } = useAuth();
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useHotkeys({
    'mod+p': (e) => {
      e.preventDefault();
      setCommandPaletteOpen(prev => !prev);
    }
  });
  
  if (isSessionExpired) {
    return <SessionExpiredOverlay />;
  }
  
  return (
    <>
      {isAuthenticated && (
        <SessionTimeoutModal
          isOpen={isWarningVisible}
          countdown={countdown}
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
      <ToastContainer />
      <WhatsNewModal
        isOpen={isWhatsNewVisible}
        onClose={dismissWhatsNew}
        content={whatsNewContent}
      />
      {isAuthenticated && (
          <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Portal Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crew" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'crewing_officer']}><CrewListPage /></ProtectedRoute>} />
          <Route path="vessels" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'crewing_officer']}><VesselListPage /></ProtectedRoute>} />
          <Route path="payroll" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><PayrollPage /></ProtectedRoute>} />
          <Route path="compliance" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><CompliancePage /></ProtectedRoute>} />
          <Route path="principals" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><PrincipalListPage /></ProtectedRoute>} />
          <Route path="appraisals" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'crewing_officer']}><AppraisalsPage /></ProtectedRoute>} />
          <Route path="jobs" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'crewing_officer']}><JobAssignmentPage /></ProtectedRoute>} />
          <Route path="surveyor" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><SurveyorPage /></ProtectedRoute>} />
          <Route path="billing" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><BillingPage /></ProtectedRoute>} />
          <Route path="planner" element={<ProtectedRoute allowedRoles={['admin']}><AIPlannerPage /></ProtectedRoute>} />
          <Route path="hr-assistant" element={<ProtectedRoute allowedRoles={['admin']}><AIHRAssistantPage /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><ReportsPage /></ProtectedRoute>} />
          <Route path="audit-trail" element={<ProtectedRoute allowedRoles={['admin']}><AuditTrailPage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Crew Self-Service Portal (eCrew) Routes */}
        <Route path="/ecrew" element={<ProtectedRoute allowedRoles={['crew']}><ECrewLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ECrewProfilePage />} />
          <Route path="payroll" element={<ECrewPayrollPage />} />
        </Route>
      </Routes>
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <SettingsProvider>
            <NotificationProvider>
                <HashRouter>
                  <AppRoutes />
                </HashRouter>
            </NotificationProvider>
          </SettingsProvider>
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
