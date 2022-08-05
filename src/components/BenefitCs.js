import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDatabase } from '../contexts/DatabaseContext'
import { useReducerContext, setPathOfLocation } from '../contexts/ReducerContext'

export function UserAccountLink({ className }) {
    const { currentUser } = useAuth()
    const location = useLocation()
    const [state, dispatch] = useReducerContext()

    return (
        <Link
            to={currentUser ? '/user_profile' : '/login'}
            className={className}
            onClick={() => dispatch(setPathOfLocation(location.pathname))}
        >
            <i className="fa-solid fa-user"></i>
        </Link>
    )
}

export function UserCartLink({ className }) {
    const { currentUser } = useAuth()
    const { carts } = useDatabase()
    const location = useLocation()
    const [state, dispatch] = useReducerContext()

    return (
        <Link
            to={currentUser ? '/user_cart' : '/login'}
            className={className}
            onClick={() => dispatch(setPathOfLocation(location.pathname))}
        >
            {carts.length > 0 && <span>{carts.length >= 100 ? '!!!' : carts.length}</span>}
            <i className="fa-solid fa-cart-shopping"></i>
        </Link>
    )
}

export function UserBellLink({ className }) {
    const { currentUser } = useAuth()
    const { announcements } = useDatabase()

    const length = useMemo(() => {
        const length = announcements.filter(announ => !announ.seen).length
        return length
    }, [announcements])

    return (
        <Link
            to={currentUser ? '/announcement' : '/login'}
            className={className}
        >
            {length > 0 && <span>{length >= 100 ? '!!!' : length}</span>}
            <i className="fa-solid fa-bell"></i>
        </Link>
    )
}