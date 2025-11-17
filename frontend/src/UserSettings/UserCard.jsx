import './UserCard.css'

export default function UserCard({ name, email, phone }) {
    return (
        <div className="userCardWrapper">
            <div className="lanyardString"></div>
            <div className="userCard">
                <div className="cardClip"></div>
                <div className="cardContent">
                    <div className="cardLogo">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <h3 className="cardName">{name || 'Your Name'}</h3>
                    <div className="cardInfo">
                        <p className="cardEmail">{email || 'email@example.com'}</p>
                        <p className="cardPhone">{phone || '000-000-0000'}</p>
                    </div>
                    <div className="cardBadge">MEMBER</div>
                </div>
            </div>
        </div>
    )
}
