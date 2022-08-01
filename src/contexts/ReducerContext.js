import React, { useReducer, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks'

const ReducerContext = React.createContext()

const SET_PATH_LOCATION = 'set-path-location'
const INPUT_OF_CUSTOM_SEARCH = 'input-of-custom-search'
const PRODUCTS_OF_CUSTOM_SEARCH = 'products-of-custom-search'

const inititalState = {
    pathOfLocation: '',
    inputOfCustomSearch: '',
    productsOfCustomSearch: []
}

export const setPathOfLocation = payload => {
    return {
        type: SET_PATH_LOCATION,
        payload
    }
}

export const setInputOfCustomSearch = payload => {
    return {
        type: INPUT_OF_CUSTOM_SEARCH,
        payload
    }
}

export const setProductsOfCustomSearch = payload => {
    return {
        type: PRODUCTS_OF_CUSTOM_SEARCH,
        payload
    }
}

function reducer(state, action) {
    switch (action.type) {
        case SET_PATH_LOCATION:
            return {
                ...state,
                pathOfLocation: action.payload
            }
        case INPUT_OF_CUSTOM_SEARCH:
            return {
                ...state,
                inputOfCustomSearch: action.payload
            }
        case PRODUCTS_OF_CUSTOM_SEARCH:
            return {
                ...state,
                productsOfCustomSearch: [...action.payload]
            }
        default:
            throw new Error(`Invalid action ${action.type}`)
    }
}

export function useReducerContext() {
    return useContext(ReducerContext)
}

export function ReducerProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, inititalState)
    const [value, setValue] = useLocalStorage('reducerState', state)

    useEffect(() => {
        setValue(state)
    }, [state])

    useEffect(() => {
        function handleLoaded () {
            dispatch(setPathOfLocation(value.pathOfLocation))
            dispatch(setInputOfCustomSearch(value.inputOfCustomSearch))
            dispatch(setProductsOfCustomSearch(value.productsOfCustomSearch))
        }

        window.addEventListener('load', handleLoaded)

        return () => {
            window.removeEventListener('load', handleLoaded)
        }
    }, [])

    return (
        <ReducerContext.Provider value={[state, dispatch]}>
            {children}
        </ReducerContext.Provider>
    )
}
