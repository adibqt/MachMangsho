import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext' // <-- ADD THIS LINE

const Categories = () => {

    const {navigate} = useAppContext();
  return (
    <div className='mt-8 sm:mt-16'>
       <p className='text-lg sm:text-2xl md:text-3xl font-medium'>Categories</p>
       <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-6'>
        
        {categories.map((category, index) =>(
            <div key={index} className='group cursor-pointer py-3 sm:py-4 md:py-5 px-2 sm:px-3 gap-1 sm:gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{backgroundColor: category.bgColor}}
            onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0, 0);
                }}>
                <img src={category.image} alt ={category.text} className='group-hover:scale-105 transition w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain'/>
                <p className='text-xs sm:text-sm font-medium text-center leading-tight'>{category.text}</p> 
            </div>
        
        ))}
       
       </div>
    </div>
  )
}

export default Categories