
import { Card, CardContent } from "@/components/ui/card";

interface TranscriptionDisplayProps {
  transcription: string;
  isVisible: boolean;
}

export const TranscriptionDisplay = ({ 
  transcription,
  isVisible
}: TranscriptionDisplayProps) => {
  if (!isVisible || !transcription) return null;
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <p className="text-lg font-medium mb-2">Jouw ingesproken tekst:</p>
        <div className="p-4 bg-muted/50 rounded-md">
          <p className="italic">{transcription}</p>
        </div>
      </CardContent>
    </Card>
  );
};
