import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import style from './Admin.module.css'

export default function AdminController({ controller }) {

  const { categories } = useDatabase()
  const [selectedManagement, setSelectedManagement] = useState('orders')

  function activeItemOfList (e) {
    e.stopPropagation()
    
    let parentElement = e.target.parentElement
    while (parentElement) {
      if (parentElement.matches('div')) break
      parentElement = parentElement.parentElement
    } 

    setSelectedManagement(parentElement.id)

    const liActive = document.querySelector(`li.${style['li-active']}`)
    if (liActive) liActive.classList.remove(style['li-active'])
    if (e.target.matches('a')) {
      e.target.parentElement.classList.add(style['li-active'])
    }
  }

  function handleSetManagement(e, type) {
    setSelectedManagement(type)
    activeItemOfList(e)
  }

  return (
    <>
      <div className={`${style['controller-container']} ${controller && style['show']}`} >
        <div className={style['controller-content']}>
          <div
            id="orders"
            className={selectedManagement === "orders" ? style['active'] : ''}
            onClick={(e) => handleSetManagement(e, "orders")}
          >
            <Link to="/admin">Quản lí đơn hàng</Link>
          </div>
          <div
            id="categories"
            className={selectedManagement === "categories" ? style['active'] : ''}
            onClick={(e) => handleSetManagement(e, "categories")}
          >
            <p>Quản lí danh mục</p>
            <ul className={style['categories']}>
              {categories.map(category => (
                <li key={category.id}><Link to={"category/" + category.id} onClick={activeItemOfList}>{category.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
