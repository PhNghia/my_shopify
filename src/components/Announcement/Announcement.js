import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import ContentAnnoun from './ContentAnnoun'
import ModalConfirmAction from '../ModalConfirmAction/ModalConfirmAction'
import style from './Announcement.module.css'

export default function Announcement() {

    const { announcements, updateAnnouncement, removeAnnouncement } = useDatabase()
    const [openMails, setOpenMails] = useState([])
    const [activeAnnoun, setActiveAnnoun] = useState(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        // console.log(announcements)
    }, [announcements])

    function handleToggleMail(element, announ) {
        if (!announ.seen) {
            updateAnnouncement(announ, {
                ...announ,
                seen: true
            })
        }
        if (window.innerWidth >= 840) {
            setActiveAnnoun(announ)
        }
        setOpenMails(prev => {
            let isNew = true
            const result = prev.filter(item => {
                if (item.id === announ.orderId) {
                    isNew = false
                    return false
                }
                return true
            })
            if (isNew) {
                result.push({
                    id: announ.orderId,
                    contentElement: element.getElementsByClassName(style['content-announ'])[0]
                })
            }
            return result
        })
    }

    function handleRemoveAll() {
        const announcementsOpened = announcements.filter(announ => announ.seen)
        removeAnnouncement([...announcementsOpened])
        setActiveAnnoun(null)
    }

    return (
        <>
            <div className={style['navbar']}>
                <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
                <h3>Thông Báo</h3>
            </div>


            <div className={style['wrap']}>
                {announcements.length <= 0 && (
                    <div className={style['empty-announcement']}>
                        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png" alt="img announcement empty" />
                        <h4 className={style['empty-title']}>Hiện không có thông báo nào.</h4>
                    </div>
                )}

                {announcements.length > 0 && (<div className={style['container']}>
                    <div className={style['box']}>
                        <div>
                            <div className={style['list-mail']}>
                                {announcements.map(announ => {
                                    return (
                                        <div key={announ.orderId} id={announ.orderId}>
                                            <div className={`${style['skin-announ']} ${announ.seen && style['seen']}`} onClick={e => handleToggleMail(document.getElementById(announ.orderId), announ)}>
                                                {announ.seen || <span className={style['new-mail']}>New</span>}
                                                <div className={style['mail-icon']}>
                                                    {announ.seen || <span className={style['close-mail']}><i className="fa-solid fa-envelope"></i></span>}
                                                    {announ.seen && <span className={style['open-mail']}><i className="fa-solid fa-envelope-open"></i></span>}
                                                </div>
                                                <h3 className={style['mail-title']}>{announ.title}</h3>
                                                <span className={style['mail-time']}>
                                                    {`${new Date(announ.dateSendMail).getDay()}/${new Date(announ.dateSendMail).getMonth() + 1}/${new Date(announ.dateSendMail).getFullYear()}`}
                                                </span>
                                            </div>

                                            <div
                                                className={`${style['content-announ']} ${openMails.find(item => item.id === announ.orderId) && style['show']}`}
                                                style={{
                                                    height: (() => {
                                                        const item = openMails.find(item => item.id === announ.orderId)
                                                        if (item) return item.contentElement.scrollHeight + 'px'
                                                        return '0px'
                                                    })()
                                                }}
                                            >
                                                <ContentAnnoun announ={announ} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className={style['remove-all']} onClick={() => setShow(true)}>
                                <button>Xóa tất cả</button>
                            </div>
                        </div>

                        <div className={style['only-content-announ']}>
                            <ContentAnnoun announ={activeAnnoun} setActiveAnnoun={setActiveAnnoun} />
                        </div>
                    </div>
                </div>)}
            </div>

            <ModalConfirmAction
                show={show}
                closeModal={() => setShow(false)}
                accept={handleRemoveAll}
            >
                <p className={style['modal-confirm-title']}>Bạn chắc chắn xóa tất cả thông báo đã xem?</p>
            </ModalConfirmAction>
        </>
    )
}
