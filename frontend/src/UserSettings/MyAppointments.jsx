import { useState, useEffect } from 'react'
import API_URL from '../config'
import './MyAppointments.css'

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cancellingId, setCancellingId] = useState(null)
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}')

    useEffect(() => {
        fetchUserAppointments()
    }, [])

    const fetchUserAppointments = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/appointments/user/${encodeURIComponent(storedUser.email)}`)

            if (response.ok) {
                const data = await response.json()
                setAppointments(data.appointments || [])
            } else {
                setError('Failed to load appointments')
            }
        } catch (err) {
            setError('Error loading appointments')
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return
        }

        try {
            setCancellingId(appointmentId)
            const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                // Remove cancelled appointment from list
                setAppointments(prev => prev.filter(apt => apt._id !== appointmentId))
            } else {
                alert('Failed to cancel appointment')
            }
        } catch (err) {
            alert('Error cancelling appointment')
            console.error(err)
        } finally {
            setCancellingId(null)
        }
    }

    const isUpcoming = (date, time) => {
        // Convert DD-MM-YYYY to YYYY-MM-DD for proper Date parsing
        const [day, month, year] = date.split('-')
        const isoDate = `${year}-${month}-${day}`
        const appointmentDateTime = new Date(`${isoDate}T${time}`)
        return appointmentDateTime > new Date()
    }

    const formatDate = (dateStr) => {
        // Input is already in DD-MM-YYYY format from database
        return dateStr.replace(/-/g, '/')
    }

    const getWeekDay = (dateStr) => {
        // Convert DD-MM-YYYY to YYYY-MM-DD for proper Date parsing
        const [day, month, year] = dateStr.split('-')
        const isoDate = `${year}-${month}-${day}`
        const date = new Date(isoDate)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days[date.getDay()]
    }

    const upcomingAppointments = appointments.filter(apt => isUpcoming(apt.date, apt.time))
    const pastAppointments = appointments.filter(apt => !isUpcoming(apt.date, apt.time))

    if (loading) {
        return (
            <div className="myAppointmentsContainer">
                <div className="loadingMessage">Loading appointments...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="myAppointmentsContainer">
                <div className="errorMessage">{error}</div>
            </div>
        )
    }

    return (
        <div className="myAppointmentsContainer">
            <h1>My Appointments</h1>

            {/* Upcoming Appointments */}
            <section className="appointmentsSection">
                <h2>Upcoming Appointments ({upcomingAppointments.length})</h2>

                {upcomingAppointments.length === 0 ? (
                    <div className="emptyState">
                        <p>No upcoming appointments</p>
                    </div>
                ) : (
                    <div className="appointmentsGrid">
                        {upcomingAppointments.map(appointment => (
                            <div key={appointment._id} className="appointmentCard upcoming">
                                <div className="appointmentHeader">
                                    <div className="appointmentDate">
                                        <div className="dateDay">{formatDate(appointment.date)}</div>
                                        <div className="dateWeekday">{getWeekDay(appointment.date)}</div>
                                    </div>
                                    <div className="appointmentTime">{appointment.time}</div>
                                </div>

                                <div className="appointmentBody">
                                    <div className="appointmentInfo">
                                        <div className="infoRow">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            <span><strong>Service:</strong> {appointment.service}</span>
                                        </div>
                                        <div className="infoRow">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            <span><strong>Barber:</strong> {appointment.barberName}</span>
                                        </div>
                                        <div className="infoRow">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                            </svg>
                                            <span><strong>Duration:</strong> {appointment.duration} minutes</span>
                                        </div>
                                    </div>

                                    <button
                                        className="cancelButton"
                                        onClick={() => handleCancelAppointment(appointment._id)}
                                        disabled={cancellingId === appointment._id}
                                    >
                                        {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel Appointment'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Past Appointments */}
            <section className="appointmentsSection">
                <h2>Appointment History ({pastAppointments.length})</h2>

                {pastAppointments.length === 0 ? (
                    <div className="emptyState">
                        <p>No past appointments</p>
                    </div>
                ) : (
                    <div className="appointmentsGrid">
                        {pastAppointments.map(appointment => (
                            <div key={appointment._id} className="appointmentCard past">
                                <div className="appointmentHeader">
                                    <div className="appointmentDate">
                                        <div className="dateDay">{formatDate(appointment.date)}</div>
                                        <div className="dateWeekday">{getWeekDay(appointment.date)}</div>
                                    </div>
                                    <div className="appointmentTime">{appointment.time}</div>
                                </div>

                                <div className="appointmentBody">
                                    <div className="appointmentInfo">
                                        <div className="infoRow">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            <span><strong>Service:</strong> {appointment.service}</span>
                                        </div>
                                        <div className="infoRow">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            <span><strong>Barber:</strong> {appointment.barberName}</span>
                                        </div>
                                        <div className="infoRow">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                            </svg>
                                            <span><strong>Duration:</strong> {appointment.duration} minutes</span>
                                        </div>
                                    </div>

                                    <div className="completedBadge">Completed</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
