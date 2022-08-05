import React, { useState } from 'react'
import { useDatabase } from '../../../contexts/DatabaseContext' 
import style from './Modal.module.css'

export default function ModalCancelReason({ order, show, setShow, setCancel }) {
    const { updateOrderFromAdmin, addAnnouncementToUser } = useDatabase()
    const [value, setValue] = useState()

    function closeModal () {
        setShow(false)
    }

    function handleCancel () {
        updateOrderFromAdmin(order, 'reject')
        addAnnouncementToUser(order, 'reject', value)
        setCancel(true)
    }

    return (
        <div className={`${style['modal']} ${show && style['show']}`}>
            <div className={style['wrap']}></div>
            <div className={style['container']}>
                <p className={style['title']}>Bạn chắc chắn muốn hủy đơn hàng này?</p>
                <textarea 
                    name="reject-reason" 
                    placeholder="Lý do:"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                ></textarea>
                <div className={style['btns']}>
                    <button onClick={() => {
                        closeModal()
                        handleCancel()
                    }}>Có</button>
                    <div></div>
                    <button onClick={closeModal}>Không</button>
                </div>
            </div>
        </div>
    )
}
