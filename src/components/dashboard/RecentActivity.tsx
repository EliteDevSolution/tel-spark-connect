
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare, ArrowUpRight, ArrowDownRight, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityType = 'call-in' | 'call-out' | 'message-in' | 'message-out';

interface Activity {
  id: string;
  type: ActivityType;
  contact: string;
  time: string;
  duration?: string;
  message?: string;
}

const activities: Activity[] = [
  { id: '1', type: 'call-in', contact: 'John Smith', time: '10:23 AM', duration: '4m 32s' },
  { id: '2', type: 'message-out', contact: 'Sarah Johnson', time: '9:45 AM', message: 'Hey, just checking in about the meeting later today.' },
  { id: '3', type: 'call-out', contact: 'Michael Brown', time: 'Yesterday', duration: '1m 15s' },
  { id: '4', type: 'message-in', contact: 'Emily Davis', time: 'Yesterday', message: 'Thanks for your help with the project!' },
  { id: '5', type: 'call-in', contact: 'Robert Wilson', time: 'Yesterday', duration: '2m 48s' },
];

const ActivityIcon = ({ type }: { type: ActivityType }) => {
  switch (type) {
    case 'call-in':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          <ArrowDownRight className="h-4 w-4" />
        </div>
      );
    case 'call-out':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      );
    case 'message-in':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
          <MessageSquare className="h-4 w-4" />
        </div>
      );
    case 'message-out':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <MessageSquare className="h-4 w-4" />
        </div>
      );
  }
};

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <div className="flex items-start py-3 border-b last:border-0">
      <ActivityIcon type={activity.type} />
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="font-medium truncate">{activity.contact}</div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </div>
        
        <div className="text-sm text-muted-foreground mt-0.5">
          {activity.type.startsWith('call') ? (
            <div className="flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1" />
              <span>
                {activity.type === 'call-in' ? 'Incoming' : 'Outgoing'} call 
                {activity.duration && ` · ${activity.duration}`}
              </span>
            </div>
          ) : (
            <div className="truncate">
              {activity.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-0">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
