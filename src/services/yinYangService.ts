
/**
 * Yin-Yang Module service for analyzing text using OpenAI
 */

type YinYangAnalysis = {
  yin: string;
  yang: string;
  mantra: {
    result: boolean;
    explanation: string;
  };
  fullResponse: string;
};

export class YinYangService {
  private apiKey: string = '';
  
  constructor() {
    this.apiKey = localStorage.getItem('openai_api_key') || '';
  }
  
  public setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }
  
  public async analyzeText(text: string): Promise<YinYangAnalysis> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not set');
      }
      
      const prompt = this.buildPrompt(text);
      const response = await this.callOpenAI(prompt);
      
      return this.parseResponse(response);
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }
  
  private buildPrompt(userInput: string): string {
    return `Analyseer deze boodschap en beantwoord drie vragen:
1. Welke emotionele signalen herken je? (Yin)
2. Wat is de rationele inhoud en urgentie? (Yang)
3. Lijkt deze boodschap oprecht levensbedreigend of niet? (Mantra = True/False, motiveer)

Boodschap: "${userInput}"`;
  }
  
  private async callOpenAI(promptText: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Jij bent een empathisch en rationeel beoordelaar binnen een noodoproep-systeem.'
            },
            {
              role: 'user',
              content: promptText
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
  
  private parseResponse(response: string): YinYangAnalysis {
    // Extract Yin, Yang, and Mantra sections from the response
    // This is a simple parser and might need refinement based on actual responses
    let yin = '';
    let yang = '';
    let mantraResult = false;
    let mantraExplanation = '';
    
    // Parse Yin (emotional signals)
    const yinMatch = response.match(/1\.\s+.*Yin\)[\s\S]*?(?=2\.)/i);
    if (yinMatch) {
      yin = yinMatch[0].replace(/1\.\s+.*Yin\)/i, '').trim();
    }
    
    // Parse Yang (rational content)
    const yangMatch = response.match(/2\.\s+.*Yang\)[\s\S]*?(?=3\.)/i);
    if (yangMatch) {
      yang = yangMatch[0].replace(/2\.\s+.*Yang\)/i, '').trim();
    }
    
    // Parse Mantra (True/False and explanation)
    const mantraMatch = response.match(/3\.\s+.*Mantra[\s\S]*?(?=True|False)/i);
    const resultMatch = response.match(/(?:True|False)/i);
    
    if (resultMatch) {
      mantraResult = resultMatch[0].toLowerCase() === 'true';
      
      // Get explanation after True/False
      const afterResult = response.substring(response.indexOf(resultMatch[0]) + resultMatch[0].length);
      mantraExplanation = afterResult.trim();
    }
    
    return {
      yin,
      yang,
      mantra: {
        result: mantraResult,
        explanation: mantraExplanation
      },
      fullResponse: response
    };
  }
}

export default new YinYangService();
