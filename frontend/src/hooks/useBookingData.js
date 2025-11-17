import { useState, useRef } from 'react'
import API_URL from '../config'

export default function useBookingData() {
  const [serviceSelected, setServiceSelected] = useState(null)
  const [serviceDuration, setServiceDuration] = useState(null)
  const [servicePrice, setServicePrice] = useState(null)
  const [dateSelected, setDateSelected] = useState("")
  const [barberSelected, setBarberSelected] = useState("")
  const [timeSelected, setTimeSelected] = useState("")
  const weekDay = useRef("")

  const resetAllSelected = () => {
    setServiceSelected(null)
    setBarberSelected(null)
    setDateSelected(null)
  }

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
    const [year, month, day] = date.split('-')
    const formattedDate = `${day}-${month}-${year}`

    const dateObj = new Date(date)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    weekDay.current = days[dateObj.getDay()]

    setDateSelected(formattedDate)
  }

  const handleChatbotTimeSelected = (time) => {
    console.log("Chatbot selected time:", time)
    setTimeSelected(time)
  }

  const handleChatbotBooking = async (bookingData) => {
    console.log("handleChatbotBooking called with:", bookingData)
    try {
      const response = await fetch(`${API_URL}/services`)
      const servicesData = await response.json()

      const selectedService = servicesData.find(
        service => service.name.toLowerCase() === bookingData.service.toLowerCase()
      )

      const [year, month, day] = bookingData.date.split('-')
      const formattedDate = `${day}-${month}-${year}`

      const dateObj = new Date(bookingData.date)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayName = days[dateObj.getDay()]

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

  return {
    serviceSelected,
    setServiceSelected,
    serviceDuration,
    setServiceDuration,
    servicePrice,
    setServicePrice,
    dateSelected,
    setDateSelected,
    barberSelected,
    setBarberSelected,
    timeSelected,
    setTimeSelected,
    weekDay,
    resetAllSelected,
    handleChatbotServiceSelected,
    handleChatbotBarberSelected,
    handleChatbotDateSelected,
    handleChatbotTimeSelected,
    handleChatbotBooking
  }
}
