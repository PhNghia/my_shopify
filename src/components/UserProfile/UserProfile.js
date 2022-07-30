import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useReducerContext } from '../../contexts/ReducerContext'
import style from './UserProfile.module.css'

export default function UserProfile() {

    const { currentUser, signout } = useAuth()
    const [state, dispatch] = useReducerContext()
    const [name, setName] = useState()

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.displayName)
            return
        }
        setName(null)
    }, [currentUser])

    function handleToggleAccording(e) {
        let parentElement = e.target.parentElement
        while (parentElement) {
            if (parentElement.matches(`.${style['prevSibling-according']}`)) break
            parentElement = parentElement.parentElement
        }
        const according = parentElement.nextElementSibling
        according.classList.toggle(style['show'])
        if (according.matches(`.${style['show']}`)) {
            according.style.height = according.scrollHeight + 'px'
        } else {
            according.style.height = 0
        }
    }

    if (!currentUser) return (
        <>
            <h2>Vui lòng đăng nhập tài khoản. <Link to="/login">Log In</Link></h2>
        </>
    )

    return (
        <>
            <div className={style['navbar']}>
                <Link to={state.pathOfLocation ? state.pathOfLocation : '/'}><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Tôi</h3>
            </div>

            <div className={style['container']}>
                <div className={style['contain-img']}>
                    {currentUser.photoURL && <img src={currentUser.photoURL} />}
                    {currentUser.photoURL || <div className={style['img-name']}>{name ? name[0] : currentUser.email[0]}</div>}
                    <Link to="/" className={style['btn-signout']} onClick={signout}>Sign Out</Link>
                </div>

                <div className={style['user']}>
                    <div>
                        <div className={`${style['name']} ${style['prevSibling-according']}`}>
                            <p>Tên: <span>{name || '-----'}</span></p>
                            <button onClick={handleToggleAccording} className={style['btn-edit']}>Edit <i className="fa-solid fa-pen"></i></button>
                        </div>
                        <div className={style['according']}>
                            <FormDisplayName setName={setName}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function FormDisplayName({ setName }) {

    const { currentUser, login, updateUser } = useAuth()
    const passwordRef = useRef()
    const newNameRef = useRef()

    async function handleUpdateNewName (e) {
        e.preventDefault()
        try {
            await login(currentUser.email, passwordRef.current.value)
            passwordRef.current.style.borderColor = '#333'
            e.target.parentElement.classList.toggle(style['show'])
            e.target.parentElement.style.height = 0
            updateUser(currentUser, {
                displayName: newNameRef.current.value
            })
            setName(newNameRef.current.value)
        } catch (error) {
            passwordRef.current.style.borderColor = 'red'
        }
    }

    return (
        <form className={style['form']} onSubmit={handleUpdateNewName}>
            <div>
                <label>Mật khẩu</label>
                <input type="password" required ref={passwordRef} />
            </div>
            <div>
                <label>Tên mới</label>
                <input type="text" required ref={newNameRef} />
            </div>
            <button className={style['btn-submit']}>Xác nhận</button>
        </form>
    )
}
