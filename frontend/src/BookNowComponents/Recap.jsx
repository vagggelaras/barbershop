import "../styles/Recap.css"

export default function Recap(props){
    return(
        <aside>

            <p>{props.serviceSelected}</p>
            <p>{props.barberSelected}</p>

        </aside>
    )
}