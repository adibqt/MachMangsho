import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';

const MyOrders = () => {
 
    const [myOrders, setMyOrders] = useState([]);
    const {currency} = useAppContext();

    const fetchMyOrders = async () => {
        try {
            const {data} = await axios.get('/api/order/user')
            if(data.success){
                setMyOrders(data.orders);
            }
        } catch (error) {
            console.error(error);
            
        }

    }

    useEffect(()=>{
        if(user){
        fetchMyOrders();
        }

    },[user])
  return (
    <div className='mt-16 pb-16'>
        <div className='flex flex-col items-end w-max mb-8'>
            <span className="text-2xl font-medium uppercase text-gray-900">My <span className="relative inline-block pb-1">Orders
                <span className="absolute left-0 w-full h-0.5 bg-[#c9595a] rounded-full" style={{bottom: '-6px'}}></span>
            </span></span>
        </div>
        {myOrders.map((order, index)=>(
            <div key={index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
                <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                    <span>OrderId : {order._id}</span>
                    <span className="text-black font-medium">Payment : {order.paymentType}</span>
                    {(() => {
  const subtotal = order.items.reduce((acc, item) => acc + ((item.product.offerPrice ?? item.product.price) * Number(item.quantity ?? item.quatity ?? 1)), 0);
  const deliveryCharge = 40;
  const total = subtotal + deliveryCharge;
  return (
    <span className="text-[#c9595a] font-medium flex flex-col items-end gap-0.5 text-right text-[17px]">
      <span className="text-[#c9595a] font-medium">Subtotal: {currency}{subtotal}</span>
      <span className="text-[#c9595a] font-medium">Delivery Charge: {currency}{deliveryCharge}</span>
      <span className="text-[#c9595a] font-medium">Total Amount: {currency}{total}</span>
    </span>
  );
})()}

                </p>
                {order.items.map((item, index)=>(
                    <div key={index} 
                    className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                        <div className='flex items-center mb-4 md:mb-0' >
                            <div className='bg-primary/10 p-4 rounded-lg'>
                                <img src={item.product.image[0]} alt="" className='w-16 h-16' />
                            </div>
                            <div className='ml-4'>
                                <h2 className='text-xl font-medium text-gray-800'>{item.product.name}</h2>
                                <p> Category: {item.product.category}</p>
                                </div>
                        </div>

                       <div className='font-medium'>
    <p className="text-black font-medium">Quantity: <span className="text-black font-medium">{item.quatity || "1"}</span></p>
    <p className="text-black font-medium">Status: <span className="text-black font-medium">{order.status}</span></p>
    <p className="text-black font-medium">Date: <span className="text-black font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
</div>
                       <p className='text-lg font-medium'>
    <span className="text-black">Amount:</span><span className="text-black"> {currency}{Number(item.product.offerPrice ?? item.product.price) * Number(item.quantity ?? item.quatity ?? 1)}</span>
</p>
                       

                    </div>
                ))}

            </div>
        ))}
        
    </div>
  )
}

export default MyOrders