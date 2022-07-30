import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDatabase } from '../../../contexts/DatabaseContext'
import style from './AdminOrders.module.css'

export default function AdminOrders() {

  const { orders, removeOrderFromAdmin } = useDatabase()
  const navigate = useNavigate()

  function handleShowOrder (order) {
    navigate(`order/${order.orderId}`)
  }

  return (
    <>
      <div className={style['container']}>
        <table>
          <thead>
            <tr className={style['order']}>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Giá trị-VNĐ</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className={style['order']}>
            {orders.map(order => (
              <tr key={order.orderId} className={style['order']}>
                <td>{order.uid}</td>
                <td>{new Date(order.date).toString().slice(0, new Date(order.date).toString().indexOf('GMT'))}</td>
                <td>{Number(order.totalPrice).toLocaleString('en-US').replaceAll(',', '.')}</td>
                <td>{(() => {
                  switch (order.typePay) {
                    case 'money': 
                      return 'Tiền mặt'
                    case 'banking':
                      return 'Chuyển khoản'  
                  }
                })()}</td>
                <td>{(() => {
                  switch (order.status) {
                    case 'waiting': 
                      return 'Đang xử lí'
                    case 'resolve':
                      return 'Đã nhận'
                    case 'reject':
                      return 'Đã hủy'  
                  }
                })()}</td>
                <td className={style['actions']}>
                  <button
                    className={style['setting-btn']}
                    onClick={() => handleShowOrder(order)}
                  >
                    Xem
                  </button>
                  <button
                    className={style['delete-btn']}
                    onClick={() => removeOrderFromAdmin(order)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
