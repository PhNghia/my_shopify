import React from 'react'
import style from './OrderShow.module.css'

export default function OrderShowInformations({ order, readonly, styles, ...callbacks }) {
    return (
        <div>
            <div className={style['form']} style={styles && {...styles}}>
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
                {readonly || (order.status === 'waiting' && (
                    <div className={style['form-actions']}>
                        <button className={style['btn-accept']} onClick={callbacks.handleAcceptCallback}>Nhận</button>
                        <button className={style['btn-cancel']} onClick={callbacks.handleShowCancelConfirmCallback}>Hủy</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
