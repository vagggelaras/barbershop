import "../styles/SignUpForm.css"
import { useState} from "react"
import API_URL from '../config'

import * as Components from "./SignUpComponents";

export default function SignUpForm(props){

    const [signIn, toggle] = useState(true);
    const [formData, setFormData] = useState({
        email:'',
        name:'',
        password:'',
        role:'customer',
        phone:'',
        createdAt:Date.now()
    })

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        // Για το phone field, επιτρέπουμε μόνο αριθμούς
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({
                ...formData,
                [name]: numericValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
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

            // Auto login after signup
            const loginResponse = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email })
            });

            const loginData = await loginResponse.json();

            if (loginData.success) {
                sessionStorage.setItem('user', JSON.stringify(loginData.user))
                setFormData({
                    email: '',
                    name: '',
                    password:'',
                    role: 'customer',
                    phone: '',
                    createdAt: Date.now()
                })
                props.setUserLoggedIn(true)
            }
        } catch (error) {
            console.log('Error:', error)
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
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
                setFormData({
                    ...formData,
                    email: '',
                    password: ''
                })
                props.setUserLoggedIn(true)
            } else {
                console.log('Δεν βρέθηκε χρήστης με αυτό το email')
            }
        } catch (error) {
            console.log('Σφάλμα: ' + error.message);
        }
    }

    return(
        <Components.Container>

            <Components.SignUpContainer signingIn={signIn}>
                <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                    />
                    <Components.Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                    <Components.Input
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        pattern="[0-9]*"
                        inputMode="numeric"
                    />
                    <Components.Button type="submit">Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.SignInContainer signingIn={signIn}>
                <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Log in</Components.Title>
                    <Components.Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                    <Components.Button type="submit">Log In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            <Components.OverlayContainer signingIn={signIn}>
                <Components.Overlay signingIn={signIn}>
                    <Components.LeftOverlayPanel signingIn={signIn}>
                        <Components.Title>Lets get you started</Components.Title>
                        <Components.Paragraph>
                            Be part of out awesome team and have the haircut of your dreams
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(true)}>
                            Log In
                        </Components.GhostButton>
                    </Components.LeftOverlayPanel>
                    <Components.RightOverlayPanel signingIn={signIn}>
                        <Components.Title>Hello, There!</Components.Title>
                        <Components.Paragraph>
                            Don't have an account?<br></br>
                            Sign up with us today!
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(false)}>
                            Sign Up
                        </Components.GhostButton>
                    </Components.RightOverlayPanel>
                </Components.Overlay>
            </Components.OverlayContainer>

        </Components.Container>
    )
}
//         <form className="signUpForm" onSubmit={handleFormSubmit}>
//             {/* <h2>Welcome to zen!</h2> */}
//             <div className="formHeader">
//                 <button className="signUpButton" onClick={(e) => determineUnderline(e, 'signup')}>Sign Up</button> 
//                 <button className="logInButton" onClick={(e) => determineUnderline(e,'login')}>Log-in</button>
//                 <div className="underline" style={{transform:`translateX(${translate})`}}></div>
//             </div>
            
//             {activeTab === 'signup' && <section className="signUpSection">

//                 <label htmlFor="email">Email:</label>
//                 <input type="email" onChange={handleFormChange} id="email" name="email" value={formData.email}></input>
// <br></br>
//                 <label htmlFor="name">Name:</label>
//                 <input type="text" onChange={handleFormChange} id="name" name="name" value={formData.name}></input>

// <br></br>
//                 <label htmlFor="phone">Phone:</label>
//                 <input type="text" onChange={handleFormChange} id="phone" name="phone" value={formData.phone}></input>

// <br></br>

//                 <button type="submit">Submit</button>
                  
//             </section>}
            
//             {activeTab === 'login' && <section className="loginSection">
//                 <label htmlFor="email">Email:<br></br>
//                     <input type="email" onChange={handleFormChange} id="email" name="email" value={formData.email}></input>
//                 </label>
                
//                 <button type="submit">Submit</button>
//             </section>}

//         </form>
