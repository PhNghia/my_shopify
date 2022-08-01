import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import { useAuth } from '../../contexts/AuthContext'
import { useReducerContext, setPathOfLocation } from '../../contexts/ReducerContext'
import { UserCartLink } from '../BenefitCs'
import ModalAnnouncement from '../ModalAnnouncement/ModalAnnouncement'
import style from './Products.module.css'

export default function ProductArticle({ categoryId, productId }) {
    const navigate = useNavigate()
    const location = useLocation()

    const [quantity, setQuantity] = useState(1)
    const [show, setShow] = useState(false)

    const decreaseBtnRef = useRef()
    const increaseBtnRef = useRef()

    const [state, dispatch] = useReducerContext()
    const { currentUser } = useAuth()
    const { categories, addCartFromCurrentUser } = useDatabase()
    const product = useMemo(() => {
        return (categories.find(category => category.id === categoryId).products)[productId]
    }, [])

    function handleAddProduct() {
        if (!currentUser) {
            dispatch(setPathOfLocation(location.pathname))
            navigate('/login')
            return
        }

        addCartFromCurrentUser(product, quantity)
        setShow(true)
    }

    useEffect(() => {
        let continouslyIncrease
        let timeStart
        let continouslyDecrease

        function handleContinouslyIncrease() {
            timeStart = setTimeout(() => {
                continouslyIncrease = setInterval(() => {
                    setQuantity(prev => prev + 1)
                }, 100)
            }, 300)
        }

        function handleRemoveContinouslyIncrease() {
            clearTimeout(timeStart)
            clearInterval(continouslyIncrease)
        }

        function handleContinouslyDecrease() {
            timeStart = setTimeout(() => {
                continouslyDecrease = setInterval(() => {
                    setQuantity(prev => prev <= 1 ? 1 : prev - 1)
                }, 100)
            }, 300)
        }

        function handleRemoveContinouslyDecrease() {
            clearTimeout(timeStart)
            clearInterval(continouslyDecrease)
        }

        function handleMouseOut() {
            clearTimeout(timeStart)
            clearInterval(continouslyIncrease)
            clearInterval(continouslyDecrease)
        }

        increaseBtnRef.current.addEventListener('mousedown', handleContinouslyIncrease)
        increaseBtnRef.current.addEventListener('touchstart', handleContinouslyIncrease)
        increaseBtnRef.current.addEventListener('mouseup', handleRemoveContinouslyIncrease)
        increaseBtnRef.current.addEventListener('touchend', handleRemoveContinouslyIncrease)
        increaseBtnRef.current.addEventListener('mouseout', handleMouseOut)
        increaseBtnRef.current.addEventListener('touchmove', handleMouseOut)

        decreaseBtnRef.current.addEventListener('mousedown', handleContinouslyDecrease)
        decreaseBtnRef.current.addEventListener('touchstart', handleContinouslyDecrease)
        decreaseBtnRef.current.addEventListener('mouseup', handleRemoveContinouslyDecrease)
        decreaseBtnRef.current.addEventListener('touchend', handleRemoveContinouslyDecrease)
        decreaseBtnRef.current.addEventListener('mouseout', handleMouseOut)
        decreaseBtnRef.current.addEventListener('touchmove', handleMouseOut)

        return () => {
            if (increaseBtnRef.current) {
                increaseBtnRef.current.removeEventListener('mousedown', handleContinouslyIncrease)
                increaseBtnRef.current.removeEventListener('mouseup', handleRemoveContinouslyIncrease)
                increaseBtnRef.current.removeEventListener('mouseout', handleMouseOut)
                increaseBtnRef.current.removeEventListener('touchstart', handleContinouslyIncrease)
                increaseBtnRef.current.removeEventListener('touchend', handleRemoveContinouslyIncrease)
                increaseBtnRef.current.removeEventListener('touchmove', handleMouseOut)
            }

            if (decreaseBtnRef.current) {
                decreaseBtnRef.current.removeEventListener('mousedown', handleContinouslyDecrease)
                decreaseBtnRef.current.removeEventListener('mouseup', handleRemoveContinouslyDecrease)
                decreaseBtnRef.current.removeEventListener('mouseout', handleMouseOut)
                decreaseBtnRef.current.removeEventListener('touchstart', handleContinouslyDecrease)
                decreaseBtnRef.current.removeEventListener('touchend', handleRemoveContinouslyDecrease)
                decreaseBtnRef.current.removeEventListener('touchmove', handleMouseOut)
            }

        }
    }, [])

    return (
        <>
            <div className={style['show-product-container']}>
                <div className={style['show-image']}>
                    <div>
                        <Link to={document.location.hash.includes('tags') ? '/tags' : `/category/${categoryId}`}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <UserCartLink className={style['cart']} />
                    </div>
                    <img src={product.imgUrl} alt={`ảnh ${product.title}`} />
                </div>
                <div className={style['article-description']}>
                    <p className={style['show-title']}>{product.title}</p>
                    <p className={style['show-price']}>
                        <span className={style['show-old-price']}>
                            <span>đ</span>
                            {Number(product.oldPrice).toLocaleString('en-US').replaceAll(',', '.')}
                        </span>
                        <span className={style['show-new-price']}>
                            <span>đ</span>
                            {Number(product.newPrice).toLocaleString('en-US').replaceAll(',', '.')}
                        </span>
                    </p>
                    <div className={style['show-quantity']}>
                        <div className={style['show-btn-quantity']}>
                            <button ref={decreaseBtnRef} onClick={() => setQuantity(prev => prev <= 1 ? 1 : prev - 1)}><i className="fa-solid fa-minus"></i></button>
                            <span>{quantity}</span>
                            <button ref={increaseBtnRef} onClick={() => setQuantity(prev => prev + 1)}><i className="fa-solid fa-plus"></i></button>
                        </div>
                        <span>2 products max</span>
                    </div>
                    <button onClick={handleAddProduct} className={style['show-btn-add']}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        Add to cart
                    </button>
                </div>
            </div>

            <ModalAnnouncement
                show={show}
                setShow={setShow}
            >
                Thêm vào giỏ hàng thành công!
            </ModalAnnouncement>
        </>
    )
}
