import { GoogleGenAI } from "@google/genai";

// Helper function για retry με exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = i === maxRetries - 1;
            const isRetryableError = error?.message?.includes('overloaded') ||
                                     error?.message?.includes('503') ||
                                     error?.message?.includes('UNAVAILABLE');

            if (isLastAttempt || !isRetryableError) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s
            const waitTime = delay * Math.pow(2, i);
            console.log(`Retrying in ${waitTime}ms... (Attempt ${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

export const sendMessageToGemini = async (messages, services, barbers) => {
    return retryWithBackoff(async () => {
        const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

        const systemPrompt = `You are a booking assistant for "ZEN HAIR AND BEAUTY SPA".

  AVAILABLE SERVICES: ${services.join(", ")}
  AVAILABLE BARBERS: ${barbers.join(", ")}

  GOAL: Collect ALL the following information in order:
  1. Service (one of the above)
  2. Barber (one of the above)
  3. Date (format: DD-MM-YYYY)
  4. Time (format: HH:MM)

  RULES:
  - Speak naturally and friendly in English
  - Ask ONE question at a time
  - Confirm each choice and immediately ask the next question
  - The shop is closed on Sundays and Mondays
  - Hours: 9:00-20:00 (Wednesday until 14:00, Saturday until 16:00)

  IMPORTANT FUNCTION CALLING RULES:
  - **ALWAYS** provide a text response along with your function call
  - After each answer, call book_appointment with the data you collected AND ask the next question in your text response
  - Example: User says "haircut" → Call book_appointment(service:"Men's Haircut") AND respond with "Great! Men's Haircut it is. Which barber would you like?"
  - Pass only the fields you have collected so far
  - When you have ALL 4 pieces of information, set complete:true

  RESPONSE FORMAT: Text response + function call together, ALWAYS!`;

        // ✨ Function declaration με dynamic services - ALL FIELDS OPTIONAL για progressive updates
        const bookAppointmentFunction = {
            name: 'book_appointment',
            description: 'Reports booking progress. Call this EVERY TIME you collect new information (service, barber, date, or time). Set complete:true only when you have ALL 4 pieces.',
            parameters: {
                type: 'object',
                properties: {
                    service: {
                        type: 'string',
                        description: 'The service name (if collected)',
                        enum: services
                    },
                    barber: {
                        type: 'string',
                        description: 'The barber name (if collected)',
                        enum: barbers
                    },
                    date: {
                        type: 'string',
                        description: 'The appointment date in YYYY-MM-DD format (if collected)'
                    },
                    time: {
                        type: 'string',
                        description: 'The appointment time in HH:MM format (if collected)'
                    },
                    complete: {
                        type: 'boolean',
                        description: 'Set to true ONLY when you have ALL 4 pieces of information'
                    }
                },
                required: [] // NO required fields - όλα optional για progressive updates
            }
    };

    const geminiMessages = messages.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    const allMessages = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I will help book appointments.' }] },
        ...geminiMessages
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: allMessages,
        config: {
            tools: [{ functionDeclarations: [bookAppointmentFunction] }]
        }
    });

        return response;
    }, 3, 1000); // 3 retries, starting with 1 second delay
};

// Extract function call from response - supports partial data
export const extractFunctionCall = (response) => {
    try {
        // Function calls βρίσκονται στα candidates[0].content.parts
        const parts = response.candidates?.[0]?.content?.parts || [];

        // Ψάχνουμε για part με functionCall
        const functionCallPart = parts.find(part => part.functionCall);

        if (functionCallPart && functionCallPart.functionCall.name === 'book_appointment') {
            // Επιστρέφουμε όλα τα args (συμπεριλαμβανομένου του complete αν υπάρχει)
            return functionCallPart.functionCall.args || {};
        }

        return null;
    } catch (error) {
        console.error('Error extracting function call:', error);
        return null;
    }
};