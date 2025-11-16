import { useEffect, useRef } from 'react';

export default function MessageList({ messages, isLoading }) {
    // Ref για το τέλος της λίστας (για auto-scroll)
    const endRef = useRef(null);

    // Κάθε φορά που αλλάζουν τα messages, scroll στο τέλος
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div style={styles.messageList}>
            {/* Loop όλα τα messages */}
            {messages.map(message => (
                <div
                    key={message.id}
                    style={{
                        ...styles.messageContainer,
                        // User messages δεξιά, bot messages αριστερά
                        alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                >
                    <div
                        style={{
                            ...styles.bubble,
                            // User: σκούρο γκρι, Bot: ανοιχτό γκρι
                            background: message.role === 'user' ? '#333333' : '#f5f5f5',
                            color: message.role === 'user' ? 'white' : '#1a1a1a'
                        }}
                    >
                        {message.text}
                    </div>
                </div>
            ))}

            {/* Typing indicator όταν περιμένουμε απάντηση */}
            {isLoading && (
                <div style={{ ...styles.messageContainer, alignItems: 'flex-start' }}>
                    <div style={{ ...styles.bubble, background: '#f5f5f5', color: '#1a1a1a' }}>
                        Typing...
                    </div>
                </div>
            )}

            {/* Invisible div για auto-scroll */}
            <div ref={endRef} />
        </div>
    );
}

const styles = {
    messageList: {
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    bubble: {
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: '18px',
        wordWrap: 'break-word',
        fontSize: '14px',
        lineHeight: '1.4',
        whiteSpace: 'pre-line'
    }
};