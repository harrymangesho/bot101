
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.substring(5, result.indexOf(';'));
      const data = result.split(',')[1];
      if (mimeType && data) {
        resolve({ mimeType, data });
      } else {
        reject(new Error("Failed to parse file data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeChart = async (imageFile: File): Promise<AnalysisResult> => {
    const imagePartData = await fileToGenerativePart(imageFile);
    
    const imagePart = { inlineData: imagePartData };
    const textPart = { text: SYSTEM_PROMPT };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
        });

        const text = response.text.trim();
        const cleanedJsonString = text.replace(/^```json\s*|```\s*$/g, '').trim();

        try {
            const result: AnalysisResult = JSON.parse(cleanedJsonString);
            return result;
        } catch (e) {
            console.error("Failed to parse JSON response:", cleanedJsonString);
            throw new Error("The analysis returned an invalid format. Please try again.");
        }
    } catch (apiError) {
        console.error("Gemini API Error:", apiError);
        throw new Error("Failed to communicate with the analysis service. Please check your API key and try again.");
    }
};
