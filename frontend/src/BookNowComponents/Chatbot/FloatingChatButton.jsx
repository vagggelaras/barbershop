import { useState } from 'react'
import ChatWindow from './ChatWindow'
import "./AIStyle.css"

const INITIAL_MESSAGES = [{
  id: 1,
  role: 'bot',
  text: 'Hello! Would you like to book an appointment?',
  timestamp: new Date()
}]

export default function FloatingChatButton({
  services,
  barbers,
  barbersData,
  dataLoading,
  onStartBooking,
  onServiceSelected,
  onBarberSelected,
  onDateSelected,
  onTimeSelected,
  onBookingComplete
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Persistent state — δεν χάνεται όταν κλείνει το chat
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [bookingStep, setBookingStep] = useState(null)
  const [collectedData, setCollectedData] = useState({})

  const handleBookingComplete = (bookingData) => {
    if (onBookingComplete) onBookingComplete(bookingData)
    setIsChatOpen(false)
  }

  return (
    <>
      {isChatOpen ? (
        <ChatWindow
          onClose={() => setIsChatOpen(false)}
          onStartBooking={onStartBooking}
          onServiceSelected={onServiceSelected}
          onBarberSelected={onBarberSelected}
          onDateSelected={onDateSelected}
          onTimeSelected={onTimeSelected}
          onBookingComplete={handleBookingComplete}
          services={services}
          barbers={barbers}
          barbersData={barbersData}
          dataLoading={dataLoading}
          messages={messages}
          setMessages={setMessages}
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          collectedData={collectedData}
          setCollectedData={setCollectedData}
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
  )
}
