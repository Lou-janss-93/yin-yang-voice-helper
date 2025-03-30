
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import yinYangService from "@/services/yinYangService";
import { useToast } from "@/components/ui/use-toast";

type ApiKeyFormProps = {
  onKeySet: () => void;
};

export const ApiKeyForm = ({ onKeySet }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API sleutel vereist",
        description: "Voer een geldige OpenAI API sleutel in",
        variant: "destructive",
      });
      return;
    }
    
    yinYangService.setApiKey(apiKey.trim());
    toast({
      title: "API sleutel opgeslagen",
      description: "De OpenAI API sleutel is opgeslagen",
    });
    
    onKeySet();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenAI API Sleutel</CardTitle>
        <CardDescription>
          Voer je OpenAI API sleutel in om de Yin-Yang Module te gebruiken
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono"
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Sleutel Opslaan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
