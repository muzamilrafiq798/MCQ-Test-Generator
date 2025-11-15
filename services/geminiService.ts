
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types.ts';

// Safely access the API key without crashing the app if `process` is not defined.
const API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: 'The question text.'
            },
            options: {
                type: Type.ARRAY,
                description: 'An array of possible answers.',
                items: {
                    type: Type.STRING,
                }
            },
            correctAnswer: {
                type: Type.STRING,
                description: 'The exact string of the correct answer from the options array.'
            }
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

export const parseMCQs = async (text: string): Promise<Question[]> => {
    // Check for the API key inside the function that uses it.
    // This allows the app to load and show a specific error message to the user.
    if (!ai) {
        throw new Error("API key is not configured. This application cannot contact the AI service.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse the following text which contains multiple choice questions and convert it into a JSON array. Each question should have options and a correct answer. Ensure the 'correctAnswer' value is one of the strings present in the 'options' array. Here is the text: \n\n${text}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);

        // Validate that the parsed data is an array of questions
        if (Array.isArray(parsedData) && parsedData.every(item => 'question' in item && 'options' in item && 'correctAnswer' in item)) {
            return parsedData as Question[];
        } else {
            throw new Error("Parsed data is not in the expected format.");
        }
    } catch (error) {
        console.error("Error parsing MCQs with Gemini:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("The provided API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to parse questions. The format might be too ambiguous or there was an issue with the AI service.");
    }
};
