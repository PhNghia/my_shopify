import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useReducerContext } from '../contexts/ReducerContext'
import { useNavigate, Link } from 'react-router-dom'
import style from '../stylesModule/FormAuth.module.css'

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [state, dispatch] = useReducerContext()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            await login(emailRef.current.value, passwordRef.current.value)
            navigate(`${state.pathOfLocation ? state.pathOfLocation : '/'}`, { replace: true })
        } catch (error) {
            setError('Login failed! - ' + error.code)
        }
    }

    useEffect(() => {
        function handleFocus(e) {
            e.target.parentElement.classList.add(style['focus'])
        }

        function handleBlur(e) {
            if (e.target.value) return
            e.target.parentElement.classList.remove(style['focus'])
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
    }, [])

    return (
        <>
            <div className={style['navbar']}>
                <Link to={state.pathOfLocation ? state.pathOfLocation : '/'}><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Log In</h3>
            </div>

            <div className={style['container']}>
                <div className={style['wrap']}>
                    <form onSubmit={handleSubmit} className={style['form']}>
                        <p className={style['logo']}>
                            <i className="fa-solid fa-m"></i>
                        </p>
                        {error && <p className={style['error']}>{error}</p>}
                        <div className={style['form-group']}>
                            <label>Email</label>
                            <input type="email" required ref={emailRef} />
                            <span></span>
                        </div>
                        <div className={style['form-group']}>
                            <label>Password</label>
                            <input type="password" required ref={passwordRef} />
                            <span></span>
                        </div>
                        <button className={style['button']} type="submit">Login</button>

                        <p className={style['form-message']}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}
