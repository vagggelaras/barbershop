import { useEffect, useState } from "react"
import API_URL from '../config'

export default function Confirmation(props) {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}')
    const [servicePrice, setServicePrice] = useState(null)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_URL}/services`)
                const data = await response.json()

                if (Array.isArray(data)) {
                    const selectedService = data.find(
                        service => service.name.toLowerCase() === props.serviceSelected.toLowerCase()
                    )

                    if (selectedService) {
                        setServicePrice(selectedService.price)
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }
        fetchServices()
    }, [props.serviceSelected])

    async function handleConfirmAppointment() {
        const appointmentData = {
            date: props.dateSelected,
            time: props.timeSelected,
            service: props.serviceSelected,
            userEmail: userData.email,
            userName: userData.name,
            barberName: props.barberSelected,
            duration: props.serviceDuration,
            userPhone: userData.phone
        }

        console.log("Sending appointment:", appointmentData) // Debug

        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            })

            const data = await response.json()

            if (response.ok) {
                console.log("Appointment created successfully:", data)
                alert("Το ραντεβού σας επιβεβαιώθηκε!")
                // redirect ή reset την κατάσταση
            } else {
                console.error("Error creating appointment:", data)
                alert("Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.")
            }
        } catch (error) {
            console.error('Error:', error)
            alert("Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.")
        }
    }

    return (
        <div>
            <button onClick={() => props.setDateSelected("")}>Back</button>
            <h2>Confirmation</h2>

            <div>
                <h3>Customer Details:</h3>
                <p><strong>Name:</strong> {userData.name || 'N/A'}</p>
                <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
            </div>

            <div>
                <h3>Appointment Details:</h3>
                <p><strong>Barber:</strong> {props.barberSelected}</p>
                <p><strong>Service:</strong> {props.serviceSelected}</p>
                <p><strong>Duration:</strong> {props.serviceDuration} hour</p>
                <p><strong>Price:</strong> €{servicePrice !== null ? servicePrice : 'Loading...'}</p>
                <p><strong>Date:</strong> {props.dateSelected}</p>
                <p><strong>Time:</strong> {props.timeSelected}</p>
            </div>

            <button onClick={handleConfirmAppointment}>Confirm Appointment</button>
        </div>
    )
}