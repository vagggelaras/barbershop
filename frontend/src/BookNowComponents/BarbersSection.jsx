import { useState, useEffect } from "react"
import API_URL from '../config'
import "../BookNowStyles/BarberSection.css"

export default function BarbersSection(props){
// console.log(props.serviceSelected)
    const [personnelList, setPersonnelList] = useState([])
    const [touchedCard, setTouchedCard] = useState(null)
// console.log(personnelList)
    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const response = await fetch(`${API_URL}/personnel`)
                const data = await response.json()
                setPersonnelList(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchPersonnel()
    }, [])

    // Reset touched state on scroll (mobile UX improvement)
    useEffect(() => {
        const handleScroll = () => {
            if (touchedCard !== null) {
                setTouchedCard(null)
            }
        }

        const container = document.querySelector('.personnelContainer')
        if (container) {
            container.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [touchedCard])

    function showPersonnel(){
        const colors = ['#606D75', '#C05252', '#556B2F', '#483D8B', '#B8860B', '#43351B'];

        return personnelList.map((employe, index) => {
            const isTouched = touchedCard === index
            return employe.services.includes(props.serviceSelected) ?

            <button
                key={index}
                value={employe.name}
                onClick={e => handleCardClick(e, index)}
                className={`barberCard ${isTouched ? 'touched' : ''}`}
            >
                <div className="employeBackground" style={{ backgroundColor: colors[index % colors.length] }}></div>
                <img className="employePhoto" src={employe.photo} alt={employe.name} />
                <h2 className="employeName">{employe.name}</h2>
                {isTouched && <div className="confirmOverlay">Tap to Confirm</div>}
            </button>

            : null
        })
    }

    function handleCardClick(e, index) {
        // Έλεγχος αν είναι mobile (touch device)
        const isMobile = window.matchMedia('(max-width: 1024px)').matches

        if (isMobile) {
            // Αν η κάρτα είναι ήδη touched, επιβεβαιώνουμε την επιλογή
            if (touchedCard === index) {
                selectBarberClicked(e)
            } else {
                // Αλλιώς, κάνουμε set το touched state
                setTouchedCard(index)
            }
        } else {
            // Desktop: κατευθείαν επιλογή
            selectBarberClicked(e)
        }
    }

    function selectBarberClicked(e){
        props.setBarberSelected(e.target.value)
        // Reset touched state
        setTouchedCard(null)
    }

    return(
        <section className="personnelContainer">
            <button className="backButton" onClick={() => props.setServiceSelected()}>Back</button>
            {showPersonnel()}
        </section>
    )
}