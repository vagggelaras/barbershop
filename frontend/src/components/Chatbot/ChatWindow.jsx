import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendMessageToGemini, extractFunctionCall } from '../../services/geminiService';

export default function ChatWindow({ onClose, onBookingComplete, services, barbers, dataLoading }) {
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
            const response = await sendMessageToGemini(updatedMessages, services, barbers);

            // 3. Έλεγξε αν υπάρχει function call
            const functionCallData = extractFunctionCall(response);

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
                // ❌ Δεν έχουμε όλα τα στοιχεία, απλή απάντηση
                const botText = response.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't understand that.";

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
        background: '#007bff',
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