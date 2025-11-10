import { useState, useEffect } from "react"
import "../styles/ServicesSection.css"

export default function ServicesSection(props){

    const [servicesList, setServicesList] = useState([])

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:5000/services')
                const data = await response.json()
                setServicesList(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchServices()
    }, [])
// console.log(servicesList)

    function showServices() {
        return servicesList.map((service, index) => {
            return <button key={index} id={index} onClick={e => selectServiceClicked(e)} value={service.name}>
                {service.name}
            </button>
        })
    }

    function selectServiceClicked(e){
        // console.log(servicesList[e.target.id].duration)
        props.setServiceSelected(e.target.value)
        props.setServiceDuration(servicesList[e.target.id].duration)
    }

    function removeUser(){
        sessionStorage.clear()
        props.setUserLoggedIn(sessionStorage.length)
    }

    return(
        <>
            <button onClick={() => removeUser()}>Back</button>
            {showServices()}
        </>
    )

}