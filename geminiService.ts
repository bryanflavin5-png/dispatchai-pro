import { GoogleGenAI } from "@google/genai";
import { Driver, Load } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getAIAdvice = async (
  prompt: string,
  context: { drivers: Driver[]; loads: Load[] }
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Create a context-aware system instruction
    const systemInstruction = `
      You are an expert Trucking Dispatch Assistant named "DispatchAI".
      Your goal is to help dispatchers optimize operations, solve problems, and draft communications.
      
      Current Operational Context:
      Drivers: ${JSON.stringify(context.drivers.map(d => ({ name: d.name, status: d.status, location: d.currentLocation })))}
      Loads: ${JSON.stringify(context.loads.map(l => ({ id: l.id, origin: l.origin, dest: l.destination, status: l.status })))}
      
      Guidelines:
      - Be concise and professional.
      - If asked about assigning loads, analyze the location of available drivers vs load origin.
      - If asked to draft a message, use professional logistics terminology.
      - Do not invent data not present in the context unless creating a hypothetical example.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your API key.";
  }
};
