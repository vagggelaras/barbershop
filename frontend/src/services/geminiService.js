import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

const bookAppointmentTool = (services, barbers) => ({
    type: 'function',
    function: {
        name: 'book_appointment',
        description: `Call this ONLY when the user has explicitly stated the value you were asking for.
Do NOT call it speculatively, do NOT fill in values the user has not mentioned.
Do NOT call it when asking questions or chatting — only after the user gives a clear answer.`,
        parameters: {
            type: 'object',
            properties: {
                wants_to_book: {
                    type: 'boolean',
                    description: 'true only when user clearly says they want to book'
                },
                service: {
                    type: 'string',
                    enum: services,
                    description: 'Set only when user explicitly states the service they want'
                },
                barber: {
                    type: 'string',
                    enum: barbers,
                    description: 'Set only when user explicitly states the barber they want'
                },
                date: {
                    type: 'string',
                    description: 'Date in YYYY-MM-DD format, set only when user explicitly provides a date'
                },
                time: {
                    type: 'string',
                    description: 'Time in HH:MM format, set only when user explicitly provides a time'
                },
                complete: {
                    type: 'boolean',
                    description: 'true only when user explicitly confirms the full booking summary'
                }
            },
            required: []
        }
    }
});

export const buildSystemPrompt = (step, collectedData, services, barbers, barbersData) => {
    const barberServicesInfo = barbersData?.length > 0
        ? barbersData.map(b => `${b.name}: ${b.services.join(', ')}`).join(' | ')
        : '';

    const base = `You are a friendly booking assistant for "ZEN HAIR AND BEAUTY SPA".
Keep responses SHORT (1-2 sentences). Be warm and natural.
Shop hours: 9:00-20:00 (Wed until 14:00, Sat until 16:00). Closed Sundays & Mondays.
${barberServicesInfo ? `Barber specializations: ${barberServicesInfo}` : ''}

IMPORTANT: Only call book_appointment() when the user has explicitly provided the answer to your question.
Do not call it while asking questions or chatting. Do not guess or assume values.`;

    const steps = {
        null: `Respond naturally. If the user wants to book, call book_appointment(wants_to_book:true) and ask which service they'd like.`,
        service: `You are collecting the SERVICE. Ask the user which service they want.
Available: ${services.join(', ')}.
When the user states a service, call book_appointment(service:"...") with the exact service name.`,
        barber: `Service already selected: ${collectedData.service}.
You are collecting the BARBER. Ask which barber they'd like.
Available: ${barbers.join(', ')}.
When the user states a barber, call book_appointment(barber:"...").`,
        date: `Booking so far: ${collectedData.service} with ${collectedData.barber}.
You are collecting the DATE. Ask for the date (DD-MM-YYYY). Remind: closed Sundays & Mondays.
When the user provides a date, call book_appointment(date:"YYYY-MM-DD").`,
        time: `Booking so far: ${collectedData.service} with ${collectedData.barber} on ${collectedData.date}.
You are collecting the TIME. Ask for the time (9:00-20:00, Wed until 14:00, Sat until 16:00).
When user provides a time, call book_appointment(time:"HH:MM").`,
        confirm: `All info collected. Present this summary and ask "Shall I confirm?":
Service: ${collectedData.service} | Barber: ${collectedData.barber} | Date: ${collectedData.date} | Time: ${collectedData.time}
When user confirms, call book_appointment(complete:true).`
    };

    return `${base}\n\nCURRENT STEP: ${steps[step] || steps[null]}`;
};

export const sendChatMessage = async (messages, systemPrompt, services, barbers) => {
    const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
            role: msg.role === 'bot' ? 'assistant' : 'user',
            content: msg.text
        }))
    ];

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        tools: [bookAppointmentTool(services, barbers)],
        tool_choice: 'auto',
        max_tokens: 300
    });

    const message = response.choices?.[0]?.message;

    // Extract function call if present
    let functionData = null;
    const toolCall = message?.tool_calls?.[0];
    if (toolCall?.function?.name === 'book_appointment') {
        try {
            functionData = JSON.parse(toolCall.function.arguments);
        } catch (e) {
            console.error('Failed to parse tool call arguments', e);
        }
    }

    // Clean text — strip any leaked function call markup
    const text = (message?.content || '').replace(/<function=\w+>[\s\S]*?<\/function>/g, '').trim();

    return { text, functionData };
};
