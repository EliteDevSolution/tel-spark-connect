
import React from 'react';
import ActivitySummary from '@/components/dashboard/ActivitySummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ContactsList from '@/components/dashboard/ContactsList';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Telynx Communications</p>
      </div>
      
      <ActivitySummary />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RecentActivity />
        <ContactsList />
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 h-[350px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Dial</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[270px]">
            <Phone className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-center text-muted-foreground">
              Click to start a new call
            </p>
            <Button variant="default" className="mt-4 bg-telynx-500 hover:bg-telynx-600">
              <Phone className="h-4 w-4 mr-2" />
              New Call
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default Dashboard;
