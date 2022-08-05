import React from 'react'
import ModalConfirmAction from '../ModalConfirmAction/ModalConfirmAction'
import style from './Modal.module.css'

export default function ModalConfirmRemove({ product, show, setShow, removeProduct }) {

    if (!product) return

    function closeModal() {
        setShow(false)
    }

    return (
        <ModalConfirmAction
            show={show}
            closeModal={closeModal}
            accept={() => removeProduct(product)}
        >
            <p className={style['title']}>Bạn chắc chắn muốn bỏ sản phẩm này?</p>
            <p className={style['product-name']}>{product.title}</p>
        </ModalConfirmAction>
    )
}
