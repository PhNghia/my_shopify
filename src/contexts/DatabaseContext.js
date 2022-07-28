import React, { useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { database } from '../firebase'
import { ref, set, onValue, update, remove } from 'firebase/database'
import { v4 } from 'uuid' 

const DatabaseContext = React.createContext()

export function useDatabase() {
    return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {

    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [categories, setCategories] = useState([])
    const [carts, setCarts] = useState([])
    const { currentUser } = useAuth()

    useEffect(() => {
        if (currentUser) {
            getCurrentUserCarts()
            return
        }

        setCarts([])

    }, [currentUser])

    useEffect(() => {
        getProducts()
        getCategories()
    }, [])

    function loginWithAdmin (email, password) {
        return new Promise((resolve, reject) => {
            const adminRef = ref(database, "admin")
            onValue(adminRef, (snapshot) => {
                const data = snapshot.val()
                if (!data || data !== email) reject('Login failed!')
                if (password !== 'vannghia0914') reject('Login failed!')
                resolve(email)
            })
        })
    }

    function getOrdersFromAdmin () {
        const ordersRef = ref(database, `orders`)
        onValue(ordersRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const orders = [...Object.keys(data)].map(key => ({
                    orderId: key,
                    ...data[key]
                }))
                setOrders([...orders])
            } else {
                setOrders([])
            }
        })
    }

    function updateOrderFromAdmin (order, status) {
        const orderPath = `orders/${order.orderId}`
        update(ref(database), {
            [orderPath] : { ...order, status }
        })
    }

    function removeOrderFromAdmin (order) {
        const orderRef = ref(database, `orders/${order.orderId}`)
        remove(orderRef)
    }

    function getProducts() {
        const productsRef = ref(database, "products")
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                setProducts([...Object.values(data)])
            }
        })
    }

    function getCategories () {
        const categoriesRef = ref(database, "categories")
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const keys = [...Object.keys(data)]
                const result = keys.map(key => ({
                    id: key,
                    name: data[key].name,
                    imgUrl: data[key].imgUrl,
                    products: data[key].products
                }))
                setCategories(result)
            }
        })
    }

    function addProductFromAdmin(categoryId, product) {
        const productRef = ref(database, `categories/${categoryId}/products/${product.id}`)
        set(productRef, { ...product })
    }

    function updateProductFromAdmin(categoryId, product) {
        const productPath = `categories/${categoryId}/products/${product.id}`
        update(ref(database), {
            [productPath]: product
        })
    }

    function deleteProductFromAdmin(categoryId, product) {
        remove(ref(database, `categories/${categoryId}/products/${product.id}`))
    }

    function getCurrentUserCarts() {
        const currentUserCartsRef = ref(database, "carts/" + currentUser.uid)
        onValue(currentUserCartsRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                setCarts([...Object.values(data)])
            } else {
                setCarts([])
            }
        })
    }

    function addCartFromCurrentUser(product, quantity) {
        const cartRef = ref(database, `carts/${currentUser.uid}/${product.id}`)
        const oldProduct = carts.find(item => item.id === product.id)
        if (oldProduct) {
            increaseQuantityCartItem(oldProduct, quantity)
        } else {
            set(cartRef, { ...product, quantity, isChoosed: false })
        }
    }

    function increaseQuantityCartItem(product, quantity) {
        const path = `carts/${currentUser.uid}/${product.id}`
        update(ref(database), {
            [path]: { ...product, quantity: quantity ? product.quantity + quantity : product.quantity + 1 }
        })
    }

    function decreaseQuantityCartItem(product) {
        if (product.quantity <= 1) return
        const path = `carts/${currentUser.uid}/${product.id}`
        update(ref(database), {
            [path]: { ...product, quantity: product.quantity - 1 }
        })
    }

    function updateCartFromUser (product ,objectNewProp) {
        const path = `carts/${currentUser.uid}/${product.id}`
        update(ref(database), {
            [path]: { ...product, ...objectNewProp }
        })
    }

    function deleteProductInSideCartFromUser (product) {
        remove(ref(database, `carts/${currentUser.uid}/${product.id}`))
    }

    function addOrderFromUser (order) {
        const randomId = v4()
        const orderRef = ref(database, `orders/${currentUser.uid}__${randomId}`)
        const { products, ...orderProp} = { ...order, uid: currentUser.uid }
        set(orderRef, { ...orderProp })
        products.forEach(product => {
            const productsRefOfOrder = ref(database, `orders/${currentUser.uid}__${randomId}/products/${product.id}`)
            set(productsRefOfOrder, { ...product }) 
        })
    }

    const value = {
        orders,
        products,
        carts,
        categories,
        getOrdersFromAdmin,
        updateOrderFromAdmin,
        removeOrderFromAdmin,
        getProducts,
        addProductFromAdmin,
        getCurrentUserCarts,
        addCartFromCurrentUser,
        increaseQuantityCartItem,
        decreaseQuantityCartItem,
        loginWithAdmin,
        updateProductFromAdmin,
        deleteProductFromAdmin,
        addOrderFromUser,
        updateCartFromUser,
        deleteProductInSideCartFromUser
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}
