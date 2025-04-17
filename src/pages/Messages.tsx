import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Phone, MoreVertical, Search, Send, Paperclip, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  time: string;
  senderId: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  contact: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'busy' | 'away';
    lastActive?: string;
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
  };
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 'c1',
    contact: {
      id: 'u1',
      name: 'John Smith',
      status: 'online',
    },
    lastMessage: {
      text: "I'll be there in 5 minutes",
      time: '10:23 AM',
      isRead: true,
    },
    messages: [
      { id: 'm1', text: "Hey, are we still meeting today?", time: '10:15 AM', senderId: 'u1', isMe: false },
      { id: 'm2', text: "Yes, what time works for you?", time: '10:17 AM', senderId: 'me', isMe: true },
      { id: 'm3', text: "How about 2pm at the coffee shop?", time: '10:18 AM', senderId: 'u1', isMe: false },
      { id: 'm4', text: "Sounds good. I'll be there.", time: '10:20 AM', senderId: 'me', isMe: true },
      { id: 'm5', text: "I'll be there in 5 minutes", time: '10:23 AM', senderId: 'u1', isMe: false },
    ]
  },
  {
    id: 'c2',
    contact: {
      id: 'u2',
      name: 'Sarah Johnson',
      status: 'busy',
    },
    lastMessage: {
      text: "Can you send me the report?",
      time: '9:45 AM',
      isRead: true,
    },
    messages: [
      { id: 'm6', text: "Hi Sarah, do you have a minute?", time: '9:40 AM', senderId: 'me', isMe: true },
      { id: 'm7', text: "Sure, what's up?", time: '9:42 AM', senderId: 'u2', isMe: false },
      { id: 'm8', text: "I need the quarterly report for the meeting", time: '9:43 AM', senderId: 'me', isMe: true },
      { id: 'm9', text: "Can you send me the report?", time: '9:45 AM', senderId: 'u2', isMe: false },
    ]
  },
  {
    id: 'c3',
    contact: {
      id: 'u3',
      name: 'Michael Brown',
      status: 'away',
      lastActive: '2 hours ago'
    },
    lastMessage: {
      text: "Let me know when you arrive",
      time: 'Yesterday',
      isRead: true,
    },
    messages: [
      { id: 'm10', text: "Are you coming to the event tomorrow?", time: 'Yesterday', senderId: 'u3', isMe: false },
      { id: 'm11', text: "Yes, I'll be there around 7pm", time: 'Yesterday', senderId: 'me', isMe: true },
      { id: 'm12', text: "Great, looking forward to seeing you", time: 'Yesterday', senderId: 'u3', isMe: false },
      { id: 'm13', text: "Let me know when you arrive", time: 'Yesterday', senderId: 'u3', isMe: false },
    ]
  },
  {
    id: 'c4',
    contact: {
      id: 'u4',
      name: 'Emily Davis',
      status: 'offline',
      lastActive: '1 day ago'
    },
    lastMessage: {
      text: "Thanks for your help with the project!",
      time: 'Yesterday',
      isRead: false,
    },
    messages: [
      { id: 'm14', text: "Hi Emily, I finished the design you requested", time: 'Yesterday', senderId: 'me', isMe: true },
      { id: 'm15', text: "That was quick! Can I see it?", time: 'Yesterday', senderId: 'u4', isMe: false },
      { id: 'm16', text: "Just sent it to your email", time: 'Yesterday', senderId: 'me', isMe: true },
      { id: 'm17', text: "Thanks for your help with the project!", time: 'Yesterday', senderId: 'u4', isMe: false },
    ]
  },
  {
    id: 'c5',
    contact: {
      id: 'u5',
      name: 'Robert Wilson',
      status: 'online',
    },
    lastMessage: {
      text: "We need to discuss the new requirements",
      time: 'Monday',
      isRead: true,
    },
    messages: [
      { id: 'm18', text: "Did you see the client's email?", time: 'Monday', senderId: 'u5', isMe: false },
      { id: 'm19', text: "Yes, they want to change the scope", time: 'Monday', senderId: 'me', isMe: true },
      { id: 'm20', text: "We need to discuss the new requirements", time: 'Monday', senderId: 'u5', isMe: false },
    ]
  },
];

const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation 
}: { 
  conversations: Conversation[],
  selectedConversationId: string | null,
  onSelectConversation: (conversationId: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredConversations = conversations.filter(conv => 
    conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={cn(
              "flex items-center p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
              conversation.id === selectedConversationId && "bg-telynx-50"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="relative mr-3">
              <Avatar>
                <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                <AvatarFallback className="bg-telynx-100 text-telynx-700">
                  {conversation.contact.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className={cn(
                "status-indicator absolute -bottom-0.5 -right-0.5 border-2 border-white",
                `status-${conversation.contact.status}`
              )}></span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{conversation.contact.name}</h3>
                <span className="text-xs text-muted-foreground">{conversation.lastMessage.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                  {conversation.lastMessage.text}
                </p>
                {!conversation.lastMessage.isRead && (
                  <span className="h-2 w-2 bg-telynx-500 rounded-full"></span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <Button variant="outline" className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
    </div>
  );
};

const ChatHeader = ({ conversation }: { conversation: Conversation }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        <div className="relative mr-3">
          <Avatar>
            <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
            <AvatarFallback className="bg-telynx-100 text-telynx-700">
              {conversation.contact.name.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "status-indicator absolute -bottom-0.5 -right-0.5 border-2 border-white",
            `status-${conversation.contact.status}`
          )}></span>
        </div>
        <div>
          <h3 className="font-medium">{conversation.contact.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.contact.status === 'online' 
              ? 'Online' 
              : conversation.contact.status === 'busy'
                ? 'Busy'
                : conversation.contact.status === 'away'
                  ? 'Away'
                  : conversation.contact.lastActive
                    ? `Last active ${conversation.contact.lastActive}`
                    : 'Offline'
            }
          </p>
        </div>
      </div>
      <div className="flex">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const ChatMessages = ({ messages }: { messages: Message[] }) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.isMe ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[75%] rounded-lg px-4 py-2",
              message.isMe 
                ? "bg-telynx-500 text-white"
                : "bg-muted text-foreground"
            )}
          >
            <p>{message.text}</p>
            <p className={cn(
              "text-xs mt-1 text-right",
              message.isMe ? "text-telynx-100" : "text-muted-foreground"
            )}>
              {message.time}
            </p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const ChatInput = () => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" type="button">
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Input
          placeholder="Type your message..."
          className="flex-1 mx-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-telynx-500 hover:bg-telynx-600" 
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="mb-4 bg-telynx-100 h-16 w-16 rounded-full flex items-center justify-center">
        <MessageSquare className="h-8 w-8 text-telynx-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">Your Messages</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Select a conversation to start messaging or create a new message to connect with someone.
      </p>
      <Button className="bg-telynx-500 hover:bg-telynx-600">
        <UserPlus className="h-4 w-4 mr-2" />
        New Message
      </Button>
    </div>
  );
};

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Manage your conversations</p>
      </div>
      
      <Card className="flex h-[calc(100vh-220px)] overflow-hidden">
        <div className="w-full md:w-80 flex-shrink-0">
          <ConversationList 
            conversations={conversations} 
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="hidden md:flex flex-col flex-1">
          {selectedConversation ? (
            <>
              <ChatHeader conversation={selectedConversation} />
              <ChatMessages messages={selectedConversation.messages} />
              <ChatInput />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Messages;
