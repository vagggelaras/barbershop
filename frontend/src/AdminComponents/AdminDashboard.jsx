import { useState, useEffect } from 'react'
import './AdminDashboard.css'
import API_URL from '../config'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('appointments')
    const [appointments, setAppointments] = useState([])
    const [services, setServices] = useState([])
    const [personnel, setPersonnel] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingService, setEditingService] = useState(null)
    const [editingPersonnel, setEditingPersonnel] = useState(null)
    const [showAddPersonnel, setShowAddPersonnel] = useState(false)
    const [showAddService, setShowAddService] = useState(false)
    const [editFormData, setEditFormData] = useState({
        name: '',
        duration: '',
        price: '',
        category: ''
    })
    const [personnelFormData, setPersonnelFormData] = useState({
        name: '',
        email: '',
        photo: '',
        isActive: true,
        daysOff: [],
        services: []
    })
    const [calendarMonth, setCalendarMonth] = useState(new Date())
    const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(() => {
        const today = new Date()
        const day = String(today.getDate()).padStart(2, '0')
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const year = today.getFullYear()
        return `${day}-${month}-${year}`
    })
// console.log('Personnel:', personnel)
// console.log('Services:', services)

    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const response = await fetch(`${API_URL}/personnel`)
                const data = await response.json()
                setPersonnel(data)
            } catch (error) {
                console.error('Error fetching personnel:', error)
            }
        }
        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_URL}/services`)
                const data = await response.json()
                setServices(data)
            } catch (error) {
                console.error('Error fetching personnel:', error)
            }
        }
        fetchPersonnel()
        fetchServices()
    }, [])

    useEffect(() => {
        const fetchAppointmentsForDate = async () => {
            try {
                const response = await fetch(`${API_URL}/appointments/date/${selectedAppointmentDate}`)
                const data = await response.json()
                if (data.success) {
                    setAppointments(data.appointments)
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching appointments:', error)
                setLoading(false)
            }
        }
        fetchAppointmentsForDate()
    }, [selectedAppointmentDate])    

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('el-GR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const deleteAppointment = async (id) => {
        if (!window.confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το ραντεβού;')) return

        try {
            const response = await fetch(`${API_URL}/appointments/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                setAppointments(appointments.filter(apt => apt._id !== id))
                alert('Το ραντεβού διαγράφηκε επιτυχώς!')
            }
        } catch (error) {
            console.error('Error deleting appointment:', error)
            alert('Σφάλμα κατά τη διαγραφή του ραντεβού')
        }
    }

    const handleEditService = (service) => {
        setEditingService(service._id)
        setEditFormData({
            name: service.name,
            duration: service.duration,
            price: service.price,
            category: service.category
        })
    }

    const handleCancelEdit = () => {
        setEditingService(null)
        setEditFormData({
            name: '',
            duration: '',
            price: '',
            category: ''
        })
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setEditFormData({
            ...editFormData,
            [name]: value
        })
    }

    const handleSaveService = async (id) => {
        try {
            const response = await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            })

            if (response.ok) {
                const updatedService = await response.json()
                setServices(services.map(s => s._id === id ? updatedService : s))
                setEditingService(null)
                alert('Η υπηρεσία ενημερώθηκε επιτυχώς!')
            }
        } catch (error) {
            console.error('Error updating service:', error)
            alert('Σφάλμα κατά την ενημέρωση της υπηρεσίας')
        }
    }

    // Personnel handlers
    const handleEditPersonnel = (person) => {
        setEditingPersonnel(person._id)
        setPersonnelFormData({
            name: person.name,
            email: person.email,
            photo: person.photo || '',
            isActive: person.isActive,
            daysOff: person.daysOff || [],
            services: person.services || []
        })
    }

    const handleCancelPersonnelEdit = () => {
        setEditingPersonnel(null)
        setShowAddPersonnel(false)
        setPersonnelFormData({
            name: '',
            email: '',
            photo: '',
            isActive: true,
            daysOff: [],
            services: []
        })
    }

    const handlePersonnelFormChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            setPersonnelFormData({
                ...personnelFormData,
                [name]: checked
            })
        } else {
            setPersonnelFormData({
                ...personnelFormData,
                [name]: value
            })
        }
    }

    const handleServiceToggle = (service) => {
        const currentServices = personnelFormData.services
        const index = currentServices.indexOf(service)

        if (index > -1) {
            setPersonnelFormData({
                ...personnelFormData,
                services: currentServices.filter(s => s !== service)
            })
        } else {
            setPersonnelFormData({
                ...personnelFormData,
                services: [...currentServices, service]
            })
        }
    }

    const handleDayOffToggle = (day) => {
        const currentDaysOff = personnelFormData.daysOff
        const index = currentDaysOff.indexOf(day)

        if (index > -1) {
            setPersonnelFormData({
                ...personnelFormData,
                daysOff: currentDaysOff.filter(d => d !== day)
            })
        } else {
            setPersonnelFormData({
                ...personnelFormData,
                daysOff: [...currentDaysOff, day]
            })
        }
    }

    const handleSavePersonnel = async (id) => {
        try {
            const response = await fetch(`${API_URL}/personnel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(personnelFormData)
            })

            if (response.ok) {
                const updatedPersonnel = await response.json()
                setPersonnel(personnel.map(p => p._id === id ? updatedPersonnel : p))
                setEditingPersonnel(null)
                alert('Το μέλος προσωπικού ενημερώθηκε επιτυχώς!')
            } else {
                const error = await response.json()
                alert(error.message || 'Σφάλμα κατά την ενημέρωση')
            }
        } catch (error) {
            console.error('Error updating personnel:', error)
            alert('Σφάλμα κατά την ενημέρωση του προσωπικού')
        }
    }

    const handleAddPersonnel = async () => {
        try {
            const response = await fetch(`${API_URL}/personnel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(personnelFormData)
            })

            if (response.ok) {
                const newPersonnel = await response.json()
                setPersonnel([...personnel, newPersonnel])
                setShowAddPersonnel(false)
                setPersonnelFormData({
                    name: '',
                    email: '',
                    photo: '',
                    isActive: true,
                    daysOff: [],
                    services: []
                })
                alert('Το μέλος προσωπικού προστέθηκε επιτυχώς!')
            } else {
                const error = await response.json()
                alert(error.message || 'Σφάλμα κατά την προσθήκη')
            }
        } catch (error) {
            console.error('Error adding personnel:', error)
            alert('Σφάλμα κατά την προσθήκη του προσωπικού')
        }
    }

    const handleDeletePersonnel = async (id) => {
        if (!window.confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το μέλος του προσωπικού;')) return

        try {
            const response = await fetch(`${API_URL}/personnel/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setPersonnel(personnel.filter(p => p._id !== id))
                alert('Το μέλος προσωπικού διαγράφηκε επιτυχώς!')
            }
        } catch (error) {
            console.error('Error deleting personnel:', error)
            alert('Σφάλμα κατά τη διαγραφή του προσωπικού')
        }
    }

    const handleDateChange = (direction) => {
        const [day, month, year] = selectedAppointmentDate.split('-')
        const currentDate = new Date(year, month - 1, day)

        if (direction === 'prev') {
            currentDate.setDate(currentDate.getDate() - 1)
        } else {
            currentDate.setDate(currentDate.getDate() + 1)
        }

        const newDay = String(currentDate.getDate()).padStart(2, '0')
        const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
        const newYear = currentDate.getFullYear()
        setSelectedAppointmentDate(`${newDay}-${newMonth}-${newYear}`)
    }

    const formatDisplayDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-')
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString('el-GR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getAppointmentsByBarber = () => {
        const barberAppointments = {}

        personnel.forEach(person => {
            barberAppointments[person.name] = appointments.filter(
                apt => apt.barberName === person.name
            )
        })

        return barberAppointments
    }

    const timeToPosition = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        const totalMinutes = (hours * 60) + minutes
        const startMinutes = 9 * 60 // 9:00
        const endMinutes = 20 * 60 // 20:00
        const workingMinutes = endMinutes - startMinutes

        return ((totalMinutes - startMinutes) / workingMinutes) * 100
    }

    const durationToWidth = (durationHours) => {
        const workingMinutes = (20 - 9) * 60 // 11 hours
        const appointmentMinutes = durationHours * 60
        return (appointmentMinutes / workingMinutes) * 100
    }

    const renderAppointments = () => {
        const hours = []
        for (let i = 9; i <= 20; i++) {
            hours.push(`${String(i).padStart(2, '0')}:00`)
        }

        const barberAppointments = getAppointmentsByBarber()

        return (
            <div className="appointments-section">
                <div className="schedule-header">
                    <h2>Πρόγραμμα Ραντεβού</h2>
                    <div className="date-navigation">
                        <button onClick={() => handleDateChange('prev')}>‹</button>
                        <span className="selected-date">{formatDisplayDate(selectedAppointmentDate)}</span>
                        <button onClick={() => handleDateChange('next')}>›</button>
                    </div>
                </div>

                {loading ? (
                    <p>Φόρτωση...</p>
                ) : (
                    <div className="schedule-view">
                        {/* Timeline header */}
                        <div className="timeline-header">
                            <div className="barber-label-column"></div>
                            <div className="timeline-hours">
                                {hours.map((hour, idx) => (
                                    <div
                                        key={hour}
                                        className="hour-marker"
                                        style={{ left: `${(100 / (hours.length - 1)) * idx}%` }}
                                    >
                                        {hour}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Barber rows */}
                        {personnel.filter(p => p.isActive).map(barber => (
                            <div key={barber._id} className="barber-row">
                                <div className="barber-label">
                                    {barber.photo && (
                                        <img src={barber.photo} alt={barber.name} className="barber-avatar" />
                                    )}
                                    <span>{barber.name}</span>
                                </div>
                                <div className="timeline-track">
                                    {/* Hour grid lines */}
                                    {hours.map((hour, idx) => (
                                        <div
                                            key={idx}
                                            className="hour-line"
                                            style={{ left: `${(100 / (hours.length - 1)) * idx}%` }}
                                        ></div>
                                    ))}

                                    {/* Appointments */}
                                    {barberAppointments[barber.name]?.map(apt => (
                                        <div
                                            key={apt._id}
                                            className="appointment-block"
                                            style={{
                                                left: `${timeToPosition(apt.time)}%`,
                                                width: `${durationToWidth(apt.duration / 60)}%`
                                            }}
                                        >
                                            <div className="appointment-content">
                                                <strong>{apt.time}</strong>
                                                <span className="apt-service">{apt.service}</span>
                                                <span className="apt-customer">{apt.userName}</span>
                                                <button
                                                    className="apt-delete-btn"
                                                    onClick={() => deleteAppointment(apt._id)}
                                                    title="Διαγραφή"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {personnel.filter(p => p.isActive).length === 0 && (
                            <p className="no-personnel">Δεν υπάρχει ενεργό προσωπικό</p>
                        )}
                    </div>
                )}
            </div>
        )
    }

    const handleAddService = async () => {
        try {
            const response = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            })

            if (response.ok) {
                const newService = await response.json()
                setServices([...services, newService])
                setShowAddService(false)
                setEditFormData({
                    name: '',
                    duration: '',
                    price: '',
                    category: ''
                })
                alert('Η υπηρεσία προστέθηκε επιτυχώς!')
            } else {
                const error = await response.json()
                alert(error.message || 'Σφάλμα κατά την προσθήκη')
            }
        } catch (error) {
            console.error('Error adding service:', error)
            alert('Σφάλμα κατά την προσθήκη της υπηρεσίας')
        }
    }

    const handleDeleteService = async (id) => {
        if (!window.confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτή την υπηρεσία;')) return

        try {
            const response = await fetch(`${API_URL}/services/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                setServices(services.filter(s => s._id !== id))
                alert('Η υπηρεσία διαγράφηκε επιτυχώς!')
            }
        } catch (error) {
            console.error('Error deleting service:', error)
            alert('Σφάλμα κατά τη διαγραφή της υπηρεσίας')
        }
    }

    const renderServices = () => (
        <div className="services-section">
            <div className="section-header">
                <h2>Υπηρεσίες</h2>
                <button
                    className="add-btn"
                    onClick={() => setShowAddService(true)}
                >
                    + Προσθήκη Υπηρεσίας
                </button>
            </div>

            {showAddService && (
                <div className="add-service-form">
                    <h3>Νέα Υπηρεσία</h3>
                    <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleFormChange}
                        placeholder="Όνομα υπηρεσίας"
                        className="edit-input"
                    />
                    <input
                        type="number"
                        name="duration"
                        step="0.5"
                        value={editFormData.duration}
                        onChange={handleFormChange}
                        placeholder="Διάρκεια (ώρες)"
                        className="edit-input"
                    />
                    <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleFormChange}
                        placeholder="Τιμή (€)"
                        className="edit-input"
                    />
                    <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleFormChange}
                        className="edit-input"
                    >
                        <option value="">Επιλέξτε κατηγορία</option>
                        <option value="Haircuts">Haircuts</option>
                        <option value="Color & Dye">Color & Dye</option>
                        <option value="Treatments">Treatments</option>
                        <option value="Styling">Styling</option>
                        <option value="Men's Services">Men's Services</option>
                    </select>
                    <div className="edit-buttons">
                        <button className="save-btn" onClick={handleAddService}>
                            Προσθήκη
                        </button>
                        <button className="cancel-btn" onClick={() => {
                            setShowAddService(false)
                            setEditFormData({ name: '', duration: '', price: '', category: '' })
                        }}>
                            Ακύρωση
                        </button>
                    </div>
                </div>
            )}

            <div className="services-grid">
                {services.map(service => (
                    <div key={service._id} className="service-card">
                        {editingService === service._id ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleFormChange}
                                    className="edit-input"
                                    placeholder="Όνομα"
                                />
                                <input
                                    type="number"
                                    name="duration"
                                    step="0.5"
                                    value={editFormData.duration}
                                    onChange={handleFormChange}
                                    className="edit-input"
                                    placeholder="Διάρκεια (λεπτά)"
                                />
                                <input
                                    type="number"
                                    name="price"
                                    value={editFormData.price}
                                    onChange={handleFormChange}
                                    className="edit-input"
                                    placeholder="Τιμή (€)"
                                />
                                <select
                                    name="category"
                                    value={editFormData.category}
                                    onChange={handleFormChange}
                                    className="edit-input"
                                >
                                    <option value="">Επιλέξτε κατηγορία</option>
                                    <option value="HAIRCUTS">HAIRCUTS</option>
                                    <option value="COLOR & DYE">COLOR & DYE</option>
                                    <option value="TREATMENTS">TREATMENTS</option>
                                    <option value="STYLING">STYLING</option>
                                    <option value="MEN'S SERVICES">MEN'S SERVICES</option>
                                </select>
                                <div className="edit-buttons">
                                    <button
                                        className="save-btn"
                                        onClick={() => handleSaveService(service._id)}
                                    >
                                        Αποθήκευση
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancelEdit}
                                    >
                                        Ακύρωση
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>{service.name}</h3>
                                <p>Κατηγορία: {service.category}</p>
                                <p>Διάρκεια: {service.duration} ώρες</p>
                                <p>Τιμή: €{service.price}</p>
                                <div className="card-buttons">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditService(service)}
                                    >
                                        Επεξεργασία
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteService(service._id)}
                                    >
                                        Διαγραφή
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

        </div>
    )

    const renderPersonnel = () => {
        const weekDayLabels = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ']
        const monthNames = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος']

        // Get unique categories from services
        const uniqueCategories = [...new Set(services.map(s => s.category))].filter(Boolean)

        const generateCalendarDays = () => {
            const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
            const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
            const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

            const days = []
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            for (let i = 0; i < adjustedFirstDay; i++) {
                days.push(<div key={`empty-${i}`} className="cal-day empty"></div>)
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                currentDate.setHours(0, 0, 0, 0)

                const dayFormatted = String(day).padStart(2, '0')
                const monthFormatted = String(calendarMonth.getMonth() + 1).padStart(2, '0')
                const yearFormatted = calendarMonth.getFullYear()
                const formattedDate = `${dayFormatted}-${monthFormatted}-${yearFormatted}`

                const isSelected = personnelFormData.daysOff.includes(formattedDate)

                days.push(
                    <div
                        key={day}
                        className={`cal-day ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDayOffToggle(formattedDate)}
                    >
                        {day}
                    </div>
                )
            }

            return days
        }

        return (
            <div className="personnel-section">
                <div className="section-header">
                    <h2>Προσωπικό</h2>
                    <button
                        className="add-btn"
                        onClick={() => setShowAddPersonnel(true)}
                    >
                        + Προσθήκη Προσωπικού
                    </button>
                </div>

                {showAddPersonnel && (
                    <div className="add-personnel-form">
                        <h3>Νέο Μέλος Προσωπικού</h3>
                        <input
                            type="text"
                            name="name"
                            value={personnelFormData.name}
                            onChange={handlePersonnelFormChange}
                            placeholder="Όνομα"
                            className="edit-input"
                        />
                        <input
                            type="email"
                            name="email"
                            value={personnelFormData.email}
                            onChange={handlePersonnelFormChange}
                            placeholder="Email"
                            className="edit-input"
                        />
                        <input
                            type="text"
                            name="photo"
                            value={personnelFormData.photo}
                            onChange={handlePersonnelFormChange}
                            placeholder="URL Φωτογραφίας"
                            className="edit-input"
                        />

                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={personnelFormData.isActive}
                                    onChange={handlePersonnelFormChange}
                                />
                                Ενεργός
                            </label>
                        </div>

                        <div className="services-selection">
                            <h4>Υπηρεσίες:</h4>
                            {services.length === 0 ? (
                                <p style={{ color: 'rgba(255, 255, 255, 0.7)', padding: '1rem' }}>
                                    Δεν υπάρχουν διαθέσιμες υπηρεσίες. Προσθέστε υπηρεσίες πρώτα.
                                </p>
                            ) : (
                                <div className="services-by-category">
                                    {uniqueCategories.map(category => {
                                        const categoryServices = services.filter(s => s.category === category)

                                        return (
                                            <div key={category} className="category-group">
                                                <h5>{category.toUpperCase()}</h5>
                                                {categoryServices.map(service => (
                                                    <label key={service._id} className="service-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={personnelFormData.services.includes(service.name)}
                                                            onChange={() => handleServiceToggle(service.name)}
                                                        />
                                                        {service.name}
                                                    </label>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="days-off-selection">
                            <h4>Ημέρες Αδείας:</h4>
                            <div className="personnel-calendar">
                                <div className="cal-month-picker">
                                    <button type="button" onClick={() => setCalendarMonth(prev => {
                                        const newDate = new Date(prev)
                                        newDate.setMonth(prev.getMonth() - 1)
                                        return newDate
                                    })}>{"<"}</button>
                                    <h5>{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</h5>
                                    <button type="button" onClick={() => setCalendarMonth(prev => {
                                        const newDate = new Date(prev)
                                        newDate.setMonth(prev.getMonth() + 1)
                                        return newDate
                                    })}>{">"}</button>
                                </div>
                                <div className="cal-week-days">
                                    {weekDayLabels.map((day, idx) => (
                                        <p key={idx}>{day}</p>
                                    ))}
                                </div>
                                <div className="cal-days-grid">
                                    {generateCalendarDays()}
                                </div>
                                {personnelFormData.daysOff.length > 0 && (
                                    <div className="selected-dates-list">
                                        <small>Επιλεγμένες ημέρες: {personnelFormData.daysOff.length}</small>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="edit-buttons">
                            <button className="save-btn" onClick={handleAddPersonnel}>
                                Προσθήκη
                            </button>
                            <button className="cancel-btn" onClick={handleCancelPersonnelEdit}>
                                Ακύρωση
                            </button>
                        </div>
                    </div>
                )}

                <div className="personnel-grid">
                    {personnel.map(person => (
                        <div key={person._id} className="personnel-card">
                            {editingPersonnel === person._id ? (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        value={personnelFormData.name}
                                        onChange={handlePersonnelFormChange}
                                        placeholder="Όνομα"
                                        className="edit-input"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={personnelFormData.email}
                                        onChange={handlePersonnelFormChange}
                                        placeholder="Email"
                                        className="edit-input"
                                    />
                                    <input
                                        type="text"
                                        name="photo"
                                        value={personnelFormData.photo}
                                        onChange={handlePersonnelFormChange}
                                        placeholder="URL Φωτογραφίας"
                                        className="edit-input"
                                    />

                                    <div className="checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={personnelFormData.isActive}
                                                onChange={handlePersonnelFormChange}
                                            />
                                            Ενεργός
                                        </label>
                                    </div>

                                    <div className="services-selection">
                                        <h4>Υπηρεσίες:</h4>
                                        {services.length === 0 ? (
                                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', padding: '1rem' }}>
                                                Δεν υπάρχουν διαθέσιμες υπηρεσίες. Προσθέστε υπηρεσίες πρώτα.
                                            </p>
                                        ) : (
                                            <div className="services-by-category">
                                                {uniqueCategories.map(category => {
                                                    const categoryServices = services.filter(s => s.category === category)

                                                    return (
                                                        <div key={category} className="category-group">
                                                            <h5>{category.toUpperCase()}</h5>
                                                            {categoryServices.map(service => (
                                                                <label key={service._id} className="service-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={personnelFormData.services.includes(service.name)}
                                                                        onChange={() => handleServiceToggle(service.name)}
                                                                    />
                                                                    {service.name}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="days-off-selection">
                                        <h4>Ημέρες Αδείας:</h4>
                                        <div className="personnel-calendar">
                                            <div className="cal-month-picker">
                                                <button type="button" onClick={() => setCalendarMonth(prev => {
                                                    const newDate = new Date(prev)
                                                    newDate.setMonth(prev.getMonth() - 1)
                                                    return newDate
                                                })}>{"<"}</button>
                                                <h5>{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</h5>
                                                <button type="button" onClick={() => setCalendarMonth(prev => {
                                                    const newDate = new Date(prev)
                                                    newDate.setMonth(prev.getMonth() + 1)
                                                    return newDate
                                                })}>{">"}</button>
                                            </div>
                                            <div className="cal-week-days">
                                                {weekDayLabels.map((day, idx) => (
                                                    <p key={idx}>{day}</p>
                                                ))}
                                            </div>
                                            <div className="cal-days-grid">
                                                {generateCalendarDays()}
                                            </div>
                                            {personnelFormData.daysOff.length > 0 && (
                                                <div className="selected-dates-list">
                                                    <small>Επιλεγμένες ημέρες: {personnelFormData.daysOff.length}</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="edit-buttons">
                                        <button
                                            className="save-btn"
                                            onClick={() => handleSavePersonnel(person._id)}
                                        >
                                            Αποθήκευση
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            onClick={handleCancelPersonnelEdit}
                                        >
                                            Ακύρωση
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {person.photo && (
                                        <div className="personnel-photo">
                                            <img src={person.photo} alt={person.name} />
                                        </div>
                                    )}
                                    <h3>{person.name}</h3>
                                    <p><strong>Email:</strong> {person.email}</p>
                                    <p><strong>Κατάσταση:</strong> {person.isActive ? '✅ Ενεργός' : '❌ Ανενεργός'}</p>
                                    <div className="personnel-info">
                                        <strong>Υπηρεσίες:</strong>
                                        {person.services && person.services.length > 0 ? (
                                            <ul>
                                                {person.services.map((service, idx) => (
                                                    <li key={idx}>{service}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Καμία υπηρεσία</p>
                                        )}
                                    </div>
                                    <div className="personnel-info">
                                        <strong>Ημέρες Αδείας:</strong>
                                        {person.daysOff && person.daysOff.length > 0 ? (
                                            <div className="days-off-badges">
                                                {person.daysOff.slice(0, 5).map((date, idx) => (
                                                    <span key={idx} className="date-badge">{date}</span>
                                                ))}
                                                {person.daysOff.length > 5 && (
                                                    <span className="date-badge more">+{person.daysOff.length - 5}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <p>Καμία</p>
                                        )}
                                    </div>
                                    <div className="card-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditPersonnel(person)}
                                        >
                                            Επεξεργασία
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeletePersonnel(person._id)}
                                        >
                                            Διαγραφή
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Διαχείριση Κομμωτηρίου</p>
            </header>

            <div className="admin-nav">
                <button
                    className={activeTab === 'appointments' ? 'active' : ''}
                    onClick={() => setActiveTab('appointments')}
                >
                    Ραντεβού
                </button>
                <button
                    className={activeTab === 'services' ? 'active' : ''}
                    onClick={() => setActiveTab('services')}
                >
                    Υπηρεσίες
                </button>
                <button
                    className={activeTab === 'personnel' ? 'active' : ''}
                    onClick={() => setActiveTab('personnel')}
                >
                    Προσωπικό
                </button>
            </div>

            <main className="admin-content">
                {activeTab === 'appointments' && renderAppointments()}
                {activeTab === 'services' && renderServices()}
                {activeTab === 'personnel' && renderPersonnel()}
            </main>
        </div>
    )
}
