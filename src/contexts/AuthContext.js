import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [currentAdmin, setCurrentAdmin] = useState(null)

    function signup (email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login (email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function signout () {
        return signOut(auth)
    }

    function updateUser (user, updateValues) {
        updateProfile(user, {
            ...updateValues
        })
    }

    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return unsubcribe
    }, [])

    const value = {
        currentUser,
        currentAdmin,
        setCurrentAdmin,
        signup,
        login,
        signout,
        updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
