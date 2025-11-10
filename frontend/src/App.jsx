import { useState, useRef, useEffect } from "react"
import Navigation from "./components/Navigation"
import ServicesSection from "./components/ServicesSection"
import BarbersSection from "./components/BarbersSection"
import MonthDayHourSelection from "./components/MonthDayHourSelection"
import Confirmation from "./components/Confirmation"
import Recap from "./components/Recap"
import SignUpForm from './components/SignUpForm'

import FloatingChatButton from './components/Chatbot/FloatingChatButton'

export default function App() {

  const [activeButton, setActiveButton] = useState(1)
  const [userLoggedIn, setUserLoggedIn] = useState(sessionStorage.length)
  const [serviceSelected, setServiceSelected] = useState(null)
  const [serviceDuration, setServiceDuration] = useState(null)
  const [servicePrice, setServicePrice] = useState(null)
  const [dateSelected, setDateSelected] = useState("")
  const weekDay = useRef("")
  const [barberSelected, setBarberSelected] = useState("")
  const [timeSelected, setTimeSelected] = useState("")

  function handleNavClick(number) {
    setActiveButton(number)
  }

  function renderComponentInBookNow() {
    if (dateSelected) return <Confirmation setDateSelected={setDateSelected} dateSelected={dateSelected}barberSelected={barberSelected}serviceSelected={serviceSelected}serviceDuration={serviceDuration}servicePrice={servicePrice}weekDay={weekDay}timeSelected={timeSelected}/>
    if (barberSelected) return <MonthDayHourSelection setBarberSelected={setBarberSelected} setDateSelected={setDateSelected} setTimeSelected={setTimeSelected} weekDay={weekDay} barberSelected={barberSelected} serviceDuration={serviceDuration} />
    if (serviceSelected) return <BarbersSection setBarberSelected={setBarberSelected} setServiceSelected={setServiceSelected}/>
    if (userLoggedIn) return <ServicesSection setServiceSelected={setServiceSelected} setServiceDuration={setServiceDuration} setServicePrice={setServicePrice} setUserLoggedIn={setUserLoggedIn}/>
    return <SignUpForm userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
  }

  // State για services και barbers για chatbot
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  // Fetch services ΚΑΙ personnel μόνο μία φορά όταν φορτώνει η εφαρμογή
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch και τα δύο παράλληλα
        const [servicesResponse, personnelResponse] = await Promise.all([
          fetch('http://localhost:5000/services'),
          fetch('http://localhost:5000/personnel')
        ])

        const servicesData = await servicesResponse.json()
        const personnelData = await personnelResponse.json()

        // Παίρνουμε τα ονόματα των services
        const serviceNames = servicesData.map(service => service.name)
        setServices(serviceNames)

        // Παίρνουμε τα ονόματα των ACTIVE barbers
        const barberNames = personnelData
          .filter(person => person.isActive)
          .map(person => person.name)
        setBarbers(barberNames)

        setDataLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setDataLoading(false)
        // Fallback
        setServices([
          "Children's Haircut",
          "Men's Haircut",
          "Woman's Haircut"
        ])
        setBarbers(["Giannis", "Barbara"])
      }
    }

    fetchData()
  }, [])

  // Handle booking completion από το chatbot
  const handleChatbotBooking = async (bookingData) => {
    console.log("handleChatbotBooking called with:", bookingData);
    try {
      // 1. Fetch το service για να πάρουμε το duration
      const response = await fetch('http://localhost:5000/services')
      const servicesData = await response.json()

      const selectedService = servicesData.find(
        service => service.name.toLowerCase() === bookingData.service.toLowerCase()
      )

      // 2. Μετατροπή ημερομηνίας από YYYY-MM-DD σε DD-MM-YYYY
      const [year, month, day] = bookingData.date.split('-')
      const formattedDate = `${day}-${month}-${year}`

      // 3. Υπολογισμός weekDay από το date
      const dateObj = new Date(bookingData.date)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayName = days[dateObj.getDay()]

      // 4. Set όλα τα state variables
      setServiceSelected(bookingData.service)
      setServiceDuration(selectedService?.duration || null)
      setBarberSelected(bookingData.barber)
      setDateSelected(formattedDate)
      setTimeSelected(bookingData.time)
      weekDay.current = dayName

      console.log("Booking set:", {
        service: bookingData.service,
        barber: bookingData.barber,
        date: bookingData.date,
        time: bookingData.time,
        duration: selectedService?.duration,
        weekDay: dayName
      })
    } catch (error) {
      console.error('Error setting booking data:', error)
    }
  }

  return (
    <>
      <Navigation
        onButtonClick={handleNavClick}
      />

      {activeButton === 1 ?
        (<>
        <main>
          {renderComponentInBookNow()}
        </main>
        {!dateSelected && <Recap serviceSelected={serviceSelected} barberSelected={barberSelected}/>}
        </>)
        : null
      }

      <FloatingChatButton
        services={services}
        barbers={barbers}
        dataLoading={dataLoading}
        onBookingComplete={handleChatbotBooking}
      />
    </>
  )
}