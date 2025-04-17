
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, UserPlus, MoreVertical, Phone, MessageSquare, Star, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  favorite: boolean;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
}

const contacts: Contact[] = [
  { id: '1', name: 'John Smith', phone: '+1 (555) 123-4567', email: 'john.smith@example.com', company: 'Acme Inc.', favorite: true, status: 'online' },
  { id: '2', name: 'Sarah Johnson', phone: '+1 (555) 234-5678', email: 'sarah.johnson@example.com', company: 'Globex Corp', favorite: false, status: 'busy' },
  { id: '3', name: 'Michael Brown', phone: '+1 (555) 345-6789', email: 'michael.brown@example.com', company: 'Initech', favorite: false, status: 'away' },
  { id: '4', name: 'Emily Davis', phone: '+1 (555) 456-7890', email: 'emily.davis@example.com', company: 'Umbrella Corp', favorite: true, status: 'offline' },
  { id: '5', name: 'Robert Wilson', phone: '+1 (555) 567-8901', email: 'robert.wilson@example.com', company: 'Stark Industries', favorite: false, status: 'online' },
  { id: '6', name: 'Jennifer Garcia', phone: '+1 (555) 678-9012', email: 'jennifer.garcia@example.com', company: 'Wayne Enterprises', favorite: true, status: 'online' },
  { id: '7', name: 'David Martinez', phone: '+1 (555) 789-0123', email: 'david.martinez@example.com', company: 'Cyberdyne Systems', favorite: false, status: 'offline' },
  { id: '8', name: 'Lisa Rodriguez', phone: '+1 (555) 890-1234', email: 'lisa.rodriguez@example.com', company: 'Massive Dynamic', favorite: false, status: 'away' },
];

const ContactList = ({ filteredContacts }: { filteredContacts: Contact[] }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Company</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="w-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8",
                    contact.favorite ? "text-yellow-400" : "text-muted-foreground"
                  )}
                >
                  <Star className="h-4 w-4" fill={contact.favorite ? "currentColor" : "none"} />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback className="bg-telynx-100 text-telynx-700">
                        {contact.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      "status-indicator absolute -bottom-0.5 -right-0.5 border-2 border-white",
                      `status-${contact.status}`
                    )}></span>
                  </div>
                  <div className="font-medium">{contact.name}</div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{contact.phone}</TableCell>
              <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
              <TableCell className="hidden lg:table-cell">{contact.company || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-telynx-600 hover:text-telynx-700 hover:bg-telynx-100">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-telynx-600 hover:text-telynx-700 hover:bg-telynx-100">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ContactCards = ({ filteredContacts }: { filteredContacts: Contact[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredContacts.map((contact) => (
        <Card key={contact.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-telynx-100 text-telynx-700 text-lg">
                      {contact.name.split(' ').map(name => name[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    "status-indicator status-online absolute -bottom-0.5 -right-0.5 border-2 border-white",
                    `status-${contact.status}`
                  )}></span>
                </div>
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  {contact.company && (
                    <p className="text-xs text-muted-foreground">{contact.company}</p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8",
                  contact.favorite ? "text-yellow-400" : "text-muted-foreground"
                )}
              >
                <Star className="h-4 w-4" fill={contact.favorite ? "currentColor" : "none"} />
              </Button>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="truncate">{contact.email}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Contacts = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
    if (filter === 'favorites') {
      return matchesSearch && contact.favorite;
    }
    
    return matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">Manage your contacts</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'favorites')} className="mr-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="icon" className={cn(view === 'grid' ? 'bg-muted' : '')} onClick={() => setView('grid')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </Button>
          <Button variant="outline" size="icon" className={cn(view === 'list' ? 'bg-muted' : '')} onClick={() => setView('list')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
          
          <Button className="ml-2 bg-telynx-500 hover:bg-telynx-600">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {view === 'list' ? (
            <ContactList filteredContacts={filteredContacts} />
          ) : (
            <ContactCards filteredContacts={filteredContacts} />
          )}
          
          {filteredContacts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contacts found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
