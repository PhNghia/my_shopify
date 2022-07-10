import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {

    const { currentUser, signout } = useAuth()

    function hanldeSignout() {
        try {
            signout()
        } catch {

        }
    }

    if (!currentUser) {
        return (
            <div>
                <h1>Have not login</h1>
                <Link to="/login">Log In</Link>
            </div>
        )
    }

    return (
        <>
            <div><strong>Email: </strong>{currentUser.email}</div>
            <Link to="/login" onClick={hanldeSignout}>Sign Out</Link>
        </>
    )
}
