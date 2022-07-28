import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useReducerContext } from '../../contexts/ReducerContext'
import style from './UserProfile.module.css'

export default function UserProfile() {

    const { currentUser, signout } = useAuth()
    const [state, dispatch] = useReducerContext()

    console.log(currentUser)

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
                    {currentUser.photo || <div className={style['img-name']}>N</div>}
                    <Link to="/" className={style['btn-signout']} onClick={signout}>Sign Out</Link>
                </div>
            </div>
        </>
    )
}
