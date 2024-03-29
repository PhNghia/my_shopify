import React from 'react'
import style from './Loading.module.css'

export default function Loading() {
  return (
    <div className={style['container']}>
      <div className={style["lds-ring"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
