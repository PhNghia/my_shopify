import React, { useRef, useEffect } from 'react'
import { useDatabase } from '../../contexts/DatabaseContext'
import style from './Admin.module.css'

export default function ModalCategory({ payload, setPayloadForModal }) {

    const imgUrlRef = useRef()
    const nameRef = useRef()

    const { addCategoryFromAdmin, updateCategoryFromAdmin } = useDatabase()

    useEffect(() => {
        if (payload.type === "update") {
            const { category } = payload
            imgUrlRef.current.value = category.imgUrl
            nameRef.current.value = category.name
            imgUrlRef.current.focus()
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        const newPropertiesOfCategory = {
            imgUrl: imgUrlRef.current.value,
            name: nameRef.current.value
        }

        if (payload.type === "add") {
            addCategoryFromAdmin(newPropertiesOfCategory)
        }

        if (payload.type === "update") {
            updateCategoryFromAdmin(payload.category.id, {
                ...newPropertiesOfCategory,
                products: payload.category.products ? payload.category.products : null
            })
        }

        setPayloadForModal({ type: '' })
    }

    return (
        <div className={style['modal-container']}>
            <div className={style['modal-content']}>
                <button className={style['modal-close']} onClick={() => setPayloadForModal({ type: '' })}>&times;</button>
                <form className={style['modal-form']} onSubmit={handleSubmit}>
                    <div>
                        <label>Name </label>
                        <input type="text" ref={nameRef} required />
                    </div>
                    <div>
                        <label>Image Url </label>
                        <input type="text" ref={imgUrlRef} required />
                    </div>
                    <button className={`${style['submit']} ${style[payload.type]}`}>{payload.type} Category</button>
                </form>
            </div>
        </div>
    )
}
