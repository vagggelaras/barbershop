import { useState, useEffect } from "react"
import "../styles/ServicesSection.css"
import API_URL from '../config'

export default function ServicesSection(props){

    const [servicesList, setServicesList] = useState([])

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
// console.log(servicesList)

    function showServices() {
        return servicesList.map((service, index) => {
            return (
            <button key={index} className="serviceCard" id={index} onClick={e => selectServiceClicked(e)} value={service.name}>
                <div className="serviceImgContainer">
                    <img className="serviceImg serviceImg-default" id={index} value={service.name} src="./balayageBefore.jpg" alt={service.name}></img>
                    <img className="serviceImg serviceImg-hover" id={index} value={service.name} src="./balayageAfter.jpg" alt={service.name}></img>
                </div>
                <div className="serviceDesciption">
                    <h3>{service.name}</h3>
                    <h2>Select</h2>
                </div>

            </button>
        )})
    }

    function selectServiceClicked(e){
        // console.log(e.target.id)
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
            <button className="backButton" onClick={() => removeUser()}>Back</button>
            <section className="servicesContainer">
                {showServices()}
            </section>
            
        </>
    )

}