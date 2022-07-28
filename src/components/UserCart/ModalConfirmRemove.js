import React from 'react'
import style from './Modal.module.css'

export default function ModalConfirmRemove({ product, show, setShow, removeProduct }) {

    if (!product) return

    function closeModal () {
        setShow(false)
    }

    return (
        <div className={`${style['modal']} ${show && style['show']}`}>
            <div className={style['wrap']}></div>
            <div className={style['container']}>
                <p className={style['title']}>Bạn chắc chắn muốn bỏ sản phẩm này?</p>
                <p className={style['product-name']}>{product.title}</p>
                <div className={style['btns']}>
                    <button onClick={() => {
                        closeModal()
                        removeProduct(product)
                    }}>Có</button>
                    <div></div>
                    <button onClick={closeModal}>Không</button>
                </div>
            </div>
        </div>
    )
}
