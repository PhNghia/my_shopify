import React from 'react'
import style from './ModalConfirmAction.module.css'

export default function ModalConfirmAction({ show, children, ...callbacks }) {

    /**
     * callbacks = {
     *  closeModal: Function,
     *  accept: Function execute when click accept button
     * }
     * 
     */

    return (
        <div className={`${style['modal']} ${show && style['show']}`}>
            <div className={style['wrap']}></div>
            <div className={style['container']}>
                {children}
                <div className={style['btns']}>
                    <button onClick={() => {
                        callbacks.closeModal()
                        callbacks.accept()
                    }}>Có</button>
                    <div></div>
                    <button onClick={callbacks.closeModal}>Không</button>
                </div>
            </div>
        </div>
    )
}
