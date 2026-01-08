import { useState, useEffect } from "react"
import API_URL from '../config'
import "../BookNowStyles/MonthDayHourSelection.css"

export default function MonthDaySelection(props) {

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    // const weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",]
    const weekDay = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su",]
    const [closedDaysList, setClosedDaysList] = useState([])
    const [bookedTimeSlots, setBookedTimeSlots] = useState([])

    const [d, setD] = useState(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Αν η σημερινή μέρα είναι κλειστή (Κυριακή=0 ή Δευτέρα=1), βρες την επόμενη ανοιχτή
        let selectedDate = new Date(today)
        while (selectedDate.getDay() === 0 || selectedDate.getDay() === 1) {
            selectedDate.setDate(selectedDate.getDate() + 1)
        }
        return selectedDate
    })
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const monthName = month[currentMonth.getMonth()]
    const startHour = 9
    let endHour = 20
    const availableTimeSlots = []
    const [timeSelected_, setTimeSelected_] = useState()

    //set end less than 20 if wensday or saturday
    if (d && d.getDay() === 3) {
        endHour = 14
    } else if (d && d.getDay() === 6) {
        endHour = 16
    }

    //populate timeslots
    for (let i = startHour; i < endHour; i += 0.5) {
        availableTimeSlots.push(i)
    }

    // Το serviceDuration έρχεται σε ώρες από τη βάση (π.χ. 3 = 3 ώρες)
    const serviceDurationInHours = props.serviceDuration || 0

    // console.log('Service Duration (hours from DB):', props.serviceDuration)
    // console.log('End Hour:', endHour)

    // Φιλτράρισμα για slots που έχουν αρκετό χρόνο μέχρι το κλείσιμο
    const validTimeSlots = availableTimeSlots.filter(slot => {
        // Έλεγχος αν το slot + η διάρκεια της υπηρεσίας είναι πριν το κλείσιμο
        const canFit = (slot + serviceDurationInHours) <= endHour
        // if (slot >= 17) {
        //     console.log(`Slot ${slot}: ${slot} + ${serviceDurationInHours} = ${slot + serviceDurationInHours}, endHour: ${endHour}, canFit: ${canFit}`)
        // }
        return canFit
    })

    // console.log('Valid time slots:', validTimeSlots)

    // Φιλτράρισμα για διαθέσιμα slots (όχι κλεισμένα)
    // Ελέγχουμε αν ΟΛΑ τα slots που χρειάζεται η υπηρεσία είναι ελεύθερα
    const freeTimeSlots = validTimeSlots.filter(slot => {
        // Υπολογισμός πόσα 30λεπτα slots χρειάζεται η υπηρεσία
        const slotsNeeded = serviceDurationInHours / 0.5

        // Έλεγχος αν όλα τα απαιτούμενα slots είναι ελεύθερα
        for (let i = 0; i < slotsNeeded; i++) {
            const requiredSlot = slot + (i * 0.5)
            if (bookedTimeSlots.includes(requiredSlot)) {
                return false // Αν κάποιο slot είναι κρατημένο, δεν εμφανίζουμε αυτό το start time
            }
        }
        return true // Όλα τα slots είναι ελεύθερα
    })

    // Φιλτράρισμα για να μην εμφανίζονται ώρες που έχουν περάσει (μόνο για σήμερα)
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const availableTimeSlots_ = freeTimeSlots.filter(slot => {
        // Αν η επιλεγμένη μέρα είναι σήμερα, φιλτράρουμε ώρες που έχουν περάσει
        if (d && d.getTime() === today.getTime()) {
            const currentHour = now.getHours() + (now.getMinutes() >= 30 ? 0.5 : 0)
            return slot > currentHour
        }
        return true // Για μελλοντικές μέρες, δείχνουμε όλα τα ελεύθερα slots
    })

    // Μετατροπή αριθμού σε string format (10 -> "10:00", 10.5 -> "10:30")
    function formatTimeSlot(slot) {
        const hour = Math.floor(slot)
        const minutes = (slot % 1) === 0.5 ? '30' : '00'
        return `${String(hour).padStart(2, '0')}:${minutes}`
    }

    useEffect(() => {
        const fetchClosedDays = async () => {
            try {
                const response = await fetch(`${API_URL}/closedDays`)
                const data = await response.json()
                setClosedDaysList(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchClosedDays()
    }, [])

    // Fetch appointments κάθε φορά που αλλάζει η ημερομηνία η το προσωπικο
    useEffect(() => {
        const fetchAppointments = async () => {
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const year = d.getFullYear()
            const formattedDate = `${day}-${month}-${year}`

            try {
                const url = `${API_URL}/appointments/${props.barberSelected}/${formattedDate}`
                const response = await fetch(url)
                const data = await response.json()

                // Populate bookedTimeSlots από τα appointments
                if (data.appointments && data.appointments.length > 0) {
                    const booked = []

                    data.appointments.forEach(appointment => {
                        // Μετατροπή time "10:00" σε αριθμό 10 ή "10:30" σε 10.5
                        const [hours, minutes] = appointment.time.split(':')
                        let startTime = parseInt(hours)
                        if (minutes === '30') {
                            startTime += 0.5
                        }

                        // Υπολογισμός πόσα slots καταλαμβάνει (duration σε λεπτά / 30)
                        const slotsNeeded = appointment.duration / 30

                        // Προσθήκη όλων των slots που καταλαμβάνει
                        for (let i = 0; i < slotsNeeded; i++) {
                            booked.push(startTime + (i * 0.5))
                        }
                    })
                    setBookedTimeSlots(booked)
                } else {
                    setBookedTimeSlots([])
                }
            } catch (error) {
                console.error('Error fetching appointments:', error)
            }
        }

        if (props.barberSelected) {
            fetchAppointments()
        }
    }, [d, props.barberSelected])

    function isClosedDay(date) {
        if (date.getDay() === 0 || date.getDay() === 1) {
            return true
        }

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const formattedDate = `${day}-${month}-${year}`

        return closedDaysList.some(closedDay => closedDay.date === formattedDate)
    }

    function handlePreviousMonth() {
        setCurrentMonth(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() - 1)
            return newDate
        })
    }

    function handleNextMonth() {
        setCurrentMonth(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + 1)
            return newDate
        })
    }

    function handleContinue() {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        const formattedDate = `${day}-${month}-${year}`

        // Update weekDay before setting the date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        props.weekDay.current = days[d.getDay()]

        props.setDateSelected(formattedDate)
    }

    function handleTimeSlotClick(slot) {
        setTimeSelected_(formatTimeSlot(slot))
        props.setTimeSelected(formatTimeSlot(slot))
    }

    function goBack(){
        props.setBarberSelected()
        props.setTimeSelected()
    }

    function generateWeekDays(){
        return weekDay.map((day,index) => {
            return(
                <p key={index}>{day}</p>
            )
        })
    }

    function generateDays() {
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

        // Adjust για να ξεκινάει η εβδομάδα από Δευτέρα (0 = Δευτέρα, 6 = Κυριακή)
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

        const days = []

        // Σημερινή ημερομηνία (χωρίς ώρα)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Προσθήκη κενών cells για τις μέρες πριν ξεκινήσει ο μήνας
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
        }

        // Προσθήκη των ημερών του μήνα
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            currentDate.setHours(0, 0, 0, 0)

            const isClosed = isClosedDay(currentDate)
            const isPast = currentDate < today
            const isSelected = d && d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
            const isDisabled = isClosed || isPast

            const handleDayClick = () => {
                if (!isDisabled) {
                    const dayFormatted = String(currentDate.getDate()).padStart(2, '0')
                    const monthFormatted = String(currentDate.getMonth() + 1).padStart(2, '0')
                    const yearFormatted = currentDate.getFullYear()
                    const formattedDate = `${dayFormatted}-${monthFormatted}-${yearFormatted}`
                    // console.log(formattedDate)
                    setD(currentDate)
                }
            }

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isDisabled ? 'closed' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                    onClick={handleDayClick}
                >
                    <span className="day-number">{day}</span>
                    {isSelected && !isDisabled && <span className="available-slots">{availableTimeSlots_.length}</span>}
                </div>
            )
        }

        return days
    }

    const getFormattedSelectedDate = () => {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        return `${day}-${month}-${year}`
    }

    return (
        <div className="malakia" style={{ width: "100%", height: '100%', backgroundColor:"#776262"}}>
        <section className="datePickerContainer">
            <button className="backButton" onClick={() => goBack()}>Back</button>

            <div className="mainContainer">
                <div className="calendar">
                    <div className="monthPicker">
                        <button onClick={handlePreviousMonth}>{"<"}</button>
                        <h2>{monthName} {currentMonth.getFullYear()}</h2>
                        <button onClick={handleNextMonth}>{">"}</button>
                    </div>

                    <div className="weekDays">
                        {generateWeekDays()}
                    </div>

                    <div className="days">
                        {generateDays()}
                    </div>
                </div>
                <div className="timeSlotsSection">
                    <div className="timeSlots">
                        {availableTimeSlots_.map(slot => (
                            <button
                                key={slot}
                                className={`timeSlot ${timeSelected_ === formatTimeSlot(slot) ? 'selected' : ''}`}
                                onClick={() => handleTimeSlotClick(slot)}
                            >
                                {formatTimeSlot(slot)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            

            <div className="footer">
                <button onClick={() => goBack()}>Cancel</button>
                <div>
                    <span>{getFormattedSelectedDate()}</span>
                    <button onClick={handleContinue} disabled={!timeSelected_}>Schedule</button>
                </div>
            </div>
        </section>
        </div>
    )
}