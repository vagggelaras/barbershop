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
                    <button onClick={() => onButtonClick(3)} className={activeButton === 3 ? 'active' : ''}>recommendations</button>
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
                <button onClick={() => handleMenuClick(3)} className={activeButton === 3 ? 'active' : ''}>recommendations</button>

                {/* User Menu - Only show when logged in */}
                {userLoggedIn ? (
                    <>
                        <div className="mobileMenuDivider"></div>
                        <button className="mobileMenuItem withIcon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                            User Settings
                        </button>
                        <button className="mobileMenuItem withIcon" onClick={handleLogout}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            Logout
                        </button>
                    </>
                ) : null}
            </div>
        </>
    )
}