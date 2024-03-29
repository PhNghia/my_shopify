import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAccountLink, UserCartLink, UserBellLink } from '../BenefitCs'
import { useDatabase } from '../../contexts/DatabaseContext'
import { useReducerContext, setInputOfCustomSearch, setPrevInputOfCustomSearch } from '../../contexts/ReducerContext'
import style from './Layout.module.css'

export default function LayoutApp() {
    const { categories } = useDatabase()
    const [state, dispatch] = useReducerContext()
    const inputRef = useRef()
    const [allProductsOfCategory, setAllProductsOfCategory] = useState(() => {
        const allProductsOfCategory = categories.map(category => {
            const products = category.products ? [...Object.values(category.products)] : []
            return products
        }).flat(Infinity)
        return allProductsOfCategory
    })
    const navigate = useNavigate()

    function handleSearchProducts(e) {
        e.preventDefault()
        if (!inputRef.current.value.trim()) return
        dispatch(setInputOfCustomSearch(inputRef.current.value))
        dispatch(setPrevInputOfCustomSearch(inputRef.current.value))
        setTimeout(() => {
            navigate('/tags')
        }, 100)
    }

    return (
        <>
            <div className={style['container']}>
                <div className={style['navbar-top']}>
                    <div>
                        <UserAccountLink className={style['auth']} />
                        <UserBellLink className={style['announcement']} />
                    </div>
                </div>
                <div className={style['navbar-bottom']}>
                    <form className={style['search']} onSubmit={handleSearchProducts}>
                        <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                        <input type="text" ref={inputRef} />
                    </form>
                    <UserCartLink className={style['cart']} />
                </div>
            </div>
        </>
    )
}
