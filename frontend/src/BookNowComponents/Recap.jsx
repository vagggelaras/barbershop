import "../styles/Recap.css"

export default function Recap(props){
    // Calculate weekday from dateSelected (format: DD-MM-YYYY)
    const getWeekDayFromDate = (dateString) => {
        if (!dateString) return ''
        const [day, month, year] = dateString.split('-')
        const date = new Date(year, month - 1, day)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days[date.getDay()]
    }

    const weekDayName = getWeekDayFromDate(props.dateSelected)

    return(
        <aside className="recapContainer">
            <div className="recapHeader">
                <h3>Your Selection</h3>
            </div>

            <div className="recapContent">
                {props.serviceSelected && (
                    <div className="recapItem">
                        <span className="recapLabel">Service</span>
                        <span className="recapValue">{props.serviceSelected}</span>
                    </div>
                )}

                {props.barberSelected && (
                    <div className="recapItem">
                        <span className="recapLabel">Barber</span>
                        <span className="recapValue">{props.barberSelected}</span>
                    </div>
                )}

                {/* {props.dateSelected && (
                    <div className="recapItem">
                        <span className="recapLabel">Date</span>
                        <span className="recapValue">{weekDayName} {props.dateSelected}</span>
                    </div>
                )}

                {props.timeSelected && (
                    <div className="recapItem">
                        <span className="recapLabel">Time</span>
                        <span className="recapValue">{props.timeSelected}</span>
                    </div>
                )} */}
            </div>
        </aside>
    )
}