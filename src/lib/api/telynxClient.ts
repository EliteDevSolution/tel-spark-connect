
import { toast } from "sonner";

// API Configuration
const TELYNX_API_BASE_URL = "https://api.telynx.com/v1"; // Replace with actual Telynx API URL
const API_KEY = "YOUR_TELYNX_API_KEY"; // This should be stored in environment variables in production

// Types
export interface SendSMSParams {
  to: string;
  message: string;
}

export interface CallParams {
  to: string;
  from?: string;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  direction: 'inbound' | 'outbound';
  phoneNumber: string;
  contactName?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  contact: string;
  phoneNumber: string;
  time: string;
  duration: string;
  status: 'ongoing' | 'completed' | 'missed';
}

// Error handling
class TelynxAPIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = "TelynxAPIError";
    this.status = status;
  }
}

// API Client
export const telynxClient = {
  // Authentication headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    };
  },
  
  // SMS Functions
  async sendSMS({ to, message }: SendSMSParams): Promise<{ id: string }> {
    try {
      // This is a placeholder for the actual API call
      const response = await fetch(`${TELYNX_API_BASE_URL}/sms/send`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ to, message }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new TelynxAPIError(error.message || 'Failed to send SMS', response.status);
      }
      
      const data = await response.json();
      toast.success("Message sent successfully");
      return data;
    } catch (error) {
      if (error instanceof TelynxAPIError) {
        toast.error(`SMS error: ${error.message}`);
      } else {
        toast.error("Failed to send SMS. Please try again.");
      }
      throw error;
    }
  },
  
  async getMessages(): Promise<Message[]> {
    try {
      // This is a placeholder for the actual API call
      const response = await fetch(`${TELYNX_API_BASE_URL}/sms/messages`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new TelynxAPIError(error.message || 'Failed to fetch messages', response.status);
      }
      
      const data = await response.json();
      return data.messages;
    } catch (error) {
      if (error instanceof TelynxAPIError) {
        toast.error(`Error fetching messages: ${error.message}`);
      } else {
        toast.error("Failed to fetch messages. Please try again.");
      }
      
      // Return empty array on error
      return [];
    }
  },
  
  // Call Functions
  async initiateCall({ to, from }: CallParams): Promise<{ callId: string }> {
    try {
      // This is a placeholder for the actual API call
      const response = await fetch(`${TELYNX_API_BASE_URL}/call/initiate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ to, from }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new TelynxAPIError(error.message || 'Failed to initiate call', response.status);
      }
      
      const data = await response.json();
      toast.success("Call initiated");
      return data;
    } catch (error) {
      if (error instanceof TelynxAPIError) {
        toast.error(`Call error: ${error.message}`);
      } else {
        toast.error("Failed to initiate call. Please try again.");
      }
      throw error;
    }
  },
  
  async getCallHistory(): Promise<Call[]> {
    try {
      // This is a placeholder for the actual API call
      const response = await fetch(`${TELYNX_API_BASE_URL}/call/history`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new TelynxAPIError(error.message || 'Failed to fetch call history', response.status);
      }
      
      const data = await response.json();
      return data.calls;
    } catch (error) {
      if (error instanceof TelynxAPIError) {
        toast.error(`Error fetching call history: ${error.message}`);
      } else {
        toast.error("Failed to fetch call history. Please try again.");
      }
      
      // Return empty array on error
      return [];
    }
  }
};
