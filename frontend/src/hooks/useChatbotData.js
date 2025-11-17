import { useState, useEffect } from 'react'
import API_URL from '../config'

export default function useChatbotData() {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [barbersData, setBarbersData] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, personnelResponse] = await Promise.all([
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/personnel`)
        ])

        const servicesData = await servicesResponse.json()
        const personnelData = await personnelResponse.json()

        const serviceNames = servicesData.map(service => service.name)
        setServices(serviceNames)

        const activeBarbers = personnelData.filter(person => person.isActive)
        const barberNames = activeBarbers.map(person => person.name)
        setBarbers(barberNames)

        const barbersWithServices = activeBarbers.map(person => ({
          name: person.name,
          services: person.services || []
        }))
        setBarbersData(barbersWithServices)

        setDataLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setDataLoading(false)
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

  return { services, barbers, barbersData, dataLoading }
}
