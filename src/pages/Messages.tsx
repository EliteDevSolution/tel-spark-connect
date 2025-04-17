
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Phone, MoreVertical, Search, Send, Paperclip, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessages } from '@/contexts/MessageContext';
import { useCall } from '@/contexts/CallContext';
import { toast } from 'sonner';

interface ConversationInfo {
  phoneNumber: string;
  contact?: {
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'busy' | 'away';
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
  };
}

const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation 
}: { 
  conversations: ConversationInfo[],
  selectedConversationId: string | null,
  onSelectConversation: (conversationId: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredConversations = conversations.filter(conv => 
    (conv.contact?.name || conv.phoneNumber).toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div 
              key={conversation.phoneNumber}
              className={cn(
                "flex items-center p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                conversation.phoneNumber === selectedConversationId && "bg-telynx-50"
              )}
              onClick={() => onSelectConversation(conversation.phoneNumber)}
            >
              <div className="relative mr-3">
                <Avatar>
                  <AvatarImage src={conversation.contact?.avatar} alt={conversation.contact?.name || conversation.phoneNumber} />
                  <AvatarFallback className="bg-telynx-100 text-telynx-700">
                    {(conversation.contact?.name || conversation.phoneNumber).split(' ').map(name => name[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {conversation.contact?.status && (
                  <span className={cn(
                    "status-indicator absolute -bottom-0.5 -right-0.5 border-2 border-white",
                    `status-${conversation.contact.status}`
                  )}></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{conversation.contact?.name || conversation.phoneNumber}</h3>
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
          ))
        )}
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

const ChatHeader = ({ 
  phoneNumber, 
  contact 
}: { 
  phoneNumber: string,
  contact?: {
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
  }
}) => {
  const { makeCall } = useCall();
  
  const handleCall = () => {
    makeCall(phoneNumber, contact?.name);
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        <div className="relative mr-3">
          <Avatar>
            <AvatarImage src={contact?.avatar} alt={contact?.name || phoneNumber} />
            <AvatarFallback className="bg-telynx-100 text-telynx-700">
              {(contact?.name || phoneNumber).split(' ').map(name => name[0]).join('').substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="font-medium">{contact?.name || phoneNumber}</h3>
          <p className="text-xs text-muted-foreground">
            {phoneNumber}
          </p>
        </div>
      </div>
      <div className="flex">
        <Button variant="ghost" size="icon" onClick={handleCall}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const ChatMessages = ({ messages }: { messages: any[] }) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No messages yet
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.direction === 'outbound' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-lg px-4 py-2",
                message.direction === 'outbound'
                  ? "bg-telynx-500 text-white"
                  : "bg-muted text-foreground"
              )}
            >
              <p>{message.text}</p>
              <p className={cn(
                "text-xs mt-1 text-right",
                message.direction === 'outbound' ? "text-telynx-100" : "text-muted-foreground"
              )}>
                {formatTime(message.time)}
                {message.direction === 'outbound' && (
                  <span className="ml-2">
                    {message.status === 'delivered' ? '✓✓' : 
                     message.status === 'read' ? '✓✓' : 
                     message.status === 'sent' ? '✓' : '!'}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

const ChatInput = ({ phoneNumber }: { phoneNumber: string }) => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessages();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await sendMessage(phoneNumber, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
  const { conversations, messages, loading, refreshMessages } = useMessages();
  const [formattedConversations, setFormattedConversations] = useState<ConversationInfo[]>([]);
  
  useEffect(() => {
    // Format conversations data for display
    const formatted: ConversationInfo[] = Object.keys(conversations).map(phoneNumber => {
      const conversationMessages = conversations[phoneNumber];
      const lastMessage = conversationMessages[0]; // Messages are already sorted newest first
      
      return {
        phoneNumber,
        contact: {
          name: lastMessage.contactName || phoneNumber,
          status: 'offline' as const, // Default status
        },
        lastMessage: {
          text: lastMessage.text,
          time: new Date(lastMessage.time).toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isRead: lastMessage.status === 'read',
        }
      };
    });
    
    setFormattedConversations(formatted);
  }, [conversations]);
  
  // Get selected conversation messages
  const selectedConversationMessages = selectedConversationId 
    ? conversations[selectedConversationId] || []
    : [];
  
  // Get contact info for the selected conversation
  const selectedContact = selectedConversationId && formattedConversations.find(
    conv => conv.phoneNumber === selectedConversationId
  )?.contact;
  
  useEffect(() => {
    // Refresh messages periodically
    const intervalId = setInterval(() => {
      refreshMessages();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshMessages]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Manage your conversations</p>
      </div>
      
      <Card className="flex h-[calc(100vh-220px)] overflow-hidden">
        <div className="w-full md:w-80 flex-shrink-0">
          {loading && formattedConversations.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          ) : (
            <ConversationList 
              conversations={formattedConversations} 
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          )}
        </div>
        <div className="hidden md:flex flex-col flex-1">
          {selectedConversationId ? (
            <>
              <ChatHeader 
                phoneNumber={selectedConversationId} 
                contact={selectedContact}
              />
              <ChatMessages messages={selectedConversationMessages} />
              <ChatInput phoneNumber={selectedConversationId} />
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
