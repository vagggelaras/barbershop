import { useState, useEffect } from "react"

export default function BarbersSection(props){

    const [personnelList, setPersonnelList] = useState([])
// console.log(personnelList)
    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const response = await fetch('http://localhost:5000/personnel')
                const data = await response.json()
                setPersonnelList(data)
            } catch (error) {
                console.error('Error fetching closed days:', error)
            }
        }
        fetchPersonnel()
    }, [])

    function showPersonnel(){
        return personnelList.map((employe, index) => {
            return <button key={index} value={employe.name} onClick={e => selectBarberClicked(e)}>{employe.name}</button>
        })
    }

    function selectBarberClicked(e){
        props.setBarberSelected(e.target.value)
    }

    return(
        <section className="personnelSection">
            <button onClick={() => props.setServiceSelected()}>Back</button>
            {showPersonnel()}
        </section>
    )
}