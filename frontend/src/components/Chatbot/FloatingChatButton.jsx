import { useState } from 'react'
import ChatWindow from './ChatWindow'

export default function FloatingChatButton({ services, barbers, dataLoading, onBookingComplete }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleBookingComplete = (bookingData) => {
    console.log("Booking completed:", bookingData);

    // Καλούμε το callback από το App.jsx
    if (onBookingComplete) {
      onBookingComplete(bookingData);
    }

    setIsChatOpen(false);
  };

  return (
    <>
      {isChatOpen ? (
        <ChatWindow
          onClose={() => setIsChatOpen(false)}
          onBookingComplete={handleBookingComplete}
          services={services}
          barbers={barbers}
          dataLoading={dataLoading}
        />
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          style={styles.button}
        >
          💬
        </button>
      )}
    </>
  );
}

const styles = {
  button: {
    position: 'fixed',      
    bottom: '20px',         
    right: '20px',          
    width: '60px',
    height: '60px',
    borderRadius: '50%',    
    background: '#007bff',  
    color: 'white',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
    zIndex: 999,           
  }
};
