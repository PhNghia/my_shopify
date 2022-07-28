import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useReducerContext } from '../contexts/ReducerContext'
import { useNavigate, Link } from 'react-router-dom'
import { database } from '../firebase'
import { set, ref } from 'firebase/database'
import style from '../stylesModule/FormAuth.module.css'

export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [state, dispatch] = useReducerContext()
    const navigate = useNavigate()
    
    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('Password does not match')
            return
        }

        try {
            setError('')
            const userCredential = await signup(emailRef.current.value, passwordRef.current.value)
            const user = userCredential.user
            const userRef = ref(database, "users/" + user.uid)
            set(userRef, {
                email: user.email
            })
            navigate('/login', { replace: true })
        } catch (error) {
            setError('Sign up failed! - ' + error.code)
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

        passwordConfirmRef.current.addEventListener('focus', handleFocus)
        passwordConfirmRef.current.addEventListener('blur', handleBlur)

        return () => {
            if (emailRef.current) {
                emailRef.current.removeEventListener('focus', handleFocus)
                emailRef.current.removeEventListener('blur', handleBlur)
            }
            if (passwordRef.current) {
                passwordRef.current.removeEventListener('focus', handleFocus)
                passwordRef.current.removeEventListener('blur', handleBlur)
            }
            if (passwordConfirmRef.current) {
                passwordConfirmRef.current.removeEventListener('focus', handleFocus)
                passwordConfirmRef.current.removeEventListener('blur', handleBlur)
            }
        }
    }, [])

    return (
        <>
            <div className={style['navbar']}>
                <Link to={state.pathOfLocation ? state.pathOfLocation : '/'}><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Sign In</h3>
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
                        <div className={style['form-group']}>
                            <label>Confirmation Password</label>
                            <input type="password" required ref={passwordConfirmRef} />
                            <span></span>
                        </div>
                        <button className={style['button']} type="submit">Sign up</button>

                        <p className={`${style['form-message']} ${style['signup']}`}>Already have an account? <Link to="/login">Log In</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}
