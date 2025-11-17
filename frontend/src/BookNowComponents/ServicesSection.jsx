import { useState, useEffect } from "react"
import "../BookNowStyles/ServicesSection.css"
import API_URL from '../config'

export default function ServicesSection(props){

    const [servicesList, setServicesList] = useState([])
    const [touchedCard, setTouchedCard] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('all')

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'Haircuts', name: 'Haircuts' },
        { id: 'Color & Dye', name: 'Color & Dye' },
        { id: 'Treatments', name: 'Treatments' },
        { id: 'Styling', name: 'Styling' },
        { id: 'Men\'s Services', name: 'Men\'s Services' }
    ]

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_URL}/services`)
                const data = await response.json()
                setServicesList(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchServices()
    }, [])

    // Reset touched state on scroll (mobile UX improvement)
    useEffect(() => {
        const handleScroll = () => {
            if (touchedCard !== null) {
                setTouchedCard(null)
            }
        }

        const container = document.querySelector('.servicesContainer')
        if (container) {
            container.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [touchedCard])
// console.log(servicesList)

    const filteredServices = selectedCategory === 'all'
        ? servicesList
        : servicesList.filter(service => service.category === selectedCategory)

    function showServices() {
        return filteredServices.map((service, index) => {
            const isTouched = touchedCard === index
            const imgName = service.name.replace(/ /g, '').replace(/'/g, "")
            // console.log(imgName)
            return (
            <button
                key={service._id || index}
                className={`serviceCard ${isTouched ? 'touched' : ''}`}
                id={index}
                onClick={e => handleCardClick(e, index)}
                value={service.name}
            >
                <div className="serviceImgContainer">
                    <img className="serviceImg serviceImg-default" id={index} value={service.name} src={`./${imgName}Before.jpg`} alt={service.name}></img>
                        <img className="serviceImg serviceImg-hover" id={index} value={service.name} src={`./${imgName}After.jpg`} alt={service.name}></img>
                </div>
                <div className="serviceDesciption">
                    <h3>{service.name}</h3>
                    <h2>{isTouched ? 'Confirm' : 'Select'}</h2>
                </div>

            </button>
        )})
    }

    function handleCardClick(e, index) {
        // Έλεγχος αν είναι mobile (touch device)
        const isMobile = window.matchMedia('(max-width: 1024px)').matches

        if (isMobile) {
            // Αν η κάρτα είναι ήδη touched, επιβεβαιώνουμε την επιλογή
            if (touchedCard === index) {
                selectServiceClicked(e, index)
            } else {
                // Αλλιώς, κάνουμε set το touched state
                setTouchedCard(index)
            }
        } else {
            // Desktop: κατευθείαν επιλογή
            selectServiceClicked(e, index)
        }
    }

    function selectServiceClicked(e, index) {
        const serviceIndex = index !== undefined ? index : e.target.id
        props.setServiceSelected(e.target.value)
        props.setServiceDuration(filteredServices[serviceIndex].duration)
        // Reset touched state
        setTouchedCard(null)
    }

    return(
        <>
            <div className="categoryTabs">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`categoryTab ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(category.id)
                            setTouchedCard(null)
                        }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            <section className="servicesContainer">
                {showServices()}
            </section>

        </>
    )

}