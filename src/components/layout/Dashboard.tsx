
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ActiveCall from '@/components/call/ActiveCall';
import { useCall } from '@/contexts/CallContext';

const Dashboard = () => {
  const { callStatus } = useCall();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
      {callStatus !== 'idle' && <ActiveCall />}
    </div>
  );
};

export default Dashboard;
