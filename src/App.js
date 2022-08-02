import './App.css';
import { useAuth } from './contexts/AuthContext'
import { useDatabase } from './contexts/DatabaseContext';
import { useReducerContext } from './contexts/ReducerContext'
import Signup from './components/Signup'
import Login from './components/Login'
import Loading from './components/Loading'
import Home from './components/Home'
import CategoriesSlideApp from './components/CategoriesAppC/CategoriesSlideApp'
import Products from './components/Products/Products.js'
import ProductArticle from './components/Products/ProductArticle'
import UserCart from './components/UserCart/UserCart'
import OrderProductsConfirm from './components/OrderProductsConfirm/OrderProductsConfirm'
import UserProfile from './components/UserProfile/UserProfile'
import AdminPage from './components/Admin/AdminPage';
import ShowAllOfOrder from './components/Admin/ShowAllOfOrder/ShowAllOfOrder';
import AdminProducts from './components/Admin/AdminProducts'
import { Orders } from './components/Admin/index.js'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';

function App() {
  const { categories, orders, testStatusAdmin, getOrdersFromAdmin } = useDatabase()
  const { setCurrentAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducerContext()

  // console.log(state)

  useEffect(() => {
    if (categories.length === 0) {
      setLoading(true)
      return
    }

    setLoading(false)
  }, [categories])

  useEffect(() => {
    function setupForAdmin () {
      if (window.location.hash.includes('admin')) {
        testStatusAdmin(setCurrentAdmin)
        getOrdersFromAdmin()
      }
    }

    window.addEventListener('hashchange', setupForAdmin)
    window.addEventListener('load', setupForAdmin)
    
    return () => {
      window.removeEventListener('hashchange', setupForAdmin)
      window.removeEventListener('load', setupForAdmin)
    }
  }, [])

  if (loading) return <Loading />

  return (
    <HashRouter>
      <Routes>
        <Route path="/" exact element={<Home />}>
          <Route index element={<CategoriesSlideApp />} />
          {categories.map(category => (<Route key={category.id} path={`category/${category.id}`} element={<Products categoryId={category.id} />} />))}
          {categories.map(category => {
            const productsKey = category.products ? [...Object.keys(category.products)] : []
            return productsKey.map(key => (<Route key={key} path={`category/${category.id}/${key}`} element={<ProductArticle categoryId={category.id} productId={key} />} />))
          })}
          <Route path={`tags`} element={<Products inputSearchValue={state.inputOfCustomSearch} />} />
          {state.productsOfCustomSearch.map(product => <Route key={product.id} path={`tags/${product.id}`} element={<ProductArticle categoryId={product.categoryId} productId={product.id} />}/>)}
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_cart" element={<UserCart />} />
        <Route path="/confirm_order" element={<OrderProductsConfirm />} />
        <Route path="/user_profile" element={<UserProfile />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Orders />} />
          {categories.map(category => (<Route key={category.id} path={`category/${category.id}`} element={<AdminProducts id={category.id} />} />))}
          {orders.map(order => (<Route key={order.orderId} path={`order/${order.orderId}`} element={<ShowAllOfOrder order={order}/>}/>))}
        </Route> 
      </Routes>
    </HashRouter>
  );
}

export default App;
