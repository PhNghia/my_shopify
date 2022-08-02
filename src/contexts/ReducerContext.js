import React, { useReducer, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks'

const ReducerContext = React.createContext()

const SET_PATH_LOCATION = 'set-path-location'
const PREV_INPUT_OF_CUSTOM_SEARCH = 'prev-input-of-custom-search'
const INPUT_OF_CUSTOM_SEARCH = 'input-of-custom-search'
const PRODUCTS_OF_CUSTOM_SEARCH = 'products-of-custom-search'
const INPUT_OF_CATEGORY_SEARCH = 'input-of-category-search'

const inititalState = () => {
    const inititalState = {
        pathOfLocation: '',
        prevInputOfCustomSearch: { value: '' },
        inputOfCustomSearch: '',
        productsOfCustomSearch: [],
        inputOfCategorySearch: ''
    }

    const valueInLocalStorage = JSON.parse(localStorage.getItem('reducerState'))
    if (valueInLocalStorage) return { ...valueInLocalStorage}
    return inititalState
}

export const setPathOfLocation = payload => {
    return {
        type: SET_PATH_LOCATION,
        payload
    }
}

export const setPrevInputOfCustomSearch = payload => {
    return {
        type: PREV_INPUT_OF_CUSTOM_SEARCH,
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

export const setInputOfCategorySearch = payload => {
    return {
        type: INPUT_OF_CATEGORY_SEARCH,
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

        case PREV_INPUT_OF_CUSTOM_SEARCH:
            state.prevInputOfCustomSearch.value = action.payload
            return {
                ...state
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
        case INPUT_OF_CATEGORY_SEARCH:
            return {
                ...state,
                inputOfCategorySearch: action.payload
            }
        default:
            throw new Error(`Invalid action ${action.type}`)
    }
}

export function useReducerContext() {
    return useContext(ReducerContext)
}

export function ReducerProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, inititalState())

    useEffect(() => {
        function handleBeforeUnLoad(e) {
            e.returnValue = null
        }

        window.addEventListener('beforeunload', handleBeforeUnLoad)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnLoad)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('reducerState', JSON.stringify(state))
    }, [state])

    return (
        <ReducerContext.Provider value={[state, dispatch]}>
            {children}
        </ReducerContext.Provider>
    )
}
