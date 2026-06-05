import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendChatMessage, buildSystemPrompt } from '../../services/geminiService';
import './AIStyle.css';

// Validates extracted function data against current step and known values
const validateFunctionData = (data, step, services, barbers) => {
    if (!data) return null;

    const valid = {};

    if (data.wants_to_book) valid.wants_to_book = true;

    switch (step) {
        case null:
            break;
        case 'service':
            if (data.service && services.includes(data.service)) valid.service = data.service;
            break;
        case 'barber':
            if (data.barber && barbers.includes(data.barber)) valid.barber = data.barber;
            break;
        case 'date':
            if (data.date && /^\d{4}-\d{2}-\d{2}$/.test(data.date)) valid.date = data.date;
            break;
        case 'time':
            if (data.time && /^\d{1,2}:\d{2}$/.test(data.time)) valid.time = data.time;
            break;
        case 'confirm':
            if (data.complete) valid.complete = true;
            break;
        default:
            break;
    }

    return Object.keys(valid).length > 0 ? valid : null;
};

export default function ChatWindow({
    onClose,
    onStartBooking,
    onServiceSelected,
    onBarberSelected,
    onDateSelected,
    onTimeSelected,
    onBookingComplete,
    services,
    barbers,
    barbersData,
    dataLoading,
    messages,
    setMessages,
    bookingStep,
    setBookingStep,
    collectedData,
    setCollectedData
}) {
    const [isLoading, setIsLoading] = useState(false);

    const addBotMessage = (text) => ({
        id: Date.now() + 1,
        role: 'bot',
        text,
        timestamp: new Date()
    });

    const handleSendMessage = async (userMessage) => {
        if (dataLoading) {
            setMessages(prev => [...prev, addBotMessage('Please wait, loading data...')]);
            return;
        }

        const newUserMessage = { id: Date.now(), role: 'user', text: userMessage, timestamp: new Date() };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const systemPrompt = buildSystemPrompt(bookingStep, collectedData, services, barbers, barbersData);
            const { text, functionData } = await sendChatMessage(updatedMessages, systemPrompt, services, barbers);

            // Validate against current step — rejects hallucinated or out-of-order data
            const validated = validateFunctionData(functionData, bookingStep, services, barbers);

            let nextStep = bookingStep;
            let nextData = { ...collectedData };

            if (validated) {
                if (validated.wants_to_book && bookingStep === null) {
                    nextStep = 'service';
                    if (onStartBooking) onStartBooking();
                }
                if (validated.service && bookingStep === 'service') {
                    nextData.service = validated.service;
                    if (onServiceSelected) onServiceSelected(validated.service);
                    nextStep = 'barber';
                }
                if (validated.barber && bookingStep === 'barber') {
                    nextData.barber = validated.barber;
                    if (onBarberSelected) onBarberSelected(validated.barber);
                    nextStep = 'date';
                }
                if (validated.date && bookingStep === 'date') {
                    nextData.date = validated.date;
                    if (onDateSelected) onDateSelected(validated.date);
                    nextStep = 'time';
                }
                if (validated.time && bookingStep === 'time') {
                    nextData.time = validated.time;
                    if (onTimeSelected) onTimeSelected(validated.time);
                    nextStep = 'confirm';
                }
                if (validated.complete && bookingStep === 'confirm') {
                    setMessages(prev => [...prev, newUserMessage, addBotMessage('Taking you to the confirmation page...')]);
                    setIsLoading(false);
                    setTimeout(() => onBookingComplete(nextData), 1500);
                    return;
                }
            }

            setBookingStep(nextStep);
            setCollectedData(nextData);

            // Fallback contextual αν το model δεν έστειλε text (συμβαίνει όταν κάνει tool call)
            let botText = text;
            if (!botText) {
                switch (nextStep) {
                    case 'service':
                        botText = 'What service would you like to book?';
                        break;
                    case 'barber':
                        botText = `Great choice! Which barber would you like for your ${nextData.service}?`;
                        break;
                    case 'date':
                        botText = `Perfect! What date works for you? (DD-MM-YYYY, closed Sundays & Mondays)`;
                        break;
                    case 'time':
                        botText = `Got it! What time would you like? (9:00-20:00, Wed until 14:00, Sat until 16:00)`;
                        break;
                    case 'confirm':
                        botText = `To confirm: ${nextData.service} with ${nextData.barber} on ${nextData.date} at ${nextData.time}. Shall I book this?`;
                        break;
                    default:
                        botText = "I'm not sure I understood that. Could you rephrase?";
                }
            }

            setMessages(prev => [...prev, addBotMessage(botText)]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, addBotMessage('Sorry, something went wrong. Please try again.')]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatWindow">
            <div className="chatHeader">
                <span>💬 Chat Assistant</span>
                <button onClick={onClose} className="closeBtn">✕</button>
            </div>
            <MessageList messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
    );
}
