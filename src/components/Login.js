import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit (e) {
        e.preventDefault()

        try {
            setError('')
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/', { replace: true })
        } catch(error) {
            setError('Login failed! - ' + error.code)
        }
    }

    return (
        <>
            <h1>Log In</h1>
            {error && <h2 style={{ color: 'red' }}>{error}</h2>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" required ref={emailRef} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" required ref={passwordRef} />
                </div>
                <button type="submit">Log In</button>
            </form>

            <h2>Need an account? <Link to="/signup">Sign Up</Link></h2>
        </>
    )
}
