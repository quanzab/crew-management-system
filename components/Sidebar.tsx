


import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { DashboardIcon } from './icons/DashboardIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ShipIcon } from './icons/ShipIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { LogOutIcon } from './icons/LogOutIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { FilePlusIcon } from './icons/FilePlusIcon';
import { CameraIcon } from './icons/CameraIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { RobotIcon } from './icons/RobotIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { FileBarChartIcon } from './icons/FileBarChartIcon';
import { HistoryIcon } from './icons/HistoryIcon';

const NavItem: React.FC<{ to: string; children: React.ReactNode; }> = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-400 hover:bg-muted hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  );
};


const Sidebar: React.FC = () => {
  const { logout, authenticatedUser } = useAuth();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-10">
          <img src={authenticatedUser?.avatarUrl || "https://picsum.photos/40/40"} alt="Logo" className="rounded-full mr-3"/>
          <h1 className="text-xl font-bold text-card-foreground">CMS Pro</h1>
        </div>
        <nav className="space-y-2">
          <NavItem to="/dashboard">
            <DashboardIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavItem>
           {permissions.canAccessAIPlanner && (
            <NavItem to="/planner">
              <SparklesIcon className="h-5 w-5 mr-3" />
              AI Planner
            </NavItem>
           )}
          {permissions.canAccessAIHRAssistant && (
            <NavItem to="/hr-assistant">
              <RobotIcon className="h-5 w-5 mr-3" />
              AI HR Assistant
            </NavItem>
          )}
          {permissions.canAccessCrew && (
            <NavItem to="/crew">
              <UsersIcon className="h-5 w-5 mr-3" />
              Crew
            </NavItem>
          )}
          {permissions.canAccessVessels && (
            <NavItem to="/vessels">
              <ShipIcon className="h-5 w-5 mr-3" />
              Vessels
            </NavItem>
          )}
          {permissions.canAccessPayroll && (
            <NavItem to="/payroll">
              <DollarSignIcon className="h-5 w-5 mr-3" />
              Payroll
            </NavItem>
          )}
          {permissions.canAccessCompliance && (
            <NavItem to="/compliance">
              <ShieldIcon className="h-5 w-5 mr-3" />
              Compliance
            </NavItem>
          )}
          {permissions.canAccessPrincipals && (
            <NavItem to="/principals">
              <BriefcaseIcon className="h-5 w-5 mr-3" />
              Principals
            </NavItem>
          )}
          {permissions.canAccessAppraisals && (
            <NavItem to="/appraisals">
              <ClipboardIcon className="h-5 w-5 mr-3" />
              Appraisals
            </NavItem>
          )}
          {permissions.canAccessJobs && (
            <NavItem to="/jobs">
              <FilePlusIcon className="h-5 w-5 mr-3" />
              Jobs
            </NavItem>
          )}
          {permissions.canAccessSurveyor && (
            <NavItem to="/surveyor">
              <CameraIcon className="h-5 w-5 mr-3" />
              Surveyor
            </NavItem>
          )}
          {permissions.canAccessBilling && (
            <NavItem to="/billing">
              <CreditCardIcon className="h-5 w-5 mr-3" />
              Billing
            </NavItem>
          )}
          {permissions.canAccessReports && (
            <NavItem to="/reports">
              <FileBarChartIcon className="h-5 w-5 mr-3" />
              Reporting
            </NavItem>
          )}
          {permissions.canAccessAuditTrail && (
            <NavItem to="/audit-trail">
              <HistoryIcon className="h-5 w-5 mr-3" />
              Audit Trail
            </NavItem>
          )}
        </nav>
      </div>
      <div className="space-y-2">
         {permissions.canAccessSettings && (
          <NavItem to="/settings">
              <SettingsIcon className="h-5 w-5 mr-3" />
              Settings
          </NavItem>
         )}
        <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-400 hover:bg-muted hover:text-white">
            <LogOutIcon className="h-5 w-5 mr-3" />
            Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;