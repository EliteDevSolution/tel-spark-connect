
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, ArrowUpRight, ArrowDownRight, MoreVertical, Search, X, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  contact: string;
  phoneNumber: string;
  time: string;
  duration: string;
  avatar?: string;
}

const callHistory: Call[] = [
  { id: '1', type: 'incoming', contact: 'John Smith', phoneNumber: '+1 (555) 123-4567', time: 'Today, 10:23 AM', duration: '4m 32s' },
  { id: '2', type: 'outgoing', contact: 'Sarah Johnson', phoneNumber: '+1 (555) 234-5678', time: 'Today, 9:45 AM', duration: '2m 15s' },
  { id: '3', type: 'missed', contact: 'Michael Brown', phoneNumber: '+1 (555) 345-6789', time: 'Yesterday', duration: '-' },
  { id: '4', type: 'incoming', contact: 'Emily Davis', phoneNumber: '+1 (555) 456-7890', time: 'Yesterday', duration: '1m 48s' },
  { id: '5', type: 'outgoing', contact: 'Robert Wilson', phoneNumber: '+1 (555) 567-8901', time: 'Yesterday', duration: '5m 23s' },
  { id: '6', type: 'incoming', contact: 'Jennifer Garcia', phoneNumber: '+1 (555) 678-9012', time: '2 days ago', duration: '3m 11s' },
  { id: '7', type: 'outgoing', contact: 'David Martinez', phoneNumber: '+1 (555) 789-0123', time: '2 days ago', duration: '1m 37s' },
  { id: '8', type: 'missed', contact: 'Lisa Rodriguez', phoneNumber: '+1 (555) 890-1234', time: '3 days ago', duration: '-' },
];

const CallDialer = () => {
  const [dialNumber, setDialNumber] = useState('');
  
  const handleNumberClick = (num: string) => {
    setDialNumber(prev => prev + num);
  };
  
  const handleClear = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };
  
  const dialPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-3xl font-semibold tracking-wider text-center min-h-16">
            {dialNumber || (
              <div className="text-muted-foreground text-lg">Enter phone number</div>
            )}
          </div>
          
          {dialNumber && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClear} 
              className="absolute right-8 top-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
            {dialPad.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {row.map(num => (
                  <Button
                    key={num}
                    variant="outline"
                    className="h-14 w-14 rounded-full text-lg"
                    onClick={() => handleNumberClick(num)}
                  >
                    {num}
                  </Button>
                ))}
              </React.Fragment>
            ))}
          </div>
          
          <Button 
            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
            disabled={!dialNumber}
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CallHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCalls = callHistory.filter(call => 
    call.contact.toLowerCase().includes(searchTerm.toLowerCase()) || 
    call.phoneNumber.includes(searchTerm)
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Call History</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search calls..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Phone Number</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.map((call) => (
              <TableRow key={call.id}>
                <TableCell>
                  {call.type === 'incoming' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                  )}
                  {call.type === 'outgoing' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  )}
                  {call.type === 'missed' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={call.avatar} alt={call.contact} />
                      <AvatarFallback className="bg-telynx-100 text-telynx-700">
                        {call.contact.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{call.contact}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{call.phoneNumber}</TableCell>
                <TableCell className="hidden md:table-cell">{call.time}</TableCell>
                <TableCell>{call.duration}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Contact</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const Calls = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calls</h1>
        <p className="text-muted-foreground">Manage your calls and history</p>
      </div>
      
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="dialer">Dialer</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-4">
          <CallHistory />
        </TabsContent>
        <TabsContent value="dialer" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <CallDialer />
            <div className="hidden md:block">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Recent Contacts</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
                  <UserCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Your frequent contacts will appear here for quick dialing
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calls;
