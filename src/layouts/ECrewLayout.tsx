
import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { LogOutIcon } from '../components/icons/LogOutIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { DollarSignIcon } from '../components/icons/DollarSignIcon';
import ThemeToggle from '../components/ThemeToggle';

const ECrewLayout: React.FC = () => {
    const { currentCrewId, logout } = useAuth();
    const { crew } = useData();
    const navigate = useNavigate();

    const currentUser = crew.find(c => c.id === currentCrewId);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // Declarative redirect. If there's no user, redirect immediately during render.
    // This is safer than a useEffect-based navigation and fixes React Error #525.
    if (!currentUser) {
        return <Navigate to="/dashboard" replace />;
    }

    const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
         <NavLink to={to} className={({ isActive }) =>
            `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-muted hover:text-white'
            }`
        }>
            {children}
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-background">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-card p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <img src={currentUser.avatarUrl} alt="Logo" className="w-10 h-10 rounded-full mr-3"/>
                        <h1 className="text-xl font-bold text-card-foreground truncate">{currentUser.name}</h1>
                    </div>
                    <nav className="space-y-2">
                        <NavItem to="/ecrew/profile">
                            <UsersIcon className="h-5 w-5 mr-3" />
                            My Profile
                        </NavItem>
                        <NavItem to="/ecrew/payroll">
                            <DollarSignIcon className="h-5 w-5 mr-3" />
                            My Payroll
                        </NavItem>
                    </nav>
                </div>
                <div>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-400 hover:bg-muted hover:text-white">
                        <LogOutIcon className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-muted p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-foreground">eCrew Portal</h2>
                    <ThemeToggle />
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-background p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ECrewLayout;
