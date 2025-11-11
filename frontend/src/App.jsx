import { useState, useRef, useEffect } from "react"
import Navigation from "./BookNowComponents/Navigation"
import ServicesSection from "./BookNowComponents/ServicesSection"
import BarbersSection from "./BookNowComponents/BarbersSection"
import MonthDayHourSelection from "./BookNowComponents/MonthDayHourSelection"
import Confirmation from "./BookNowComponents/Confirmation"
import Recap from "./BookNowComponents/Recap"
import SignUpForm from './BookNowComponents/SignUpForm'

import Scissors3D from './HomePageComponents/Scissors3D'
import LightRays from './HomePageComponents/LightRays'
import TextType from './HomePageComponents/TextType'
// import Threads from './HomePageComponents/Threads'

import FloatingChatButton from './BookNowComponents/Chatbot/FloatingChatButton'
import API_URL from './config'

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

  // Fetch services και personnel μόνο μία φορά όταν φορτώνει η εφαρμογή
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch και τα δύο παράλληλα
        const [servicesResponse, personnelResponse] = await Promise.all([
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/personnel`)
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

  // Progressive callbacks για chatbot - καλούνται καθώς συλλέγονται δεδομένα
  const handleChatbotServiceSelected = async (serviceName) => {
    console.log("Chatbot selected service:", serviceName)
    try {
      const response = await fetch(`${API_URL}/services`)
      const servicesData = await response.json()
      const selectedService = servicesData.find(
        service => service.name.toLowerCase() === serviceName.toLowerCase()
      )

      setServiceSelected(serviceName)
      setServiceDuration(selectedService?.duration || null)
      setServicePrice(selectedService?.price || null)
    } catch (error) {
      console.error('Error setting service:', error)
    }
  }

  const handleChatbotBarberSelected = (barberName) => {
    console.log("Chatbot selected barber:", barberName)
    setBarberSelected(barberName)
  }

  const handleChatbotDateSelected = (date) => {
    console.log("Chatbot selected date:", date)
    // Μετατροπή από YYYY-MM-DD σε DD-MM-YYYY
    const [year, month, day] = date.split('-')
    const formattedDate = `${day}-${month}-${year}`

    // Υπολογισμός weekDay
    const dateObj = new Date(date)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    weekDay.current = days[dateObj.getDay()]

    setDateSelected(formattedDate)
  }

  const handleChatbotTimeSelected = (time) => {
    console.log("Chatbot selected time:", time)
    setTimeSelected(time)
  }

  // Handle booking completion από το chatbot
  const handleChatbotBooking = async (bookingData) => {
    console.log("handleChatbotBooking called with:", bookingData);
    try {
      // 1. Fetch το service για να πάρουμε το duration
      const response = await fetch(`${API_URL}/services`)
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

      {activeButton === 0 ?
        <div style={{
          position: 'absolute',
          width: '100%',
          top:'0',
          height: '100vh',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${process.env.PUBLIC_URL}/backgroundImg2.avif)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#000000"
            raysSpeed={1}
            lightSpread={0.8}
            rayLength={2}
            fadeDistance={0.5}
            saturation={0.4}
            followMouse={true}
            mouseInfluence={.01}
            noiseAmount={0.05}
            distortion={0}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Scissors3D />
          </div>
          <div style={{ position: 'relative', zIndex: 3 }}>
            <TextType
              text={["Welcome to ZEN Hair & Beauty Spa", "Your Perfect Look Awaits", "Book Your Appointment Today"]}
              as="p"
              typingSpeed={90}
              deletingSpeed={50}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              className="homepage-text"
            />
          </div>
        </div>
        : null
      }

      {userLoggedIn ? <FloatingChatButton
        services={services}
        barbers={barbers}
        dataLoading={dataLoading}
        onServiceSelected={handleChatbotServiceSelected}
        onBarberSelected={handleChatbotBarberSelected}
        onDateSelected={handleChatbotDateSelected}
        onTimeSelected={handleChatbotTimeSelected}
        onBookingComplete={handleChatbotBooking}
      /> : null}

      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffffff"
        raysSpeed={1}
        lightSpread={0.8}
        rayLength={2}
        fadeDistance={0.5}
        saturation={0.4}
        followMouse={true}
        mouseInfluence={.03}
        noiseAmount={0.05}
        distortion={0}
        className="custom-rays"
      />
    
    </>
  )
}