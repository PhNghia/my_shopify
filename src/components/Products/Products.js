import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import style from './Products.module.css'

export default function Products({ categoryId, resultProducts }) {

    const inputSearchRef = useRef()
    const { categories } = useDatabase()
    const category = categories.find(category => category.id === categoryId)
    const defaultProducts = category.products ? [...Object.values(category.products)] : []
    const [input, setInput] = useState(category.name)
    const [products, setProducts] = useState([...defaultProducts])


    useEffect(() => {
        inputSearchRef.current.onfocus = () => {
            setInput('')
            inputSearchRef.current.style.color = '#555'
        }

        inputSearchRef.current.onblur = () => {
            if (inputSearchRef.current.value) return
            setInput(category.name)
            inputSearchRef.current.style.color = 'var(--primary)'
        }
    }, [])

    useEffect(() => {
        const delay = setTimeout(() => {
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
        }, 600)

        return () => {
            clearTimeout(delay)
        }
    }, [input])

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
                        placeholder={`Tìm trong ${category.name}`}
                    />
                </div>
            </div>
            <div className={style['contain']}>
                {products.map(product => (
                    <Link to={product.id} key={product.id} className={style['article']}>
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
        </>
    )
}
