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
  - Confirm each choice
  - The shop is closed on Sundays and Mondays
  - Hours: 9:00-20:00 (Wednesday until 14:00, Saturday until 16:00)
  - When you have ALL information, call the book_appointment function

  IMPORTANT: Only call the function when you have collected ALL required information!`;

        // ✨ Function declaration με dynamic services
        const bookAppointmentFunction = {
            name: 'book_appointment',
            description: 'Books a barbershop appointment when all required information is collected',
            parameters: {
                type: 'object',
                properties: {
                    service: {
                        type: 'string',
                        description: 'The service name',
                        enum: services
                    },
                    barber: {
                        type: 'string',
                        description: 'The barber name',
                        enum: barbers
                    },
                    date: {
                        type: 'string',
                        description: 'The appointment date in YYYY-MM-DD format'
                    },
                    time: {
                        type: 'string',
                        description: 'The appointment time in HH:MM format'
                    }
                },
                required: ['service', 'barber', 'date', 'time']
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

// Extract function call from response
export const extractFunctionCall = (response) => {
    try {
        // Function calls βρίσκονται στα candidates[0].content.parts
        const parts = response.candidates?.[0]?.content?.parts || [];

        // Ψάχνουμε για part με functionCall
        const functionCallPart = parts.find(part => part.functionCall);

        if (functionCallPart && functionCallPart.functionCall.name === 'book_appointment') {
            return {
                complete: true,
                ...functionCallPart.functionCall.args
            };
        }

        return null;
    } catch (error) {
        console.error('Error extracting function call:', error);
        return null;
    }
};