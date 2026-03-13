import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendMessageToGemini, extractFunctionCall } from '../../services/geminiService';
import './AIStyle.css';

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
    dataLoading
}) {
    // Όλα τα μηνύματα (bot + user)
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text: 'Hello! Would you like to book an appointment?',
            timestamp: new Date()
        }
    ]);

    // true = περιμένουμε απάντηση από Gemini
    const [isLoading, setIsLoading] = useState(false);

    // Κρατάμε track τι έχουμε ήδη καλέσει για να μην ξανακαλέσουμε
    const [calledCallbacks, setCalledCallbacks] = useState({
        service: false,
        barber: false,
        date: false,
        time: false
    });

    // Όταν ο χρήστης στέλνει μήνυμα
    const handleSendMessage = async (userMessage) => {
        // Ελέγχουμε αν έχουν φορτώσει τα data
        if (dataLoading) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'bot',
                text: 'Please wait, loading data...',
                timestamp: new Date()
            }]);
            return;
        }

        // 1. Προσθήκη user message
        const newUserMessage = {
            id: Date.now(),
            role: 'user',
            text: userMessage,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // 2. Στείλε στο Gemini
            const updatedMessages = [...messages, newUserMessage];
            const response = await sendMessageToGemini(updatedMessages, services, barbers, barbersData);

            // DEBUG: Δες τι επιστρέφει το Gemini
            console.log("Gemini full response:", response);
            console.log("Gemini response content:", JSON.stringify(response.candidates?.[0]?.content, null, 2));
            console.log("Response parts:", response.candidates?.[0]?.content?.parts);

            // 3. Έλεγξε αν υπάρχει function call
            const functionCallData = extractFunctionCall(response);
            console.log("Extracted function call data:", functionCallData);

            // Καλούμε progressive callbacks για νέα δεδομένα
            if (functionCallData) {
                // User θέλει να κάνει booking → πήγαινε στο Book Now (ServicesSection)
                if (functionCallData.wants_to_book && onStartBooking) {
                    onStartBooking();
                }

                // Έλεγχος αν έχουμε service και δεν το έχουμε ξανακαλέσει
                if (functionCallData.service && !calledCallbacks.service && onServiceSelected) {
                    console.log("Calling onServiceSelected:", functionCallData.service);
                    onServiceSelected(functionCallData.service);
                    setCalledCallbacks(prev => ({ ...prev, service: true }));
                }

                // Έλεγχος αν έχουμε barber και δεν το έχουμε ξανακαλέσει
                if (functionCallData.barber && !calledCallbacks.barber && onBarberSelected) {
                    console.log("Calling onBarberSelected:", functionCallData.barber);
                    onBarberSelected(functionCallData.barber);
                    setCalledCallbacks(prev => ({ ...prev, barber: true }));
                }

                // Έλεγχος αν έχουμε date και δεν το έχουμε ξανακαλέσει
                if (functionCallData.date && !calledCallbacks.date && onDateSelected) {
                    console.log("Calling onDateSelected:", functionCallData.date);
                    onDateSelected(functionCallData.date);
                    setCalledCallbacks(prev => ({ ...prev, date: true }));
                }

                // Έλεγχος αν έχουμε time και δεν το έχουμε ξανακαλέσει
                if (functionCallData.time && !calledCallbacks.time && onTimeSelected) {
                    console.log("Calling onTimeSelected:", functionCallData.time);
                    onTimeSelected(functionCallData.time);
                    setCalledCallbacks(prev => ({ ...prev, time: true }));
                }
            }

            // Εξαγωγή bot text response (μπορεί να είναι σε διαφορετικό part από το functionCall)
            const parts = response.candidates?.[0]?.content?.parts || [];
            const textPart = parts.find(part => part.text);

            // Αν δεν υπάρχει text αλλά υπάρχει functionCall, φτιάξε custom follow-up message
            let botText = textPart?.text;

            if (!botText && functionCallData && !functionCallData.complete) {
                // Δημιουργία custom follow-up based on τι έχουμε ΗΔΗ συλλέξει (using calledCallbacks)
                if (!calledCallbacks.service || (functionCallData.service && !calledCallbacks.barber)) {
                    // Μόλις πήραμε service, ρώτα για barber
                    botText = `Great! ${functionCallData.service || 'Service selected'}. Which barber would you like? (${barbers.join(', ')})`;
                } else if (!calledCallbacks.date || (functionCallData.barber && !calledCallbacks.date)) {
                    // Μόλις πήραμε barber, ρώτα για date
                    botText = `Perfect! ${functionCallData.barber || 'Barber selected'}. What date would you like? (Format: DD-MM-YYYY, we're closed Sundays & Mondays)`;
                } else if (!calledCallbacks.time || (functionCallData.date && !calledCallbacks.time)) {
                    // Μόλις πήραμε date, ρώτα για time
                    botText = `Got it! What time works for you? (9:00-20:00, Wed until 14:00, Sat until 16:00)`;
                } else {
                    botText = "Got it! ✓";
                }
            } else if (!botText) {
                botText = "I'm sorry, I didn't understand that.";
            }

            if (functionCallData?.complete) {
                // User confirmed → set booking data and navigate to Confirmation page
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: `Taking you to the confirmation page...`,
                    timestamp: new Date()
                }]);

                setTimeout(() => {
                    onBookingComplete(functionCallData);
                }, 1500);
            } else {
                // Progressive update ή συνηθισμένη απάντηση
                const botResponse = {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: botText,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botResponse]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: 'Sorry, something went wrong. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatWindow">
            {/* Header */}
            <div className="chatHeader">
                <span>💬 Chat Assistant</span>
                <button onClick={onClose} className="closeBtn">✕</button>
            </div>

            {/* Messages */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
    );
}