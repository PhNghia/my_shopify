import React from 'react'
import style from './ProductShow.module.css'

export default function ProductShow({ product, readonly, ...callbacks }) {
    return (
        <div key={product.id} className={style['item']}>
            {
                readonly ||
                <input
                    type="checkbox"
                    checked={product.isChoosed}
                    onChange={callbacks.inputOnChangeCallback}
                />
            }
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
                {
                    readonly &&
                    <p className={style['quantity-readonly']}>
                        Số lượng: <i className="fa-solid fa-xmark"></i>
                        <span>{product.quantity}</span>
                    </p>
                }
                {
                    readonly ||
                    <div className={style['quantity-none-readonly']}>
                        <button onClick={callbacks.handleDecreaseQuantityCallback}><i className="fa-solid fa-minus"></i></button>
                        <strong>{product.quantity}</strong>
                        <button onClick={callbacks.handleIncreaseQuantityCallback}><i className="fa-solid fa-plus"></i></button>
                    </div>
                }
            </div>
        </div>
    )
}
