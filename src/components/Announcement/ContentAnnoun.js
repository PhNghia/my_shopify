import React from 'react'
import { useDatabase } from '../../contexts/DatabaseContext'
import ProductShow from '../ProductShow/ProductShow'
import OrderShowInformations from '../OrderShowInformartions/OrderShowInformations'
import style from './Announcement.module.css'

export default function ContentAnnoun({ announ, setActiveAnnoun }) {
    const { removeAnnouncement } = useDatabase()

    function handleRemove () {
        removeAnnouncement(announ)
        if (window.innerWidth >= 840) {
            setActiveAnnoun(null)
        }
    }

    if (!announ) return (<></>)

    return (
        <div>
            <h3>Tiêu đề: <span>{announ.title}</span></h3>
            <h3>Nội dung:</h3>
            <div className={style['description']}>
                <div>
                    <p className={style['child-title']}>Sản Phẩm</p>
                    <div className={style['child-products']}>
                        {announ.products.map(product => <ProductShow key={product.id} product={product} readonly />)}
                    </div>
                </div>
                <div>
                    <p className={style['child-title']}>Thông Tin Đơn Hàng</p>
                    <OrderShowInformations order={announ} readonly styles={{ marginTop: '0' }} />
                </div>
                {announ.status === 'reject' && <p className={style['message']}>Lý do hủy đơn hàng: <span>{announ.message}</span></p>}
                {announ.status === 'resolve' && <p className={style['message']}>Lời nhắn: <span>{announ.message}</span></p>}
                <div className={style['remove']}>
                    <button onClick={handleRemove}>Xóa</button>
                </div>
            </div>
        </div>
    )
}
