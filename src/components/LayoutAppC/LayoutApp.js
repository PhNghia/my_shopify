import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { UserAccountLink, UserCartLink } from '../BenefitCs'
import style from './Layout.module.css'

export default function LayoutApp() {

    const { currentUser } = useAuth()

    return (
        <>
            <div className={style['container']}>
                <div className={style['search']}>
                    <span><i className="fa-solid fa-magnifying-glass"></i></span>
                    <input type="text" />
                </div>
                <UserCartLink  className={style['cart']} />
                <UserAccountLink  className={style['auth']} />
            </div>
        </>
    )
}
