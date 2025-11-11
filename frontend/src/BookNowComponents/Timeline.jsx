import '../styles/Timeline.css'
// import moment, { weekdays } from 'moment'
import { useState, useEffect } from 'react'
import API_URL from '../config'

export default function Timeline(props){
    // console.log(props)
    const {weekDay, date, resetDateSelected, reservation, setReservation, selectedService, selectedSlot, setSelectedService, setSelectedSlot} = props

    const [barbers, setBarbers] = useState([])

// console.log(selectedSlot)
// console.log(selectedService)
    const startHour = 9
    let endHour = 20
    let timeSlots = []
// console.log(barbers)
    //get barbers list
    useEffect(() => {
        const fetchClosedDays = async () => {
            try {
                const response = await fetch(`${API_URL}/personnel`)
                const data = await response.json()
                setBarbers(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchClosedDays()
    }, [])

    if(weekDay === 3){ // wensday
        endHour = 14
    }else if(weekDay === 6){ // saturday
        endHour = 16
    }    

    function generateTimeSlots(){
        for (let hour = startHour; hour < endHour; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
            timeSlots.push(`${hour.toString().padStart(2, '0')}:30`)
        }
    }

    const handleTimeSlotClick = (slotId) => {
        // Αν κάνεις κλικ στο ίδιο slot, το κλείνεις
        if (selectedSlot === slotId) {
            setSelectedSlot(null)
        } else {
            // Αλλιώς ανοίγεις το νέο slot
            props.setSelectedSlot(slotId)
        }
    }

    generateTimeSlots()

    const handleServiceSelect = (e) => {
        const value = e.target.value
        setSelectedService(value)
    }

    const sendToConfirmation = () => {
        // console.log(selectedSlot)
        // console.log(selectedService)
        setReservation(true)
    }

    return (
        <>
            <section className='timelineHeader'>
                <button className='resetSelectedDay' onClick={() => resetDateSelected()}>{'<'}</button>
                <h1>{date}</h1>
                <button className='fillerButton'></button>
            </section>

            <section className='timelineMain'>
                {barbers.map((barber, index) => {
                    return (
                        <section key={index} className='barberContainer'>
                        
                            <div className='barberInfo'>
                                <h2>{barber.name}</h2>
                                <img className='barberPhoto' src={barber.photo || './profile.png'}/>
                            </div>

                            <div className='barberSchedule'>
                                {timeSlots.map( x => {
                                    const slotId = barber.name + '-' + x
                                    return (
                                        <section key={slotId} className={selectedSlot === slotId ? 'appointmentSlot activeTimeSlot' : 'appointmentSlot' }>
                                            <button 
                                                id={slotId} 
                                                className='appointmentSlot-time'
                                                onClick={() => handleTimeSlotClick(slotId)}
                                            >
                                                {x}
                                            </button>

                                            {selectedSlot === slotId 
                                            && 
                                            <select className='appointmentSlot-selectService' onChange={handleServiceSelect}>
                                                <option value="">Service:</option>
                                                {barber.services.map(serviceName => {
                                                    return (
                                                        <option value={serviceName}>
                                                            {serviceName}
                                                        </option>
                                                    )
                                                })}
                                            </select>}
                                        </section>
                                    )
                                })}
                            </div>
                        
                        </section>
                    )
                })}
            </section>

            {selectedSlot && selectedService && <button className='continueToConfirm' onClick={sendToConfirmation}>Procceed to confirmation</button>}
        </>
    )
}