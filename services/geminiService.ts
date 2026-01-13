import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlashcardsFromTopic = async (
  topic: string,
  count: number = 5
): Promise<Omit<Flashcard, 'id' | 'mastered'>[]> => {
  
  try {
    const prompt = `Create ${count} educational flashcards about "${topic}". 
    The 'front' should be a question, term, or concept. 
    The 'back' should be a concise answer, definition, or explanation (max 30 words).
    Make them suitable for effective learning.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert tutor creating high-quality study materials.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: {
                type: Type.STRING,
                description: "The content on the front of the card (question/term)",
              },
              back: {
                type: Type.STRING,
                description: "The content on the back of the card (answer/definition)",
              },
            },
            required: ["front", "back"],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      if (Array.isArray(data)) {
        return data as Omit<Flashcard, 'id' | 'mastered'>[];
      }
    }
    
    throw new Error("Invalid response format from Gemini");
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};