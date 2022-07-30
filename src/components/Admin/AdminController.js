import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import ModalCategory from './ModalCategory'
import style from './Admin.module.css'

export default function AdminController({ controller }) {

  const { categories, removeCategoryFromAdmin } = useDatabase()
  const location = useLocation()
  const [selectedManagement, setSelectedManagement] = useState(() => {
    const pathname = location.pathname // default: /admin
    if (pathname === '/admin') return 'orders'
    if (pathname.includes('category')) return 'categories'
  })
  const [selectedChildOfManagement, setSelectedChildOfManagement] = useState()
  const [payloadForModal, setPayloadForModal] = useState({ type: '' })
  const [statusRemove, setStatusRemove] = useState(false)
  const [checkedRemove, setCheckedRemove] = useState([])
  const [statusUpdate, setStatusUpdate] = useState(false)

  useEffect(() => {
    switch (selectedManagement) {
      case 'categories':
        const pathname = location.pathname
        setSelectedChildOfManagement(pathname.slice(pathname.lastIndexOf('/') + 1))
        break
      default:
        setSelectedChildOfManagement('')
    }
  }, [selectedManagement])

  useEffect(() => {
    if (statusRemove) {
      setCheckedRemove(() => {
        const result = categories.map(category => ({
          id: category.id,
          checked: false
        }))
        return result
      })
    }

  }, [statusRemove, categories])

  useEffect(() => {
    const categoriesAccording = document.querySelector(`.${style['categories']}`)
    if (categoriesAccording.matches(`.${style['show']}`)) {
      categoriesAccording.style.height = categoriesAccording.scrollHeight + 'px'
    }
  }, [categories])

  function handleRemoveCategories() {
    checkedRemove.forEach(item => {
      if (item.checked) {
        removeCategoryFromAdmin(item.id)
      }
    })
  }

  function handleToggleAccording(e) {
    if (e.target.matches(`.${style['title-according']}`)) {
      toggle(e.target.nextElementSibling, e.target)
      return
    }

    const titleAccordingElement = findParent(e.target)
    toggle(titleAccordingElement.nextElementSibling, titleAccordingElement)
  }

  return (
    <>
      <div className={`${style['controller-container']} ${controller && style['show']}`} >
        <div className={style['controller-content']}>
          <div
            id="orders"
            className={selectedManagement === "orders" ? style['active'] : ''}
          >
            <Link to="/admin" onClick={(e) => setSelectedManagement("orders")}>Quản lí đơn hàng</Link>
          </div>

          <div
            id="categories"
            className={selectedManagement === "categories" ? style['active'] : ''}
          >
            <p
              className={style['title-according']}
              onClick={(e) => {
                setSelectedManagement("categories")
                handleToggleAccording(e)
              }}
            >
              Quản lí danh mục
              <span><i className="fa-solid fa-angle-right"></i></span>
            </p>
            <ul className={`${style['categories']} ${style['according']}`}>
              {[...categories].sort((a, b) => {
                const nameA = a.name.toLowerCase()
                const nameB = b.name.toLowerCase()

                if (nameA > nameB) return 1
                if (nameA < nameB) return -1
                return 0
              }).map(category => (
                <li
                  key={category.id}
                  className={category.id === selectedChildOfManagement ? style['li-active'] : undefined}
                >
                  {statusRemove && (
                    <input
                      className={style['check-remove']}
                      type="checkbox"
                      checked={(() => {
                        const itemChecked = checkedRemove.find(item => item.id === category.id)
                        if (itemChecked) return itemChecked.checked
                      })()}
                      onChange={() => setCheckedRemove(prev => {
                        return prev.map(item => {
                          if (item.id !== category.id) return item
                          return {
                            ...item,
                            checked: !item.checked
                          }
                        })
                      })}
                    />
                  )}

                  <Link to={"category/" + category.id} onClick={() => {
                    setSelectedManagement("categories")
                    setSelectedChildOfManagement(category.id)
                  }}>{category.name}</Link>

                  {statusUpdate && <span className={style['update-pen']} onClick={() => setPayloadForModal({ type: "update", category })}><i className="fa-solid fa-pencil"></i></span>}
                </li>
              ))}
              <li>
                {statusRemove || <i className="fa-solid fa-plus" onClick={() => setPayloadForModal({ type: "add" })}></i>}
                {statusRemove || <i className="fa-solid fa-pen-clip" onClick={() => setStatusUpdate(prev => !prev)}></i>}
                {statusRemove || <i className="fa-solid fa-trash-can" onClick={() => setStatusRemove(true)}></i>}
                {statusRemove && <i className="fa-solid fa-xmark" onClick={() => setStatusRemove(false)} style={{ color: 'red' }}></i>}
                {statusRemove && <i className="fa-solid fa-check" onClick={handleRemoveCategories} style={{ color: 'rgb(14, 238, 62)' }}></i>}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {payloadForModal.type === "add" && <ModalCategory payload={payloadForModal} setPayloadForModal={setPayloadForModal} />}
      {payloadForModal.type === "update" && <ModalCategory payload={payloadForModal} setPayloadForModal={setPayloadForModal} />}
    </>
  )
}

function findParent(element) {
  let parent = element.parentElement
  while (parent) {
    if (parent.matches(`.${style['title-according']}`)) return parent
    parent = parent.parentElement
  }
}

function toggle(accordingElement, titleAccordingElement) {
  accordingElement.classList.toggle(style['show'])
  if (accordingElement.matches(`.${style['show']}`)) {
    titleAccordingElement.querySelector('span').style.transform = 'rotate(90deg)'
    accordingElement.style.height = accordingElement.scrollHeight + 'px'
  } else {
    titleAccordingElement.querySelector('span').style.transform = 'rotate(0deg)'
    accordingElement.style.height = 0
  }
}
