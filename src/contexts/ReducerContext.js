import React, { useReducer, useContext } from 'react'

const ReducerContext = React.createContext()

const SET_PATH_LOCATION = 'set-path-location'

const inititalState = {
    pathOfLocation: ''
}

export const setPathOfLocation = payload => {
    return {
        type: SET_PATH_LOCATION,
        payload
    }
}

function reducer (state, action) {
    switch (action.type) {
        case SET_PATH_LOCATION:
            return {
                ...state,
                pathOfLocation: action.payload
            }
        default:
            throw new Error(`Invalid action ${action.type}`)
    }
}

export function useReducerContext () {
    return useContext(ReducerContext)
}

export function ReducerProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, inititalState)

    return (
        <ReducerContext.Provider value={[state, dispatch]}>
            {children}
        </ReducerContext.Provider>
    )
}
