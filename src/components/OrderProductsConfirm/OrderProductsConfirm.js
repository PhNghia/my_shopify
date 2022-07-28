import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import ModalAnnouncement from '../ModalAnnouncement/ModalAnnouncement'
import style from './OrderProductsConfirm.module.css'

export default function OrderProductsConfirm() {
    const phoneRef = useRef()
    const addressRef = useRef()
    const typePayRef = useRef()
    const navigate = useNavigate()
    
    const { carts, addOrderFromUser, deleteProductInSideCartFromUser } = useDatabase()
    const [products, totalPrice]  = useMemo(() => {
        const products = carts.filter(product => product.isChoosed)
        const totalPrice = products.reduce((totalPrice, product) => totalPrice + product.newPrice * product.quantity, 0)
        return [products, totalPrice]
    }, [carts])

    const [confirm, setConfirm] = useState(false)
    const [show, setShow] = useState(false)

    function handleSubmitConfirm (e) {
        e.preventDefault()
        if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phoneRef.current.value)) {
            return
        }
        if (confirm) return
        const order = {
            date: new Date().toString(),
            products,
            totalPrice,
            phone: phoneRef.current.value,
            address: addressRef.current.value,
            typePay: typePayRef.current.value,
            status: 'waiting'
        }
        addOrderFromUser(order)
        setConfirm(true)
        setShow(true)
    }

    useEffect(() => {
        if (!show && confirm) {
            navigate('/user_cart')
            products.forEach(product => deleteProductInSideCartFromUser(product))
        }
    }, [show])
    

    return (
        <>
            <div className={style['navbar']}>
                <Link to="/user_cart"><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Đặt hàng</h3>
            </div>

            <div className={style['container']}>
                <div className={style['order-list']}>
                    {products.map(product => (
                        <div key={product.id} className={style['order-item']}>
                            <img src={product.imgUrl} alt={`ảnh ${product.title}`} />
                            <div className={style['content']}>
                                <h4 className={style['product-name']}>{product.title}</h4>
                                <div className={style['show-price']}>
                                    <span className={style['show-old-price']}>
                                        <span>đ</span>
                                        {Number(product.oldPrice).toLocaleString('en-US').replaceAll(',', '.')}
                                    </span>
                                    <span className={style['show-new-price']}>
                                        <span>đ</span>
                                        {Number(product.newPrice).toLocaleString('en-US').replaceAll(',', '.')}
                                    </span>
                                </div>
                                <p className={style['quantity']}>Số lượng: <i className="fa-solid fa-xmark"></i><span>{product.quantity}</span></p>
                            </div>
                        </div>
                    ))}

                    <div className={style['total-price']}>
                        <p>Tổng: </p>
                        <p>{Number(totalPrice).toLocaleString('en-US').replaceAll(',', '.')} VNĐ</p>
                    </div>
                </div>
                
                <div>
                    <form className={style['form']} onSubmit={handleSubmitConfirm}>
                        <div className={style['form-group']}>
                            <label>Số điện thoại</label>
                            <input ref={phoneRef} type="text" required/>
                        </div>
                        <div className={style['form-group']}>
                            <label>Địa chỉ</label>
                            <input ref={addressRef} type="text" required/>
                        </div>
                        <div className={style['form-group']}>
                            <label>Hình thức thanh toán</label>
                            <select ref={typePayRef}>
                                <option value="money">Tiền mặt</option>
                                <option value="banking">Chuyển khoản</option>
                            </select>
                        </div>
                        <button className={confirm ? style['confirm'] : undefined}>Xác nhận</button>
                    </form>
                </div>
            </div>

            <ModalAnnouncement
                show={show}
                setShow={setShow}
            >
                Đặt hàng thành công. Đang chờ xử lí!
            </ModalAnnouncement>
        </>
    )
}
