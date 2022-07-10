import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit (e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('Password do not match')
            return
        }
        
        try {
            setError('')
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate('/login', { replace: true })
        } catch(error) {
            setError('Sign up failed! - ' + error.code)
        }
    }

    return (
        <>
            <h1>Sign Up</h1>
            {error && <h2 style={{ color: 'red' }}>{error}</h2>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" ref={emailRef} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" ref={passwordRef} />
                </div>
                <div>
                    <label>Password Confirmation</label>
                    <input type="password" ref={passwordConfirmRef} />
                </div>
                <button type="submit">Sign Up</button>
            </form>

            <h2>Already have an account? <Link to="/login">Log In</Link></h2>
        </>
    )
}
