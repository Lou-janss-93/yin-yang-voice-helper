
import { useState, useEffect } from "react";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TranscriptionDisplay } from "@/components/TranscriptionDisplay";
import { YinYangAnalysis } from "@/components/YinYangAnalysis";
import yinYangService from "@/services/yinYangService";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    yin: string;
    yang: string;
    mantra: {
      result: boolean;
      explanation: string;
    };
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists
    const apiKey = localStorage.getItem('openai_api_key');
    setHasApiKey(!!apiKey);
  }, []);

  const handleTranscriptionComplete = async (text: string) => {
    setTranscription(text);
    
    if (text) {
      try {
        setIsAnalyzing(true);
        const result = await yinYangService.analyzeText(text);
        setAnalysis({
          yin: result.yin,
          yang: result.yang,
          mantra: result.mantra
        });
      } catch (error) {
        console.error("Error analyzing text:", error);
        toast({
          title: "Fout bij analyse",
          description: "Er is een fout opgetreden bij het analyseren van de tekst",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleKeySet = () => {
    setHasApiKey(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yin/5 to-yang/5">
      <div className="container max-w-3xl py-8 px-4">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yin"></div>
            <div className="w-8 h-8 rounded-full bg-yang"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Yin-Yang Voice Helper</h1>
          <p className="text-muted-foreground">
            Spraakanalyse met Yin-Yang Module 2.0 voor emotionele en rationele beoordeling
          </p>
        </header>

        {!hasApiKey ? (
          <ApiKeyForm onKeySet={handleKeySet} />
        ) : (
          <div className="space-y-6">
            <VoiceRecorder 
              onTranscriptionComplete={handleTranscriptionComplete} 
              isProcessing={isAnalyzing}
            />
            
            <TranscriptionDisplay 
              transcription={transcription} 
              isVisible={!!transcription}
            />
            
            {analysis && (
              <YinYangAnalysis
                yin={analysis.yin}
                yang={analysis.yang}
                mantra={analysis.mantra}
                isVisible={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
