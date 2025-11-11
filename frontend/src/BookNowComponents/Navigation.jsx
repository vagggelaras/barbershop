import "../styles/Navigation.css"

export default function Navigation(props){

    const {onButtonClick} = props
    // console.log(props)

    return(
        <nav>
            <div className="navLogo">
                <p>ZEN</p> <span className="logoText">Hair and Beauty Spa</span>
            </div>
            <div className="navMenu">
                <button onClick={() => onButtonClick(0)}>home</button>
                <button onClick={() => onButtonClick(1)}>book now</button>
                <button onClick={() => onButtonClick(2)}>services</button>
            </div>
        </nav>
    )
}