import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDatabase } from '../contexts/DatabaseContext'
import { Outlet } from 'react-router-dom'
import LayoutApp from './LayoutAppC/LayoutApp'

export default function Home() {

    const { currentUser, signout } = useAuth()
    const { products, carts, addCartFromCurrentUser } = useDatabase()

    function hanldeSignout() {
        try {
            signout()
        } catch {

        }
    }

    return (
        <>  
           <Outlet />
        </>
    )
}
