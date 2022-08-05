import React, { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../../contexts/DatabaseContext'
import OrderShowInformations from '../../OrderShowInformartions/OrderShowInformations'
import ModalCancelReason from './ModalCancelReason'
import ModalAnnouncement from '../../ModalAnnouncement/ModalAnnouncement'
import style from './ShowAllOfOrder.module.css'

export default function ShowAllOfOrder({ order }) {

    const [showAccept, setShowAccept] = useState(false)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const [cancel, setCancel] = useState(false)
    const products = useMemo(() => {
        return [...Object.values(order.products)]
    }, [])
    const { updateOrderFromAdmin, addAnnouncementToUser } = useDatabase()

    function handleAccept() {
        setShowAccept(true)
        updateOrderFromAdmin(order, 'resolve')
        addAnnouncementToUser(order, 'resolve')
    }

    function handleShowCancelConfirm() {
        setShowCancelConfirm(true)
    }

    useEffect(() => {
        if (cancel) {
            setShowCancel(true)
        }
    }, [cancel])

    return (
        <>
            <div className={style['navbar']}>
                <Link to="/admin"><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Thông tin đơn hàng</h3>
            </div>

            <div className={style['container']}>
                <div className={style['order-list']}>
                    <p className={style['title']}>Sản phẩm</p>
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
                </div>

                <OrderShowInformations
                    order={order}
                    readonly={false}
                    handleAcceptCallback={handleAccept}
                    handleShowCancelConfirmCallback={handleShowCancelConfirm}
                />

                {/* <div>
                    <div className={style['form']}>
                        <div className={style['form-group']}>
                            <label>Tổng</label>
                            <p>{Number(order.totalPrice).toLocaleString('en-US').replaceAll(',', '.')} VNĐ</p>
                        </div>
                        <div className={style['form-group']}>
                            <label>Số điện thoại</label>
                            <p>{order.phone}</p>
                        </div>
                        <div className={style['form-group']}>
                            <label>Địa chỉ</label>
                            <p>{order.address}</p>
                        </div>
                        <div className={style['form-group']}>
                            <label>Hình thức thanh toán</label>
                            <p>{(() => {
                                switch (order.typePay) {
                                    case 'money':
                                        return 'Tiền mặt'
                                    case 'banking':
                                        return 'Chuyển khoản'
                                }
                            })()}</p>
                        </div>
                        <div className={style['form-group']}>
                            <label>Trạng thái</label>
                            <p>{(() => {
                                switch (order.status) {
                                    case 'waiting':
                                        return 'Đang xử lí'
                                    case 'resolve':
                                        return 'Đã nhận'
                                    case 'reject':
                                        return 'Đã hủy'
                                }
                            })()}</p>
                        </div>
                        {order.status === 'waiting' && (
                            <div className={style['form-actions']}>
                                <button className={style['btn-accept']} onClick={handleAccept}>Nhận</button>
                                <button className={style['btn-cancel']} onClick={handleShowCancelConfirm}>Hủy</button>
                            </div>
                        )}
                    </div>
                </div> */}
            </div>

            <ModalAnnouncement
                show={showAccept}
                setShow={setShowAccept}
            >
                Đã nhận đơn hàng này!
            </ModalAnnouncement>
            <ModalAnnouncement
                show={showCancel}
                setShow={setShowCancel}
            >
                Đã hủy đơn hàng này!
            </ModalAnnouncement>
            <ModalCancelReason
                order={order}
                show={showCancelConfirm}
                setShow={setShowCancelConfirm}
                setCancel={setCancel}
            />
        </>
    )
}
