
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneCall, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  avatar?: string;
}

const contacts: Contact[] = [
  { id: '1', name: 'John Smith', phone: '+1 (555) 123-4567', status: 'online' },
  { id: '2', name: 'Sarah Johnson', phone: '+1 (555) 234-5678', status: 'busy' },
  { id: '3', name: 'Michael Brown', phone: '+1 (555) 345-6789', status: 'away' },
  { id: '4', name: 'Emily Davis', phone: '+1 (555) 456-7890', status: 'offline' },
  { id: '5', name: 'Robert Wilson', phone: '+1 (555) 567-8901', status: 'online' },
];

const ContactItem = ({ contact }: { contact: Contact }) => {
  return (
    <div className="flex items-center py-3 border-b last:border-0">
      <div className="relative">
        <Avatar className="h-9 w-9">
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
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="font-medium truncate">{contact.name}</div>
        <div className="text-xs text-muted-foreground truncate">{contact.phone}</div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-telynx-600 hover:text-telynx-700 hover:bg-telynx-100">
          <PhoneCall className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-telynx-600 hover:text-telynx-700 hover:bg-telynx-100">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ContactsList = () => {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Contacts</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-0">
          {contacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsList;
