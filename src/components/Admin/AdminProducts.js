import React, { useEffect, useState } from 'react'
import { useDatabase } from '../../contexts/DatabaseContext'
import ModalProduct from './ModalProduct'
import style from './Admin.module.css'

export default function AdminProducts({ id }) {

    const { categories, deleteProductFromAdmin } = useDatabase()
    const products = categories.find(category => category.id === id).products
    const [typeModalProduct, setTypeModalProduct] = useState('')
    const [productId, setProductId] = useState('')

    return (
        <>
            <div className={style['products-container']}>
                <button className={style['add-btn']} onClick={() => setTypeModalProduct('add')}>Add Product</button>
                <table>
                    <thead>
                        <tr className={style['product']}>
                            <th>Name</th>
                            <th>Old Price</th>
                            <th>New Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && [...Object.values(products)].map(product => (
                            <tr key={product.id} className={style['product']}>
                                <td>{product.title}</td>
                                <td>{Number(product.oldPrice).toLocaleString('en-US').replaceAll(',', '.')}</td>
                                <td>{Number(product.newPrice).toLocaleString('en-US').replaceAll(',', '.')}</td>
                                <td><img className={style['product-img']} src={product.imgUrl} alt={'ảnh ' + product.name}/></td>
                                <td>
                                    <button
                                        className={style['setting-btn']}
                                        onClick={() => {
                                            setTypeModalProduct('update')
                                            setProductId(product.id)
                                        }}
                                    >
                                        Setting
                                    </button>
                                    <button
                                        className={style['delete-btn']}
                                        onClick={() => deleteProductFromAdmin(id, product)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {typeModalProduct === 'add' && <ModalProduct categoryId={id} type={typeModalProduct} setType={setTypeModalProduct} />}
            {typeModalProduct === 'update' && <ModalProduct categoryId={id} type={typeModalProduct} setType={setTypeModalProduct} productId={productId} />}
        </>
    )
}
