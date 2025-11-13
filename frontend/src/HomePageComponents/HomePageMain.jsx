import './HomePagestyles/HomePageMain.css'
import TextType from './TextType'
import Scissors3D from './Scissors3D'

export default function HomePageMain(props){
    return(
        <div className="homePageContainer">
            <div className='textContainer'>
                <TextType
                    text={["Welcome to ZEN Hair & Beauty Spa", "Your Perfect Look Awaits", "Book Your Appointment Today"]}
                    as="p"
                    typingSpeed={90}
                    deletingSpeed={50}
                    pauseDuration={2000}
                    loop={true}
                    showCursor={true}
                    className="homepage-text"
                />
                <button onClick={() => props.setActiveButton(1)}>Book Now</button>
            </div>

            <Scissors3D />
        </div>
    )
}