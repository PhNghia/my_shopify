import React, { useRef, useEffect } from 'react'
import style from './Modal.module.css'

export default function ModalAddSuccess({ show, setShow, children }) {
    const modalRef = useRef()

    useEffect(() => {
        let hide
        if (show) {
            hide = setTimeout(() => {
                setShow(false)
            }, 1000)
        }

        function handleRemoveSTO () {
            clearTimeout(hide)
            setShow(false)
        }

        modalRef.current.addEventListener('click', handleRemoveSTO)

        return () => {
            if (modalRef.current) modalRef.current.removeEventListener('click', handleRemoveSTO)
        }
    }, [show])

    return (
        <div className={`${style['modal']} ${show && style['show']}`} ref={modalRef}>
            <div className={style['wrap']}></div>
            <div className={style['container']}>
                <div className={style['content']}>
                    <p>{children}</p>
                    <span><i className="fa-solid fa-check"></i></span>
                </div>
            </div>
        </div>
    )
}
