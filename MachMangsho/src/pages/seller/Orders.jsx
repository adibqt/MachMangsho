import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';

const Orders = () => {

    const {currency} = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () =>{
        setOrders(dummyOrders);

    };

    useEffect(()=>{
        fetchOrders();

    },[]);
  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
    <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {Array.isArray(orders) && orders.length > 0 ? orders.map((order, index) => (
  <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
    <div className="flex gap-5 max-w-80">
      <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
      <div>
        {Array.isArray(order.items) && order.items.length > 0 ? order.items.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <p className="font-medium">
              {item.product && item.product.name}{" "}
              <span className="text-primary">x {item.quantity}</span>
            </p>
          </div>
        )) : <p className="text-gray-400">No items</p>}
      </div>
    </div>

    <div className="text-sm md:text-base text-black/60">
      <p className='text-black/80'>
        {order.address && order.address.firstName} {order.address && order.address.lastName}
      </p>
      <p>{order.address && order.address.street}, {order.address && order.address.city}</p>
      <p>{order.address && order.address.state}, {order.address && order.address.zipcode}, {order.address && order.address.country}</p>
      <p>{order.state && order.state.phone}</p>
    </div>

    <p className="font-medium text-lg my-auto" style={{ color: '#c9595a' }}>
      {currency}{order.amount ?? ''}
    </p>

    <div className="flex flex-col text-sm md:text-base text-black/60">
      <p>Method: {order.paymentType ?? ''}</p>
      <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
      <p>Payment: {order.isPaid ? "Paid" : order.isPaid === false ? "Pending" : ''}</p>
    </div>
  </div>
)) : (
  <div className="text-gray-400 text-center py-10">No orders found.</div>
)}
        </div>
        </div>
  )
}

export default Orders;