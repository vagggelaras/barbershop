import "../BookNowStyles/SignUpForm.css"
import { useState } from "react"
import API_URL from '../config'

import * as Components from "./SignUpComponents";

export default function SignUpForm(props){

    const [signIn, toggle] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
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

        // Clear error message when user starts typing
        if (errorMessage) {
            setErrorMessage('')
        }

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
        setErrorMessage('') // Clear any previous errors

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()

            // Check if user already exists
            if (response.status === 409 || data.userExists) {
                setErrorMessage('User with this email already exists. Please login instead.')
                return
            }

            if (!data.success) {
                setErrorMessage('Failed to create account. Please try again.')
                return
            }

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

                // Αν είναι admin, redirect στο admin dashboard
                if (loginData.user.role === 'admin' && props.onAdminLogin) {
                    props.onAdminLogin()
                }
            }
        } catch (error) {
            console.log('Error:', error)
            setErrorMessage('An error occurred. Please try again.')
        }
    }

    const handleLogIn = async (e) => {
        e.preventDefault()
        setErrorMessage('') // Clear any previous errors

        try {
            // Φτιάχνουμε το payload - αν υπάρχει password (για admin), το στέλνουμε
            const loginPayload = { email: formData.email };
            if (formData.password) {
                loginPayload.password = formData.password;
            }

            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginPayload)
            });

            const data = await response.json();
            // console.log(data)

            // Αν είναι admin και δεν έχει δώσει password ακόμα, εμφάνισε το password field
            if(data.user && data.user.role === "admin" && !formData.password){
                setIsAdmin(true)
                return
            }

            // Αν είναι admin και έδωσε λάθος password
            if(isAdmin && !data.success){
                setErrorMessage('Wrong password. Try again.')
                setFormData({
                    ...formData,
                    password: ''
                })
                return
            }

            if (data.success) {
                sessionStorage.setItem('user', JSON.stringify(data.user))
                setFormData({
                    ...formData,
                    email: '',
                    password: ''
                })
                setIsAdmin(false) // Reset το admin state
                props.setUserLoggedIn(true)

                // Αν είναι admin, redirect στο admin dashboard
                if (data.user.role === 'admin' && props.onAdminLogin) {
                    props.onAdminLogin()
                }
            } else {
                // Αν δεν βρέθηκε χρήστης ή άλλο πρόβλημα
                if (response.status === 404) {
                    setErrorMessage('There is no user with this email.')
                } else {
                    setErrorMessage('Σφάλμα κατά τη σύνδεση. Δοκιμάστε ξανά.')
                }
            }
        } catch (error) {
            console.log('Σφάλμα: ' + error.message);
            setErrorMessage('Σφάλμα κατά τη σύνδεση. Δοκιμάστε ξανά.')
        }
    }

    return(
        <Components.Container>

            <Components.SignUpContainer signingIn={signIn}>
                <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Create Account</Components.Title>
                    {errorMessage && (
                        <div style={{
                            color: '#ff4444',
                            fontSize: '14px',
                            marginBottom: '15px',
                            textAlign: 'center',
                            padding: '10px',
                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                            borderRadius: '5px',
                            border: '1px solid rgba(255, 68, 68, 0.3)'
                        }}>
                            {errorMessage}
                            {errorMessage.includes('already exists') && (
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toggle(true)
                                            setErrorMessage('')
                                        }}
                                        style={{
                                            background: 'transparent',
                                            color: '#776262',
                                            border: 'none',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Switch to Login
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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
                <Components.Form onSubmit={handleLogIn}>
                    <Components.Title>Log in</Components.Title>
                    {errorMessage && (
                        <div style={{
                            color: '#ff4444',
                            fontSize: '14px',
                            marginBottom: '15px',
                            textAlign: 'center',
                            padding: '10px',
                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                            borderRadius: '5px',
                            border: '1px solid rgba(255, 68, 68, 0.3)'
                        }}>
                            {errorMessage}
                        </div>
                    )}
                    <Components.Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                    {isAdmin ? <Components.Input
                        type="password"
                        placeholder="Password"
                        name="password"
                        // value={formData.email}
                        onChange={handleFormChange}
                    /> : null}
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
