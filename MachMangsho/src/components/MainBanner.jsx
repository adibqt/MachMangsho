
import React from 'react'
import { assets } from '../assets/assets'

const MainBanner = () => {
  return (
    <div className='relative'>

     <img src = {assets.main_banner_bg} alt="Main Banner" className='w-full hidden md:block ' />
    <img src = {assets.main_banner_bg_sm} alt="Main Banner" className='w-full md:hidden ' />
      </div>
  )
}

export default MainBanner
