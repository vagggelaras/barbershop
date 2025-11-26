import { useState, useEffect } from "react"
import "./DisplayServices.css"
import API_URL from '../config'

export default function Settings(){

    const [serviceList, setServicesList] = useState()
console.log(serviceList)
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

    return(
        <div className="servicesDisplayContainer">
            <h1>Our <span style={{ color:"#ff6b35"}}>pallete</span> of expertise</h1>
            <br></br><br></br>
            <h2>Plot Twist:<br/>
                Our barbers are better with scissors
                than with HTML tags.
                Give us a little more time!</h2>

            {/* <div className="displayContainer">
                {serviceList && serviceList.map(service => {
                    return <div key={service._id} className="displayServiceCard"> {service.name}</div>
                })}
            </div> */}
        </div>
    )
}