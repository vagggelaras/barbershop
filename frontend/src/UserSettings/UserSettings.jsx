import { useState } from 'react'
import Lanyard from './Lanyard'
import "./UserSettings.css"

export default function UserSettings(props){
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}')

    const [name, setName] = useState(storedUser.name || '')
    const [email, setEmail] = useState(storedUser.email || '')
    const [phone, setPhone] = useState(storedUser.phone || '')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const handleSave = async () => {
        setSaving(true)
        setMessage('')

        try {
            const response = await fetch(`https://barbershop-backend-4vuu.onrender.com/users/${storedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            })

            if (response.ok) {
                const updatedUser = await response.json()
                sessionStorage.setItem('user', JSON.stringify(updatedUser))
                setMessage('Settings saved successfully!')
            } else {
                setMessage('Failed to save settings')
            }
        } catch (error) {
            setMessage('Error saving settings')
        }

        setSaving(false)
    }

    return(
        <>
            <div className="settingsContainer">

                <div className="userInfoContainer">
                    <h2>User Settings</h2>

                    <div className="userInfoItem">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="userInfoItem">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="userInfoItem">
                        <label>Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <button
                        className="saveButton"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    {message && <p className="saveMessage">{message}</p>}
                </div>

                <div className="userCardContainer">
                    <Lanyard
                        position={[0, 0, 20]}
                        gravity={[0, -40, 0]}
                        userName={name}
                        userEmail={email}
                        userPhone={phone}
                    />
                </div>

            </div>
        </>
    )
}