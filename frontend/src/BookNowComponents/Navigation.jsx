import { useState } from "react"
import "../BookNowStyles/Navigation.css"

export default function Navigation(props){

    const {onButtonClick, activeButton, userLoggedIn, logOutUser} = props
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleMenuClick = (number) => {
        onButtonClick(number)
        setMobileMenuOpen(false)
    }

    const handleLogout = () => {
        setMobileMenuOpen(false)
        if (logOutUser) {
            logOutUser()
        }
    }

    return(
        <>
            <nav>
                {/* Hamburger Button - Mobile Only */}
                <button
                    className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <div className="navLogo">
                    <p>ZEN</p> <p className="logoText">Hair and Beauty Spa</p>
                </div>

                {/* Desktop Menu */}
                <div className="navMenu">
                    <button onClick={() => onButtonClick(0)} className={activeButton === 0 ? 'active' : ''}>home</button>
                    <button onClick={() => onButtonClick(1)} className={activeButton === 1 ? 'active' : ''}>book now</button>
                    <button onClick={() => onButtonClick(2)} className={activeButton === 2 ? 'active' : ''}>services</button>
                    <button onClick={() => onButtonClick(3)} className={`recommendationsBtn ${activeButton === 3 ? 'active' : ''}`}>recommendations</button>
                </div>

                <div className="empty placeholder"></div>
            
            </nav>

            {/* Backdrop Overlay */}
            {mobileMenuOpen && (
                <div
                    className="menuBackdrop"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Popup */}
            <div className={`mobileMenu ${mobileMenuOpen ? 'open' : ''}`}>
                <button className="exitMobileMenu" onClick={() => setMobileMenuOpen(false)}>{"<"}</button>
                <button onClick={() => handleMenuClick(0)} className={activeButton === 0 ? 'active' : ''}>home</button>
                <button onClick={() => handleMenuClick(1)} className={activeButton === 1 ? 'active' : ''}>book now</button>
                <button onClick={() => handleMenuClick(2)} className={activeButton === 2 ? 'active' : ''}>services</button>
                <button onClick={() => handleMenuClick(3)} className={`recommendationsBtn ${activeButton === 3 ? 'active' : ''}`}>recommendations</button>
            </div>
        </>
    )
}