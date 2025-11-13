import { useState, useEffect } from "react"
import API_URL from '../config'
import "../styles/BarberSection.css"

export default function BarbersSection(props){
console.log(props.serviceSelected)
    const [personnelList, setPersonnelList] = useState([])
console.log(personnelList)
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

    function showPersonnel(){
        const colors = ['#606D75', '#C05252', '#556B2F', '#483D8B', '#B8860B', '#43351B'];

        return personnelList.map((employe, index) => {
            return employe.services.includes(props.serviceSelected) ?

            <button key={index} value={employe.name} onClick={e => selectBarberClicked(e)} className="barberCard">
                <div className="employeBackground" style={{ backgroundColor: colors[index % colors.length] }}></div>
                <img className="employePhoto" src={employe.photo} alt={`${employe.name} - barber photo`} />
                <h2 className="employeName">{employe.name}</h2>
            </button>

            : null
        })
    }

    function selectBarberClicked(e){
        props.setBarberSelected(e.target.value)
    }

    return(
        <section className="personnelContainer">
            <button className="backButton" onClick={() => props.setServiceSelected()}>Back</button>
            {showPersonnel()}
        </section>
    )
}