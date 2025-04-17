
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { webrtcService } from '@/lib/webrtc/webrtcService';
import { toast } from 'sonner';

type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

interface CallContextType {
  callStatus: CallStatus;
  currentCallId: string | null;
  callerName: string | null;
  callerNumber: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  makeCall: (phoneNumber: string, contactName?: string) => Promise<void>;
  answerCall: () => Promise<void>;
  endCall: () => void;
  rejectCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [callerName, setCallerName] = useState<string | null>(null);
  const [callerNumber, setCallerNumber] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    // Setup WebRTC event handlers
    webrtcService.setCallEventHandler((event) => {
      console.log('Call event:', event);
      
      if (event.state === 'calling') {
        setCallStatus('calling');
      } else if (event.state === 'connected') {
        setCallStatus('connected');
      } else if (event.state === 'ended' || 
                event.state === 'disconnected' || 
                event.state === 'failed') {
        setCallStatus('ended');
        setTimeout(() => {
          setCallStatus('idle');
          setCurrentCallId(null);
          setCallerName(null);
          setCallerNumber(null);
        }, 2000);
      }
    });

    webrtcService.setLocalStreamHandler((stream) => {
      setLocalStream(stream);
    });

    webrtcService.setRemoteStreamHandler((stream) => {
      setRemoteStream(stream);
    });

    // Example of simulating an incoming call listener
    // In a real app, this would be done via WebSockets or similar
    const incomingCallListener = (event: any) => {
      if (event.type === 'incoming-call') {
        setIncomingCall(event);
        setCallerName(event.callerName);
        setCallerNumber(event.callerNumber);
        setCurrentCallId(event.callId);
        setCallStatus('ringing');
        
        toast(
          <div className="flex flex-col gap-2">
            <div className="font-medium">Incoming call</div>
            <div>{event.callerName || event.callerNumber}</div>
            <div className="flex gap-2 mt-1">
              <button 
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  answerCall();
                  toast.dismiss();
                }}
              >
                Answer
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  rejectCall();
                  toast.dismiss();
                }}
              >
                Reject
              </button>
            </div>
          </div>,
          {
            duration: 15000,
          }
        );
      }
    };

    // Mock listener for demo purposes
    window.addEventListener('mock-incoming-call', incomingCallListener as EventListener);

    return () => {
      window.removeEventListener('mock-incoming-call', incomingCallListener as EventListener);
    };
  }, []);

  const makeCall = async (phoneNumber: string, contactName?: string) => {
    try {
      setCallerNumber(phoneNumber);
      setCallerName(contactName || phoneNumber);
      setCallStatus('calling');
      
      // Generate a unique call ID
      const callId = `call-${Date.now()}`;
      setCurrentCallId(callId);
      
      await webrtcService.makeCall(phoneNumber);
    } catch (error) {
      console.error('Error making call:', error);
      setCallStatus('idle');
      setCurrentCallId(null);
    }
  };

  const answerCall = async () => {
    try {
      setCallStatus('connected');
      
      if (incomingCall) {
        await webrtcService.handleIncomingCall(incomingCall.offer, incomingCall.callerId);
        setIncomingCall(null);
      }
    } catch (error) {
      console.error('Error answering call:', error);
      endCall();
    }
  };

  const endCall = () => {
    webrtcService.endCall();
    setCallStatus('ended');
    
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentCallId(null);
      setCallerName(null);
      setCallerNumber(null);
    }, 2000);
  };

  const rejectCall = () => {
    setIncomingCall(null);
    setCallStatus('ended');
    
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentCallId(null);
      setCallerName(null);
      setCallerNumber(null);
    }, 2000);
  };

  return (
    <CallContext.Provider
      value={{
        callStatus,
        currentCallId,
        callerName,
        callerNumber,
        localStream,
        remoteStream,
        makeCall,
        answerCall,
        endCall,
        rejectCall
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = (): CallContextType => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
