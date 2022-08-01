import React, { useEffect, useState } from 'react';

function getValueByKey (key, initialValue) {
    const value = JSON.parse(localStorage.getItem(key));
    if (value) return value;

    if (initialValue instanceof Function) {
        return initialValue()
    }
    return initialValue
}

export function useLocalStorage (key, initialValue) {

    const [value, setValue] = useState(() => {
        return getValueByKey(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
        console.log(value)
    }, [value])

    return [value, setValue]
}