import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendMessageToGemini, extractFunctionCall } from '../../services/geminiService';

export default function ChatWindow({
    onClose,
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
                // ✅ Booking complete!
                const completionMessage = {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: `Perfect! Your appointment is booked:\n\n📅 ${functionCallData.date}\n⏰${functionCallData.time}\n💇 ${functionCallData.service}\n👤 ${functionCallData.barber}`,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, completionMessage]);

                // Καλούμε την onBookingComplete μετά από 2 δευτερόλεπτα
                console.log("Calling onBookingComplete with:", functionCallData);
                setTimeout(() => {
                    console.log("Executing onBookingComplete...");
                    onBookingComplete(functionCallData);
                }, 2000);
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
        <div style={styles.chatWindow}>
            {/* Header */}
            <div style={styles.header}>
                <span>💬 Chat Assistant</span>
                <button onClick={onClose} style={styles.closeBtn}>✕</button>
            </div>

            {/* Messages */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
    );
}

const styles = {
    chatWindow: {
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '350px',
        height: '500px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 1000
    },
    header: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        background: '#1a1a1a',
        color: 'white',
        borderRadius: '10px 10px 0 0'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    }
};