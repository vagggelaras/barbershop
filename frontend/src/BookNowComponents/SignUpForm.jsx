import "../styles/SignUpForm.css"
import { useState} from "react"
import API_URL from '../config'

export default function SignUpForm(props){

    const [activeTab, setActiveTab] = useState('signup')
    const [translate, setTranslate] = useState('0%')
    const [formData, setFormData] = useState({
        email:'',
        name:'',
        role:'customer',
        phone:'',
        createdAt:Date.now()
    })

    const determineUnderline = (e, buttonClicked) => {
        e.preventDefault()

        if (buttonClicked === 'signup') {
            setActiveTab('signup')
            setTranslate('0%')
        } else {
            setActiveTab('login')
            setTranslate('167%')
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
// console.log(e)
        if(activeTab === 'signup'){
            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                const data = await response.json()
                console.log('Success:', data)
                setFormData({
                    email: '',
                    name: '',
                    role: 'customer',
                    phone: '',
                    createdAt: Date.now()
                })
            } catch (error) {
                console.log('Error:', error)
            }
            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: formData.email })
                });

                const data = await response.json();

                if (data.success) {
                    sessionStorage.setItem('user', JSON.stringify(data.user))
                    setFormData({ ...formData, email: '' })
                    props.setUserLoggedIn(true)
                } else {
                    console.log('Δεν βρέθηκε χρήστης με αυτό το email')
                }
                console.log(sessionStorage)
            } catch (error) {
                console.log('Σφάλμα: ' + error.message);
            }

        }
        
        if(activeTab === 'login'){
            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: formData.email })
                });

                const data = await response.json();

                if (data.success) {
                    sessionStorage.setItem('user', JSON.stringify(data.user))
                    setFormData({ ...formData, email: '' })
                    props.setUserLoggedIn(true)
                } else {
                    console.log('Δεν βρέθηκε χρήστης με αυτό το email')
                }
                console.log(sessionStorage)
            } catch (error) {
                console.log('Σφάλμα: ' + error.message);
            }
        }
    }

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
      }

    return(
        <form className="signUpForm" onSubmit={handleFormSubmit}>
            <h2>Welcome to zen!</h2>
            <div className="formHeader">
                <button className="signUpButton" onClick={(e) => determineUnderline(e, 'signup')}>Sign Up</button> 
                <button className="logInButton" onClick={(e) => determineUnderline(e,'login')}>Log-in</button>
                <div className="underline" style={{transform:`translateX(${translate})`}}></div>
            </div>
            
            {activeTab === 'signup' && <section className="signUpSection">

                <label htmlFor="email">Email:</label>
                <input type="email" onChange={handleFormChange} id="email" name="email" value={formData.email}></input>
<br></br>
                <label htmlFor="name">Name:</label>
                <input type="text" onChange={handleFormChange} id="name" name="name" value={formData.name}></input>

<br></br>
                <label htmlFor="phone">Phone:</label>
                <input type="text" onChange={handleFormChange} id="phone" name="phone" value={formData.phone}></input>

<br></br>

                <button type="submit">Submit</button>
                  
            </section>}
            
            {activeTab === 'login' && <section className="loginSection">
                <label htmlFor="email">Email:<br></br>
                    <input type="email" onChange={handleFormChange} id="email" name="email" value={formData.email}></input>
                </label>
                
                <button type="submit">Submit</button>
            </section>}

        </form>
    )
}