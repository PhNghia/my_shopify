import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useReducerContext } from '../contexts/ReducerContext'
import { useNavigate, Link } from 'react-router-dom'
import { database } from '../firebase'
import { set, ref } from 'firebase/database'
import style from '../stylesModule/FormAuth.module.css'

export default function Signup() {

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, signout, updateUser } = useAuth()
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
                email: user.email,
            })
            updateUser(user, {
                displayName: nameRef.current.value ? nameRef.current.value : null
            })
            signout()
            navigate('/login', { replace: true })
        } catch (error) {
            setError('Sign up failed! - ' + error.code)
        }
    }

    function handleFocus(e) {
        e.target.parentElement.classList.add(style['focus'])
    }

    function handleBlur(e) {
        if (e.target.value) return
        e.target.parentElement.classList.remove(style['focus'])
    }

    function setUpElementsFocus(...elements) {
        elements.forEach(element => element.addEventListener('focus', handleFocus))
    }

    function setUpElementsBlur(...elements) {
        elements.forEach(element => element.addEventListener('blur', handleBlur))
    }

    function giveUpElementsFocus(...elements) {
        elements.forEach(element => {
            if (!element) return
            element.removeEventListener('focus', handleFocus)
        })
    }

    function giveUpElementsBlur(...elements) {
        elements.forEach(element => {
            if (!element) return
            element.removeEventListener('blur', handleBlur)
        })
    }

    useEffect(() => {
        setUpElementsFocus(
            nameRef.current,
            emailRef.current,
            passwordRef.current,
            passwordConfirmRef.current,
        )
        setUpElementsBlur(
            nameRef.current,
            emailRef.current,
            passwordRef.current,
            passwordConfirmRef.current,
        )

        return () => {
            giveUpElementsFocus(
                nameRef.current,
                emailRef.current,
                passwordRef.current,
                passwordConfirmRef.current,
            )
            giveUpElementsBlur(
                nameRef.current,
                emailRef.current,
                passwordRef.current,
                passwordConfirmRef.current,
            )
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
                            <label>Full Name</label>
                            <input type="text" ref={nameRef} />
                            <span></span>
                        </div>
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
