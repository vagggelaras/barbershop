import { useState } from 'react';

export default function ChatInput({ onSendMessage, disabled }) {
    // State για το τι γράφει ο χρήστης
    const [input, setInput] = useState('');

    // Όταν πατάει Enter ή το send button
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        // Αν έχει γράψει κάτι και δεν είναι disabled
        if (input.trim() && !disabled) {
            onSendMessage(input.trim()); // Στείλε το μήνυμα
            setInput(''); // Clear το input
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={disabled}
                style={styles.input}
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()} // Disabled αν δεν έχει γράψει τίποτα
                style={{
                    ...styles.button,
                    opacity: (disabled || !input.trim()) ? 0.5 : 1 // Fade όταν disabled
                }}
            >
                ➤
            </button>
        </form>
    );
}

const styles = {
    form: {
        display: 'flex',
        padding: '15px',
        borderTop: '1px solid #eee',
        gap: '8px'
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #c9a961',
        borderRadius: '20px',
        fontSize: '14px',
        outline: 'none'
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        background: '#c9a961',
        color: 'white',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'opacity 0.2s'
    }
};