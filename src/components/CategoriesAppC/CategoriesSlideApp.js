import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDatabase } from '../../contexts/DatabaseContext'
import { useReducerContext, setInputOfCategorySearch } from '../../contexts/ReducerContext'
import LayoutApp from '../LayoutAppC/LayoutApp'
import style from './CategoriesApp.module.css'

export default function CategoriesSlideApp() {

  const { categories } = useDatabase()
  const [endLeft, setEndLeft] = useState(false)
  const [endRight, setEndRight] = useState(false)
  const [state, dispatch] = useReducerContext()

  useEffect(() => {
    const carouselElement = document.querySelector(`.${style['carousel']}`)
    let articles = carouselElement.querySelectorAll('a')
    articles = [...articles]
    if (articles.length <= 0) return

    const optionsLeft = {
      root: carouselElement,
      threshold: 0.7
    }

    const optionsRight = {
      root: carouselElement,
      threshold: 0.7
    }

    function callbackOfLeft(entries, observer) {
      if (entries[0].isIntersecting) {
        setEndLeft(true)
      } else {
        setEndLeft(false)
      }
    }

    function callbackOfRight(entries, observer) {
      if (entries[0].isIntersecting) {
        setEndRight(true)
      } else {
        setEndRight(false)
      }
    }

    const observerLeft = new IntersectionObserver(callbackOfLeft, optionsLeft)
    const observerRight = new IntersectionObserver(callbackOfRight, optionsRight)
    const INDEX_OF_LAST_ARTICLE_ON_FIRST_ROW_OF_CAROUSEL_ELEMENT = 12
    const INDEX_OF_FIRST_ARTICLE_ON_FIRST_ROW_OF_CAROUSEL_ELEMENT = 0
    observerLeft.observe(articles[INDEX_OF_FIRST_ARTICLE_ON_FIRST_ROW_OF_CAROUSEL_ELEMENT])
    observerRight.observe(articles[INDEX_OF_LAST_ARTICLE_ON_FIRST_ROW_OF_CAROUSEL_ELEMENT])

    return () => {
      observerLeft.disconnect()
      observerRight.disconnect()
    }
  }, [categories])

  function handleTranslate(trend) {
    const carouselElement = document.querySelector(`.${style['carousel']}`)
    const article = carouselElement.querySelectorAll('a')[0]
    const boundingRect = article.getBoundingClientRect()
    const rangeTranslate = trend === 'left' ? boundingRect.width * (-3) : boundingRect.width * (3)
    carouselElement.scrollBy({ left: rangeTranslate, behavior: 'smooth' })
  }

  return (
    <>
      <LayoutApp />

      <hr></hr>

      <div className={style['container']}>
        <div className={style['slide-container']}>
          <div className={style['slide-title']}>
            <span>Danh mục</span>
          </div>
          <div className={style['category-container']}>
            <div className={style["carousel"]}>
              {categories.map(category => (
                <Link to={`/category/${category.id}`} key={category.id} className={style['article']} onClick={() => dispatch(setInputOfCategorySearch(category.name))}>
                  <div className={style['image']}>
                    <img src={category.imgUrl} alt={category.name} />
                  </div>
                  <div className={style['name']}>
                    <p>{category.name}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className={style['btn-transform']}>
              <button className={`${style['left']} ${endLeft ? style['end'] : ''}`} onClick={() => handleTranslate('left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button className={`${style['right']} ${endRight ? style['end'] : ''}`} onClick={() => handleTranslate('right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
