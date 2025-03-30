
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface YinYangAnalysisProps {
  yin: string;
  yang: string;
  mantra: {
    result: boolean;
    explanation: string;
  };
  isVisible: boolean;
}

export const YinYangAnalysis = ({
  yin,
  yang,
  mantra,
  isVisible
}: YinYangAnalysisProps) => {
  if (!isVisible) return null;

  return (
    <Card className="w-full bg-gradient-to-tr from-yin-light/5 to-yang-light/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Yin-Yang Analyse</span>
          <Badge 
            className={cn(
              "text-white px-3 py-1",
              mantra.result 
                ? "bg-result-true hover:bg-result-true/90" 
                : "bg-result-false hover:bg-result-false/90"
            )}
          >
            {mantra.result ? 'ALERT' : 'VEILIG'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Emotionele en rationele analyse van je boodschap
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-yin flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yin"></div>
            Yin (Emotionele signalen)
          </h3>
          <p className="text-sm pl-5 border-l-2 border-yin/30">{yin}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-yang flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yang"></div>
            Yang (Rationele inhoud)
          </h3>
          <p className="text-sm pl-5 border-l-2 border-yang/30">{yang}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              mantra.result ? "bg-result-true" : "bg-result-false"
            )}></div>
            Mantra (Conclusie)
          </h3>
          <p className="text-sm pl-5 border-l-2 border-gray-300">{mantra.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
};
