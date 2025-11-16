import "../styles/Recap.css"

export default function Recap(props){
    return(
        <aside className="recapContainer">
                
            <h3>Your selection </h3>

            {props.serviceSelected && (
                <div className="recapItem">
                    <h3 className="recapValue">{props.serviceSelected}</h3>
                </div>
            )}

            {props.barberSelected && (
                <>
                    <p>{">"}</p>
                    <div className="recapItem">
                        <h3 className="recapValue">{props.barberSelected}</h3>
                    </div>
                </>
            )}

        </aside>
    )
}