import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDatabase } from '../../contexts/DatabaseContext'
import { Outlet, Link } from 'react-router-dom'
import Loading from '../Loading'
import AdminController from './AdminController'
import formAuthStyle from '../../stylesModule/FormAuth.module.css'
import adminStyle from './Admin.module.css'

export default function AdminPage() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [controller, setController] = useState(false)
    const { orders, loginWithAdmin, setStatusAdmin } = useDatabase()
    const { currentAdmin, setCurrentAdmin } = useAuth()

    function handleAdminLogin(e) {
        e.preventDefault()
        loginWithAdmin(emailRef.current.value, passwordRef.current.value)
            .then((admin) => {
                setStatusAdmin({ ...admin, status: true });
                setCurrentAdmin({
                    ...admin
                })
            })
            .catch(err => setError(err))
    }

    function handleSignoutAdmin () {
        setStatusAdmin({ ...currentAdmin, status: false })
        setCurrentAdmin(null)
    }

    useEffect(() => {
        if (!orders) {
            setLoading(true)
            return
        }

        setLoading(false)
    }, [orders])

    function handleFocus(e) {
        e.target.parentElement.classList.add(formAuthStyle['focus'])
    }

    function handleBlur(e) {
        if (e.target.value) return
        e.target.parentElement.classList.remove(formAuthStyle['focus'])
    }

    if (loading) return <Loading />

    if (!currentAdmin) {
        return (
            <>
                <div className={formAuthStyle['container']}>
                    <div className={formAuthStyle['wrap']}>
                        <form onSubmit={handleAdminLogin} className={formAuthStyle['form']}>
                            <p className={formAuthStyle['logo']}>
                                <i className="fa-solid fa-a"></i>
                            </p>
                            {error && <p className={formAuthStyle['error']}>{error}</p>}
                            <div className={formAuthStyle['form-group']}>
                                <label>Email</label>
                                <input type="email" required ref={emailRef} onFocus={handleFocus} onBlur={handleBlur} />
                                <span></span>
                            </div>
                            <div className={formAuthStyle['form-group']}>
                                <label>Password</label>
                                <input type="password" required ref={passwordRef} onFocus={handleFocus} onBlur={handleBlur} />
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
                <div className={adminStyle['admin']}>
                    <span><i className="fa-solid fa-user"></i></span>
                    <div className={adminStyle['admin-box']}>
                        <p onClick={handleSignoutAdmin}>Sign out</p>
                    </div>
                </div>
            </div>

            <AdminController controller={controller} />

            <Outlet />
        </>
    )
}
