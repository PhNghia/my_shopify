import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import { useReducerContext, setInputOfCustomSearch, setProductsOfCustomSearch, setPrevInputOfCustomSearch, setInputOfCategorySearch } from '../../contexts/ReducerContext'
import Loading from '../Loading'
import style from './Products.module.css'

export default function Products({ categoryId }) {
    const inputSearchRef = useRef()
    const [state, dispatch] = useReducerContext()
    const { categories } = useDatabase()
    const category = categories.find(category => category.id === categoryId)
    const defaultProducts = useMemo(() => {
        if (category) {
            const products = category.products ? [...Object.values(category.products)] : []
            return products
        }

        return categories.map(category => {
            return category.products ? [...Object.values(category.products)] : []
        }).flat(Infinity)
    }, [])
    const [input, setInput] = useState(() => {
        if (category) return state.inputOfCategorySearch ? state.inputOfCategorySearch : category.name

        return state.inputOfCustomSearch
    })
    const [products, setProducts] = useState(() => {
        if (category) {
            switch (state.inputOfCategorySearch) {
                case '':
                case category.name:
                    return [...defaultProducts]
                default:
                    const arrayValueOfInput = state.inputOfCategorySearch.trim().split(' ')
                    return defaultProducts.filter(product => {
                        const isValid = arrayValueOfInput.some(value => product.title.toLowerCase().includes(value.toLowerCase()))
                        return isValid
                    })
            }
        }
        return defaultProducts.filter(product => {
            return product.title.toLowerCase().includes(state.inputOfCustomSearch.toLowerCase())
        })
    })

    function hanldeFocus() {
        dispatch(setPrevInputOfCustomSearch(inputSearchRef.current.value))
        dispatch(setInputOfCustomSearch(inputSearchRef.current.value))
        setInput('')
        inputSearchRef.current.style.color = '#555'
    }

    function hanldeBlur() {
        if (inputSearchRef.current.value !== '') {
            dispatch(setPrevInputOfCustomSearch(inputSearchRef.current.value))
            dispatch(setInputOfCustomSearch(inputSearchRef.current.value))
            return
        }
        setInput(() => {
            if (category) return category.name
            return state.prevInputOfCustomSearch.value
        })
        if (category) {
            switch (inputSearchRef.current.value) {
                case '':
                case category.name:
                    inputSearchRef.current.style.color = "var(--primary)"
                    break
                default:
                    inputSearchRef.current.style.color = "#555"
            }
        }
    }

    useEffect(() => {
        if (category) {
            switch (state.inputOfCategorySearch) {
                case '':
                case category.name:
                    inputSearchRef.current.style.color = "var(--primary)"
                    break
                default:
                    inputSearchRef.current.style.color = '#555'
            }
        } else {
            inputSearchRef.current.style.color = '#555'
        }

        inputSearchRef.current.addEventListener('focus', hanldeFocus)

        inputSearchRef.current.addEventListener('blur', hanldeBlur)

        return () => {
            if (!inputSearchRef.current) return
            inputSearchRef.current.removeEventListener('focus', hanldeFocus)
            inputSearchRef.current.removeEventListener('blur', hanldeBlur)
        }
    }, [])

    useEffect(() => {
        const delay = setTimeout(() => {
            if (category) {
                setProducts(() => {
                    switch (input) {
                        case '':
                        case category.name:
                            return [...defaultProducts]
                        default:
                            const arrayValueOfInput = input.trim().split(' ')
                            return defaultProducts.filter(product => {
                                const isValid = arrayValueOfInput.some(value => product.title.toLowerCase().includes(value.toLowerCase()))
                                return isValid
                            })
                    }
                })
                dispatch(setInputOfCategorySearch(inputSearchRef.current.value))
                return
            }

            if (input.trim() !== '') {
                setProducts(() => {
                    return defaultProducts.filter(product => {
                        return product.title.toLowerCase().includes(input.toLowerCase())
                    })
                })
                dispatch(setPrevInputOfCustomSearch(inputSearchRef.current.value))
                dispatch(setInputOfCustomSearch(inputSearchRef.current.value))
            }
        }, 600)

        return () => {
            clearTimeout(delay)
        }
    }, [input])

    useEffect(() => {
        dispatch(setProductsOfCustomSearch(products))
    }, [products])

    return (
        <>
            <div className={style['navbar']}>
                <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
                <div className={style['search']}>
                    <span><i className="fa-solid fa-magnifying-glass"></i></span>
                    <input
                        type="text"
                        ref={inputSearchRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={category && `Tìm trong ${category.name}`}
                    />
                </div>
            </div>

            {products.length === 0 && (
                <div className={style['none-contain']}>
                    <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png" alt="trống" />
                    <div className={style['message-empty']}>Không tìm thấy kết quả nào</div>
                    <div className={style['suggest-empty']}>Hãy thử sử dụng các từ khóa chung chung hơn</div>
                </div>
            )}

            {products.length > 0 && (
                <div className={style['contain']}>
                    {products.map(product => (
                        <Link to={`${category ? `/category/${product.categoryId}/` : '/tags/'}${product.id}`} key={product.id} className={style['article']} onClick={() => {
                            if (category) {
                                dispatch(setInputOfCategorySearch(inputSearchRef.current.value))
                                return
                            }
                            dispatch(setInputOfCustomSearch(inputSearchRef.current.value))
                        }}>
                            <div className={style['product-img']}>
                                <img src={product.imgUrl} alt={'ảnh ' + product.title} />
                            </div>
                            <div className={style['description']}>
                                <p className={style['product-title']}>{product.title}</p>
                                <p className={style['product-price']}>
                                    <span className={style['old-price']}>
                                        <span>đ</span>
                                        {Number(product.oldPrice).toLocaleString('en-US').replaceAll(',', '.')}
                                    </span>
                                    <span className={style['new-price']}>
                                        <span>đ</span>
                                        {Number(product.newPrice).toLocaleString('en-US').replaceAll(',', '.')}
                                    </span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}
