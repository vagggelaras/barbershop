import { useEffect, useState } from "react"
import API_URL from '../config'
import "../styles/Confirmation.css"

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
        <div className="confirmationContainer">
            <button className="backButton" onClick={() => props.setDateSelected("")}>Back</button>

            <h2 className="confirmationTitle">Confirmation</h2>

            <div className="detailsWrapper">
                <div className="detailsSection">
                    <h3>Customer Details</h3>
                    <div className="detailItem">
                        <span className="label">Name:</span>
                        <span className="value">{userData.name || 'N/A'}</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Email:</span>
                        <span className="value">{userData.email || 'N/A'}</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Phone:</span>
                        <span className="value">{userData.phone || 'N/A'}</span>
                    </div>
                </div>

                <div className="detailsSection">
                    <h3>Appointment Details</h3>
                    <div className="detailItem">
                        <span className="label">Barber:</span>
                        <span className="value">{props.barberSelected}</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Service:</span>
                        <span className="value">{props.serviceSelected}</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Duration:</span>
                        <span className="value">{props.serviceDuration} hour</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Price:</span>
                        <span className="value">€{servicePrice !== null ? servicePrice : 'Loading...'}</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Date:</span>
                        <span className="value">{props.dateSelected}</span>
                    </div>
                    <div className="detailItem">
                        <span className="label">Time:</span>
                        <span className="value">{props.timeSelected}</span>
                    </div>
                </div>
            </div>

            <button className="confirmButton" onClick={handleConfirmAppointment}>Confirm Appointment</button>
        </div>
    )
}