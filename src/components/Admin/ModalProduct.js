import React, { useEffect, useRef } from 'react'
import { useDatabase } from '../../contexts/DatabaseContext'
import { v4 } from 'uuid'
import style from './Admin.module.css'

export default function ModalProduct({ categoryId, type, setType, productId }) {

    const nameProductRef = useRef()
    const oldPriceProductRef = useRef()
    const newPriceProductRef = useRef()
    const imgUrlProductRef = useRef()

    const { categories, addProductFromAdmin, updateProductFromAdmin } = useDatabase()

    useEffect(() => {
        if (productId) {
            const products = categories.find(category => category.id === categoryId).products
            const productUpdate = [...Object.values(products)].find(product => product.id === productId)
            nameProductRef.current.value = productUpdate.title
            oldPriceProductRef.current.value = productUpdate.oldPrice
            newPriceProductRef.current.value = productUpdate.newPrice
            imgUrlProductRef.current.value = productUpdate.imgUrl
            nameProductRef.current.focus()
        }
    }, [productId])


    function handleSubmit (e) {
        e.preventDefault()
        const newProduct = {
            id: productId || v4(),
            title: nameProductRef.current.value,
            oldPrice: oldPriceProductRef.current.value,
            newPrice: newPriceProductRef.current.value,
            imgUrl: imgUrlProductRef.current.value,
            categoryId
        }
        if (type === 'add') {
            addProductFromAdmin(categoryId, newProduct)
        }
        if (type === 'update') {
            updateProductFromAdmin(categoryId, newProduct)
        }
        setType('')
    }

    return (
        <div className={style['modal-container']}>
            <div className={style['modal-content']}>
                <button className={style['modal-close']} onClick={() => setType('')}>&times;</button>
                <form className={style['modal-form']} onSubmit={handleSubmit}>
                    <div>
                        <label>Name </label>
                        <input type="text" ref={nameProductRef} required/>
                    </div>
                    <div>
                        <label>Old Price </label>
                        <input type="number" ref={oldPriceProductRef} required/>
                    </div>
                    <div>
                        <label>New Price </label>
                        <input type="number" ref={newPriceProductRef} required/>
                    </div>
                    <div>
                        <label>Image Url </label>
                        <input type="text" ref={imgUrlProductRef} required/>
                    </div>
                    <button className={`${style['submit']} ${style[type]}`}>{type}</button>
                </form>
            </div>
        </div>
    )
}
