import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import { useReducerContext } from '../../contexts/ReducerContext'
import ProductShow from '../ProductShow/ProductShow'
import ModalConfirmRemove from './ModalConfirmRemove'
import style from './UserCart.module.css'

export default function UserCart() {
    
    const [state, dispatch] = useReducerContext()
    const {
        carts,
        increaseQuantityCartItem,
        decreaseQuantityCartItem,
        updateCartFromUser,
        deleteProductInSideCartFromUser
    } = useDatabase()

    const [showConfirm, setShowConfirm] = useState(false)
    const [confirmRemoveProduct, setConfirmRemoveProduct] = useState(null)

    const totalPrice = useMemo(() => {
        const totalPrice = carts.reduce((acc, item) => {
            if (!item.isChoosed) return acc
            let result = acc + Number((item.newPrice * item.quantity))
            return result
        }, 0)
        return totalPrice
    }, [carts])

    function handleDecreaseQuantity (product) {
        if (product.quantity === 1) {
            setShowConfirm(true)
            setConfirmRemoveProduct(product)
            return
        }
        decreaseQuantityCartItem(product)
    }

    function handleIncreaseQuantity (product) {
        increaseQuantityCartItem(product)
    }

    function handleBuyProducts(e) {
        const orderProducts = carts.filter(product => product.isChoosed)
        if (orderProducts.length <= 0) {
            e.preventDefault()
            return
        }
    }

    return (
        <>
            <div className={style['navbar']}>
                <Link to={state.pathOfLocation || '/'}><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Giỏ Hàng</h3>
            </div>

            <div className={style['wrap']}>
                {carts.length <= 0 && (
                    <div className={style['empty-cart']}>
                        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png" alt="img cart empty" />
                        <h4 className={style['empty-title']}>Giỏ hàng của bạn còn trống</h4>
                        <Link to={state.pathOfLocation || '/'}>Mua Ngay</Link>
                    </div>
                )}

                {carts.length > 0 && (<div className={style['container']}>
                    <div className={style['main']}>
                        <div className={style['list']}>
                            {carts.map((item) => (
                                <ProductShow 
                                    key={item.id} 
                                    product={item} 
                                    readonly={false}
                                    inputOnChangeCallback={(e) => updateCartFromUser(item, { isChoosed: e.target.checked })}
                                    handleDecreaseQuantityCallback={() => handleDecreaseQuantity(item)}
                                    handleIncreaseQuantityCallback={() => handleIncreaseQuantity(item)}
                                />
                            ))}
                        </div>

                        <div className={style['summary']}>
                            <div>
                                <h5>Tổng tiền: <strong>{totalPrice.toLocaleString('us').replaceAll(',', '.')}</strong></h5>
                            </div>
                            <Link to="/confirm_order" onClick={handleBuyProducts}>Đặt Hàng</Link>
                        </div>
                    </div>
                </div>)}
            </div>

            <ModalConfirmRemove
                product={confirmRemoveProduct}
                removeProduct={deleteProductInSideCartFromUser}
                show={showConfirm}
                setShow={setShowConfirm}
            />
        </>
    )
}
