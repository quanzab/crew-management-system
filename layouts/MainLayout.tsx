
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HelpWidget from '../components/HelpWidget';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-background p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <HelpWidget />
    </div>
  );
};

export default MainLayout;