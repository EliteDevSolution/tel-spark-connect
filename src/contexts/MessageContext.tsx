
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { telynxClient, Message } from '@/lib/api/telynxClient';
import { toast } from 'sonner';

interface MessageContextType {
  messages: Message[];
  conversations: { [key: string]: Message[] };
  sendMessage: (to: string, text: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  loading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);

  // Group messages by phone number
  const organizeConversations = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const key = message.phoneNumber;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(message);
    });
    
    // Sort conversations by the timestamp of the most recent message
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
    });
    
    setConversations(grouped);
  };

  const refreshMessages = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await telynxClient.getMessages();
      setMessages(fetchedMessages);
      organizeConversations(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (to: string, text: string) => {
    try {
      await telynxClient.sendSMS({ to, message: text });
      
      // Add optimistic update
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        text,
        time: new Date().toISOString(),
        direction: 'outbound',
        phoneNumber: to,
        status: 'sent'
      };
      
      setMessages(prev => [newMessage, ...prev]);
      
      // Update conversations
      setConversations(prev => {
        const updated = { ...prev };
        if (!updated[to]) {
          updated[to] = [];
        }
        updated[to] = [newMessage, ...updated[to]];
        return updated;
      });
      
      // Refresh messages to ensure we have the server-assigned ID
      refreshMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    refreshMessages();
    
    // Set up a periodic refresh
    const intervalId = setInterval(refreshMessages, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        conversations,
        sendMessage,
        refreshMessages,
        loading
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
