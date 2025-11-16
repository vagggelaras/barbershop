import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import Timeline from "./Timeline"
import Confirmation from "./Confirmation"
import 'react-calendar/dist/Calendar.css'
import "../BookNowStyles/MainCalendar.css"
import API_URL from '../config'

export default function MainCalendar(props){

    const [date, setDate] = useState(new Date())
    const [ClosedDays, setClosedDays] = useState([])
    // const [weekDay, setWeekDay] = useState()
    // console.log(weekDay)
    // const [reservation, setReservation] = useState(false)
    // const [selectedSlot, setSelectedSlot] = useState(null)
    // const [selectedService, setSelectedService] = useState(null)
// console.log(reservation)
    //get closed days from api DD-MM-YY fromat
    useEffect(() => {
        const fetchClosedDays = async () => {
            try {
                const response = await fetch(`${API_URL}/closedDays`)
                const data = await response.json()
                setClosedDays(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchClosedDays();
    }, [])

    //find today
    const tileContent = ({ date, view }) => {
        // Έλεγχος αν είναι η σημερινή μέρα
        const today = new Date();
        if (
            view === 'month' &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            return <p className="today-label">Today</p>
        }
        return null;
    }

    const isDateClosed = (date) => {
        const dayOfWeek = date.getDay()

        // Έλεγχος για Κυριακή ή Δευτέρα
        if (dayOfWeek === 0 || dayOfWeek === 1) {
            return true
        }

        // Έλεγχος στη λίστα ClosedDays
        const isClosed = ClosedDays.some(closed => {
            return closed.date === `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        })

        return isClosed
    }

    //set mondays, syndays and holidays to red color
    const tileClassName = ({ date, view }) => {
        // Ελεγχος αν έχουν έρθει δεδομένα
        if (ClosedDays.length === 0) {
            return null;
        }

        const isClosed = ClosedDays.some(closed => {
            return closed.date === `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
        })

        if(isClosed){
            return "redNumbers"
        }

        if (view === 'month') {
            const dayOfWeek = date.getDay()

            if (dayOfWeek === 0) return 'redNumbers' // Κυριακή
            if (dayOfWeek === 1) return 'redNumbers' // Δευτέρα

            return 'blackNumbers'
        }
        
        return null;
    }

    //show date of clicked button to console
    const showDate = (e) => {
        // Έλεγχος αν η ημέρα είναι κλειστή
        if (isDateClosed(e)) {
            console.log('Η ημέρα είναι κλειστή!')
            return // Δεν κάνουμε τίποτα αν είναι κλειστή
        }

        // Έλεγχος αν η ημερομηνία είναι στο παρελθόν
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Μηδενίζουμε την ώρα για σωστή σύγκριση

        const selectedDate = new Date(e)
        selectedDate.setHours(0, 0, 0, 0)

        if (selectedDate < today) {
            console.log('Δεν μπορείς να επιλέξεις παρελθούσα ημερομηνία!')
            return
        }

        const day = e.getDate()
        const month = e.getMonth() + 1
        const year = e.getFullYear()
        // setWeekDay(e.getDay())
        // console.log(`${day}-${month}-${year}`)
        props.setDateSelected(`${day}-${month}-${year}`)
    }

    return (
        <>
            <Calendar
                onChange={setDate}
                tileContent={tileContent}
                value={date}
                tileClassName={tileClassName}
                onClickDay={showDate}
            />
            {/* <p>Επιλεγμένη ημερομηνία: {date.toLocaleDateString('el-GR')}</p> */}
            
        </>
    )

}