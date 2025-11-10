import { useState, useEffect } from "react"

export default function MonthDaySelection(props) {

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [closedDaysList, setClosedDaysList] = useState([])
    const [bookedTimeSlots, setBookedTimeSlots] = useState([])

    // Helper function για να βρει την επόμενη ανοιχτή ημέρα
    const getNextOpenDay = (date) => {
        let newDate = new Date(date)
        // Skip Sunday (0) και Monday (1)
        while (newDate.getDay() === 0 || newDate.getDay() === 1) {
            newDate.setDate(newDate.getDate() + 1)
        }
        return newDate
    }

    const [d, setD] = useState(() => getNextOpenDay(new Date()))
    const monthName = month[d.getMonth()]
    const startHour = 9
    let endHour = 20
    const availableTimeSlots = []
    const [timeSelected_, setTimeSelected_] = useState()

    //set end less than 20 if wensday or saturday
    if (d.getDay() === 3) {
        endHour = 14
    } else if (d.getDay() === 6) {
        endHour = 16
    }

    //populate timeslots
    for (let i = startHour; i < endHour; i += 0.5) {
        availableTimeSlots.push(i)
    }

    // Φιλτράρισμα για διαθέσιμα slots
    const freeTimeSlots = availableTimeSlots.filter(slot => !bookedTimeSlots.includes(slot))

    // Μετατροπή αριθμού σε string format (10 -> "10:00", 10.5 -> "10:30")
    function formatTimeSlot(slot) {
        const hour = Math.floor(slot)
        const minutes = (slot % 1) === 0.5 ? '30' : '00'
        return `${String(hour).padStart(2, '0')}:${minutes}`
    }

    useEffect(() => {
        const fetchClosedDays = async () => {
            try {
                const response = await fetch('http://localhost:5000/closedDays')
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
                const url = `http://localhost:5000/appointments/${props.barberSelected}/${formattedDate}`
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
        setD(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() - 1)
            return newDate
        })
    }

    function handleNextMonth() {
        setD(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + 1)
            return newDate
        })
    }

    function handlePreviousDay() {
        setD(prev => {
            let newDate = new Date(prev)
            do {
                newDate.setDate(newDate.getDate() - 1)
            } while (isClosedDay(newDate))

            return newDate
        })
    }

    function handleNextDay() {
        setD(prev => {
            let newDate = new Date(prev)
            do {
                newDate.setDate(newDate.getDate() + 1)
            } while (isClosedDay(newDate))

            return newDate
        })
    }

    function handleContinue() {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        const formattedDate = `${day}-${month}-${year}`
        props.setDateSelected(formattedDate)
    }

    function showWeekDay(date) {
        // Set the weekDay name
        props.weekDay.current = weekDay[date.getDay()]

        // Return the day name and date
        return `${weekDay[date.getDay()]} ${d.getDate()}`
    }

    function handleTimeSlotClick(slot) {
        setTimeSelected_(formatTimeSlot(slot))
        props.setTimeSelected(formatTimeSlot(slot))
    }

    function goBack(){
        props.setBarberSelected()
        props.setTimeSelected()
    }

    return (
        <>
        <button onClick={() => goBack()}>Back</button>
            <h2>{monthName} {d.getFullYear()}</h2>
            <button onClick={handlePreviousMonth}>-</button>
            <button onClick={handleNextMonth}>+</button>

            <h2>{showWeekDay(d)}</h2>
            <button onClick={handlePreviousDay}>-</button>
            <button onClick={handleNextDay}>+</button>

            <div>
                <h3>Available Times:</h3>
                {freeTimeSlots.map(slot => (
                    <button key={slot} onClick={() => handleTimeSlotClick(slot)}>
                        {formatTimeSlot(slot)}
                    </button>
                ))}
            </div>

            <hr style={{margin:"10px"}}></hr>
            {timeSelected_ ? <button onClick={handleContinue}>Continue</button> : null}
        </>
    )
}