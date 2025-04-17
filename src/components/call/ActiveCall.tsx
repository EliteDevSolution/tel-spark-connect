
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useCall } from '@/contexts/CallContext';

const ActiveCall = () => {
  const { 
    callStatus, 
    callerName, 
    callerNumber, 
    localStream, 
    remoteStream, 
    endCall 
  } = useCall();
  
  const [muted, setMuted] = React.useState(false);
  const [speakerOff, setSpeakerOff] = React.useState(false);
  const [callDuration, setCallDuration] = React.useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (callStatus === 'connected') {
      const intervalId = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(intervalId);
    } else {
      setCallDuration(0);
    }
  }, [callStatus]);
  
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setMuted(!muted);
    }
  };
  
  const toggleSpeaker = () => {
    setSpeakerOff(!speakerOff);
    // In a real implementation, you would control the audio output device
  };
  
  if (callStatus === 'idle') return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="" alt={callerName || callerNumber || ''} />
            <AvatarFallback className="bg-telynx-100 text-telynx-700 text-2xl">
              {callerName ? callerName.split(' ').map(name => name[0]).join('') : callerNumber?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold mb-1">{callerName || callerNumber}</h2>
          
          {callStatus === 'calling' && (
            <p className="text-muted-foreground animate-pulse">Calling...</p>
          )}
          
          {callStatus === 'ringing' && (
            <p className="text-muted-foreground animate-pulse">Incoming call...</p>
          )}
          
          {callStatus === 'connected' && (
            <p className="text-muted-foreground">{formatDuration(callDuration)}</p>
          )}
          
          {callStatus === 'ended' && (
            <p className="text-muted-foreground">Call ended</p>
          )}
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            {callStatus === 'connected' && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 ${muted ? 'bg-red-100 text-red-500' : ''}`}
                  onClick={toggleMute}
                >
                  {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={endCall}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 ${speakerOff ? 'bg-red-100 text-red-500' : ''}`}
                  onClick={toggleSpeaker}
                >
                  {speakerOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </>
            )}
            
            {callStatus === 'calling' && (
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full h-12 w-12 col-start-2"
                onClick={endCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            )}
            
            {callStatus === 'ringing' && (
              <>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={() => endCall()}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600 col-start-3"
                  onClick={() => {
                    const context = useCall();
                    context.answerCall();
                  }}
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {callStatus === 'ended' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 col-start-2"
                onClick={() => {
                  const context = useCall();
                  context.endCall();
                }}
              >
                <Phone className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Hidden video elements for WebRTC streams */}
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          className="hidden" 
        />
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          className="hidden" 
        />
      </Card>
    </div>
  );
};

export default ActiveCall;
