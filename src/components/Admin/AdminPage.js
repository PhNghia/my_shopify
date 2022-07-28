import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDatabase } from '../../contexts/DatabaseContext'
import AdminController from './AdminController'
import { Routes, Route, Outlet, Link } from 'react-router-dom'
import formAuthStyle from '../../stylesModule/FormAuth.module.css'
import adminStyle from './Admin.module.css'

export default function AdminPage() {

    const emailRef = useRef()
    const passwordRef = useRef()

    const [error, setError] = useState('')
    const [controller, setController] = useState(false)
    const { loginWithAdmin } = useDatabase()
    const { currentAdmin, setCurrentAdmin } = useAuth()

    function handleAdminLogin(e) {
        e.preventDefault()
        loginWithAdmin(emailRef.current.value, passwordRef.current.value)
            .then((resultEmail) => {
                setCurrentAdmin({
                    email: resultEmail
                })
            })
            .catch(err => setError(err))
    }

    useEffect(() => {
        if (currentAdmin) return

        function handleFocus(e) {
            e.target.parentElement.classList.add(formAuthStyle['focus'])
        }

        function handleBlur(e) {
            if (e.target.value) return
            e.target.parentElement.classList.remove(formAuthStyle['focus'])
        }

        emailRef.current.addEventListener('focus', handleFocus)
        emailRef.current.addEventListener('blur', handleBlur)

        passwordRef.current.addEventListener('focus', handleFocus)
        passwordRef.current.addEventListener('blur', handleBlur)

        return () => {
            if (emailRef.current) {
                emailRef.current.removeEventListener('focus', handleFocus)
                emailRef.current.removeEventListener('blur', handleBlur)
            }
            if (passwordRef.current) {
                passwordRef.current.removeEventListener('focus', handleFocus)
                passwordRef.current.removeEventListener('blur', handleBlur)
            }
        }
    }, [emailRef, passwordRef])

    if (!currentAdmin) {
        return (
            <>
                <div className={formAuthStyle['container']}>
                    <div className={formAuthStyle['wrap']}>
                        <form onSubmit={handleAdminLogin} className={formAuthStyle['form']}>
                            <h1>Welcome</h1>
                            <p className={formAuthStyle['logo']}>
                                <i className="fa-solid fa-a"></i>
                            </p>
                            {error && <p className={formAuthStyle['error']}>{error}</p>}
                            <div className={formAuthStyle['form-group']}>
                                <label>Email</label>
                                <input type="email" required ref={emailRef} />
                                <span></span>
                            </div>
                            <div className={formAuthStyle['form-group']}>
                                <label>Password</label>
                                <input type="password" required ref={passwordRef} />
                                <span></span>
                            </div>
                            <button className={formAuthStyle['button']} type="submit">Login</button>

                            <p className={formAuthStyle['form-message']}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                        </form>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={adminStyle['navbar']}>
                <button onClick={() => setController(prev => !prev)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            <AdminController controller={controller} />
            
            <Outlet />
        </>
    )
}
