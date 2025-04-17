
import { toast } from "sonner";

interface PeerConfiguration {
  iceServers: RTCIceServer[];
}

interface CallOptions {
  audio: boolean;
  video: boolean;
}

type CallEventCallback = (event: any) => void;

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private configuration: PeerConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };
  private onCallStateChange: CallEventCallback | null = null;
  private onRemoteStreamReceived: (stream: MediaStream) => void = () => {};
  private onLocalStreamReady: (stream: MediaStream) => void = () => {};

  constructor() {
    // Initialize if WebRTC is supported
    if (typeof window !== 'undefined' && 
        navigator.mediaDevices && 
        window.RTCPeerConnection) {
      console.log('WebRTC is supported');
    } else {
      console.warn('WebRTC is not supported in this browser');
    }
  }

  setCallEventHandler(callback: CallEventCallback) {
    this.onCallStateChange = callback;
  }

  setRemoteStreamHandler(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamReceived = callback;
  }

  setLocalStreamHandler(callback: (stream: MediaStream) => void) {
    this.onLocalStreamReady = callback;
  }

  async startLocalStream(options: CallOptions = { audio: true, video: false }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(options);
      this.onLocalStreamReady(this.localStream);
      return this.localStream;
    } catch (error) {
      toast.error("Failed to access microphone or camera");
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async makeCall(remoteId: string): Promise<void> {
    try {
      // Create peer connection
      this.createPeerConnection();
      
      // Make sure we have local stream
      if (!this.localStream) {
        await this.startLocalStream();
      }
      
      // Add local tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
      
      // Create offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      
      // Send offer to signaling server (this would connect to your Telynx backend)
      this.sendSignalingMessage({
        type: 'offer',
        offer: offer,
        target: remoteId
      });
      
      // Notify of call state
      if (this.onCallStateChange) {
        this.onCallStateChange({ state: 'calling', remoteId });
      }
    } catch (error) {
      toast.error("Failed to establish call");
      console.error('Error making call:', error);
      this.endCall();
      throw error;
    }
  }

  async handleIncomingCall(offer: RTCSessionDescriptionInit, fromId: string): Promise<void> {
    try {
      // Create peer connection
      this.createPeerConnection();
      
      // Set remote description
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Make sure we have local stream
      if (!this.localStream) {
        await this.startLocalStream();
      }
      
      // Add local tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
      
      // Create answer
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);
      
      // Send answer to signaling server
      this.sendSignalingMessage({
        type: 'answer',
        answer: answer,
        target: fromId
      });
      
      // Notify of call state
      if (this.onCallStateChange) {
        this.onCallStateChange({ state: 'connected', remoteId: fromId });
      }
    } catch (error) {
      toast.error("Failed to answer call");
      console.error('Error answering call:', error);
      this.endCall();
      throw error;
    }
  }

  async acceptAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('No active call to accept answer');
    }
    
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      toast.error("Failed to establish connection");
      console.error('Error accepting answer:', error);
      throw error;
    }
  }

  endCall(): void {
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Stop all local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Notify of call end
    if (this.onCallStateChange) {
      this.onCallStateChange({ state: 'ended' });
    }
    
    toast.info("Call ended");
  }

  private createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection(this.configuration);
    
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        // Send ICE candidate to signaling server
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    this.peerConnection.ontrack = event => {
      this.remoteStream = event.streams[0];
      this.onRemoteStreamReceived(this.remoteStream);
    };
    
    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('Connection state:', this.peerConnection.connectionState);
        
        if (this.peerConnection.connectionState === 'connected') {
          toast.success("Call connected successfully");
        } else if (this.peerConnection.connectionState === 'disconnected' || 
                   this.peerConnection.connectionState === 'failed' ||
                   this.peerConnection.connectionState === 'closed') {
          this.endCall();
        }
        
        if (this.onCallStateChange) {
          this.onCallStateChange({ 
            state: this.peerConnection.connectionState 
          });
        }
      }
    };
  }

  private sendSignalingMessage(message: any): void {
    // This would connect to your Telynx backend signaling server
    // Placeholder for actual implementation
    console.log('Sending signaling message:', message);
    
    // In a real implementation, you would send this to your signaling server
    // Example:
    // fetch('https://api.telynx.com/v1/signaling', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(message)
    // });
  }

  // Method to handle ICE candidates received from the signaling server
  handleRemoteIceCandidate(candidate: RTCIceCandidateInit): void {
    if (this.peerConnection) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error('Error adding received ice candidate', e));
    }
  }
}

// Export a singleton instance
export const webrtcService = new WebRTCService();
