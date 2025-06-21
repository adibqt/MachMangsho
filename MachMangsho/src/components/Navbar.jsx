import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

function Navbar() {
    const [open, setOpen] = React.useState(false)
    const {user, setUser, setShowUserLogin, navigate} = useAppContext()

    const logout = async () => {
        setUser(null);
        navigate('/');
    }
  return (
     <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to ='/' >
                <img className="h-39" src={assets.Mach} alt="Mach" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <a href="#">Home</a>
                <a href="#">All Product</a>
                <a href="#">Contact</a>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src ={assets.search_icon} alt='search' className = 'w-4 h-4'/>
    
                </div>

                <div className="relative cursor-pointer">
                    <img src = {assets.nav_cart_icon} alt = 'cart' className = 'w-6 opacity-80'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#c9595a] w-[18px] h-[18px] rounded-full">3</button>
                </div>

                <button className="cursor-pointer px-8 py-2 bg-[#c9595a] hover:bg-[#b14c4d] transition text-white rounded-full">
                    Login
                </button>
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <img src ={assets.menu_icon} alt = 'menu'/>
            </button>

            {/* Mobile Menu */}
            { open && (
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
              <NavLink to='/' onClick={() => setOpen(false)} className="block">Home</NavLink>
               <NavLink to='/products' onClick={() => setOpen(false)} className="block">All Product</NavLink>
               {user &&
               <NavLink to='/products' onClick={() => setOpen(false)} className="block">My Orders</NavLink>
               }
               <NavLink to='/' onClick={() => setOpen(false)} className="block">Contact</NavLink>
                
                {!user ? (
                    <button onClick ={()=>{
                        setOpen(false)
                        setShowUserLogin(true);
                    }} className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">Login</button>
                ) : (
                <button onCick ={logout} className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">Logout</button>)}
                
            </div>
    )}

        </nav>
  )
}

export default Navbar
