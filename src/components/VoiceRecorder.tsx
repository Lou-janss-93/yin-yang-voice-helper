
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import voiceService from "@/services/voiceService";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceRecorder = ({ 
  onTranscriptionComplete, 
  isProcessing 
}: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  const handleStartRecording = async () => {
    try {
      setErrorMessage(null);
      await voiceService.startRecording();
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (error) {
      setErrorMessage('Kon microfoon niet activeren. Geef toegang tot je microfoon.');
      console.error('Error starting recording:', error);
    }
  };
  
  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      const audioBlob = await voiceService.stopRecording();
      if (audioBlob.size > 0) {
        const transcription = await voiceService.transcribeAudio(audioBlob);
        onTranscriptionComplete(transcription);
      } else {
        setErrorMessage('Geen audio opgenomen');
      }
    } catch (error) {
      setErrorMessage('Fout bij opnemen of transcriberen van audio');
      console.error('Error stopping recording:', error);
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6 flex flex-col items-center">
        {errorMessage && (
          <div className="text-destructive mb-4 text-sm">{errorMessage}</div>
        )}
        
        <div className="relative w-24 h-24 mb-4">
          {isRecording ? (
            <div className={cn(
              "absolute inset-0 rounded-full bg-destructive/20 animate-pulse-recording",
              "flex items-center justify-center"
            )}>
              <div className="absolute inset-3 rounded-full bg-destructive/40"></div>
            </div>
          ) : null}
          
          {isTranscribing ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground" size={48} />
            </div>
          ) : (
            <Button 
              disabled={isTranscribing || isProcessing}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              size="icon" 
              variant={isRecording ? "destructive" : "default"} 
              className="absolute inset-0 rounded-full w-24 h-24"
            >
              {isRecording ? (
                <Square size={32} />
              ) : (
                <Mic size={32} />
              )}
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="flex flex-col items-center">
            <div className="text-xl font-mono">{formatTime(recordingSeconds)}</div>
            <div className="text-sm text-muted-foreground">Opname bezig...</div>
          </div>
        )}
        
        {isTranscribing && (
          <div className="mt-2 text-sm text-muted-foreground">
            Spraak wordt omgezet naar tekst...
          </div>
        )}
        
        {!isRecording && !isTranscribing && (
          <div className="text-center text-muted-foreground text-sm mt-2">
            {isProcessing
              ? "Bezig met analyseren..."
              : "Klik op de microfoon om je boodschap op te nemen"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
