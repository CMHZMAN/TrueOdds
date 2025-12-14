import { GoogleGenAI, Type } from "@google/genai";
import { Match, GeminiAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to sanitize JSON string if the model returns markdown code blocks
const cleanJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeMatchOdds = async (match: Match): Promise<GeminiAnalysis> => {
  // We use gemini-2.5-flash for fast analysis, or 3-pro-preview if we wanted deeper reasoning.
  // Flash is sufficient for this structured data task.
  const modelName = 'gemini-2.5-flash';

  const prompt = `
    You are an expert sports betting analyst and mathematician. 
    Analyze the following match data and calculate the "True Probability" and "True Odds" (Decimal format) for each outcome based on the team stats and form.
    Compare your calculated odds with the provided Bookmaker Odds to identify if there is a Value Bet (positive Expected Value).
    
    Match: ${match.homeTeam.name} vs ${match.awayTeam.name}
    League: ${match.league}
    
    Home Team Stats: ${JSON.stringify(match.homeTeam)}
    Away Team Stats: ${JSON.stringify(match.awayTeam)}
    
    Current Market Odds: ${JSON.stringify(match.bookmakerOdds)}
    
    Return a JSON object strictly following this schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trueOdds: {
              type: Type.OBJECT,
              properties: {
                homeWin: { type: Type.NUMBER },
                draw: { type: Type.NUMBER },
                awayWin: { type: Type.NUMBER }
              }
            },
            valueBetDetected: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            keyFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedBet: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER, description: "Between 0 and 100" }
          },
          required: ["trueOdds", "valueBetDetected", "reasoning", "keyFactors", "recommendedBet", "confidenceScore"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from Gemini");
    
    return JSON.parse(cleanJson(resultText)) as GeminiAnalysis;

  } catch (error) {
    console.error("Error analyzing match:", error);
    throw error;
  }
};

export const getQuickInsight = async (match: Match): Promise<string> => {
  // Use search grounding to find latest news (injuries, drama, weather)
  // This is where "Gemini Intelligence" shines by bringing in outside context.
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the latest critical news, injury updates, or tactical changes for the upcoming match between ${match.homeTeam.name} and ${match.awayTeam.name} in the ${match.league}. Summarize in 2-3 concise sentences impacting the betting odds.`,
      config: {
        tools: [{ googleSearch: {} }] // Real-time grounding
      }
    });
    
    return response.text || "No insights available at this moment.";
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "Could not retrieve live insights.";
  }
};