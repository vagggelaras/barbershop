import { useState } from 'react'
import ChatWindow from './ChatWindow'
import "./AIStyle.css"

export default function FloatingChatButton({
  services,
  barbers,
  barbersData,
  dataLoading,
  onServiceSelected,
  onBarberSelected,
  onDateSelected,
  onTimeSelected,
  onBookingComplete
}) {
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
          onServiceSelected={onServiceSelected}
          onBarberSelected={onBarberSelected}
          onDateSelected={onDateSelected}
          onTimeSelected={onTimeSelected}
          onBookingComplete={handleBookingComplete}
          services={services}
          barbers={barbers}
          barbersData={barbersData}
          dataLoading={dataLoading}
        />
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className={'aiIcon'}
        >
          Ask AI
        </button>
      )}
    </>
  );
}
