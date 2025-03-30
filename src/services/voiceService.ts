
/**
 * Voice recording and speech-to-text service
 */
export class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  
  constructor() {}

  public async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }
  
  public stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(new Blob([]));
        return;
      }
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        
        // Stop all tracks to release the microphone
        const tracks = this.mediaRecorder?.stream.getTracks();
        tracks?.forEach((track) => track.stop());
        
        resolve(audioBlob);
      };
      
      this.mediaRecorder.stop();
    });
  }
  
  public async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // In a real implementation, this would call Whisper API or Azure Speech-to-Text
      // For this demo, we'll use OpenAI's Whisper API directly
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key') || ''}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
}

export default new VoiceService();
