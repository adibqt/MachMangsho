import React, { useEffect } from 'react' // Add useEffect here
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'



const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const [userMenuOpen, setUserMenuOpen] = React.useState(false)
    const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios} = useAppContext()

    const logout = async () => {
        try {
            const { data } = await axios.post('/api/user/logout');
            if (data?.success) {
                toast.success('Logged out successfully');
            } else {
                toast.error(data?.message || 'Logout failed');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Logout failed');
        } finally {
            setUser(null);
            navigate('/');
        }
    }

    useEffect(() => {
        if(searchQuery.length > 0) {
            navigate('/products');
        }
    }, [searchQuery])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu') && !event.target.closest('.mobile-menu-container')) {
                setUserMenuOpen(false);
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
     <nav className="flex items-center justify-between px-3 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-3 sm:py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to ='/' onClick={()=> setOpen(false)} className="flex items-center gap-2">
                <img className="h-39" src={assets.Mach} alt="Mach" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Product</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=> setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src ={assets.search_icon} alt='search' className = 'w-4 h-4'/>
    
                </div>

                <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
                    <img src = {assets.nav_cart_icon} alt = 'cart' className = 'w-6 opacity-80'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#c9595a] w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ?(<button onClick={()=>setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-[#c9595a] hover:bg-[#b14c4d] transition text-white rounded-full">
                    Login
                </button>) :
                (
                    <div className='relative user-menu'>
                    <img 
                        src={assets.profile_icon} 
                        className='w-10 cursor-pointer' 
                        alt="profile" 
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                    <ul className={`${userMenuOpen ? 'block' : 'hidden'} absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2.5 w-36 rounded-md text-sm z-50`}>
                        {/* User name header */}
                        <li className='px-3 pb-2 text-gray-700 font-medium border-b border-gray-100 truncate'>
                            {user?.name || 'User'}
                        </li>
                        <li onClick={()=> {navigate("my-orders"); setUserMenuOpen(false);}} className='p-2 pl-3 hover:bg-primary/10 cursor-pointer border-b border-gray-100'>My Orders</li>
                        <li onClick={() => {logout(); setUserMenuOpen(false);}} className='p-2 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
                    </ul>
                    </div> 
                )

                }
            </div>
            <div className='flex items-center gap-6 sm:hidden'>
                 <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
                    <img src = {assets.nav_cart_icon} alt = 'cart' className = 'w-6 opacity-80'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#c9595a] w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

            <button onClick={() => setOpen(!open)} aria-label="Menu" className="mobile-menu-container">
                {/* Menu Icon SVG */}
                <img src ={assets.menu_icon} alt = 'menu'/>
            </button>
            </div>

            {/* Mobile Menu */}
            { open && (
            <div className={`${open ? 'flex' : 'hidden'} mobile-menu-container absolute top-[60px] left-0 w-full bg-white shadow-lg border-t border-gray-200 py-4 flex-col items-start gap-3 px-5 text-sm md:hidden z-50`}>
              <NavLink to='/' onClick={() => setOpen(false)} className="block py-2 w-full border-b border-gray-100 hover:text-[#c9595a] transition-colors">Home</NavLink>
               <NavLink to='/products' onClick={() => setOpen(false)} className="block py-2 w-full border-b border-gray-100 hover:text-[#c9595a] transition-colors">All Products</NavLink>
               {user && (
               <NavLink to='/my-orders' onClick={() => setOpen(false)} className="block py-2 w-full border-b border-gray-100 hover:text-[#c9595a] transition-colors">My Orders</NavLink>
               )}
               <NavLink to='/contact' onClick={() => setOpen(false)} className="block py-2 w-full border-b border-gray-100 hover:text-[#c9595a] transition-colors">Contact</NavLink>
               
               {/* Search bar for mobile */}
               <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 py-2 rounded-full w-full mt-2">
                    <input onChange={(e)=> setSearchQuery(e.target.value)} className="py-1 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src ={assets.search_icon} alt='search' className = 'w-4 h-4'/>
                </div>
                
                {!user ? (
                    <button
                        onClick={() => {
                            setOpen(false)
                            setShowUserLogin(true);
                        }}
                        className="cursor-pointer px-6 py-2 mt-3 bg-[#c9595a] hover:bg-[#b14c4d] transition text-white rounded-full text-sm w-full"
                    >
                        Login
                    </button>
                ) : (
                    <div className="flex flex-col gap-2 w-full mt-2">
                        <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                            <img src={assets.profile_icon} className="w-8 h-8" alt="profile" />
                            <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                setOpen(false);
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-[#c9595a] hover:bg-[#b14c4d] transition text-white rounded-full text-sm w-full"
                        >
                            Logout
                        </button>
                    </div>
                )}
                
            </div>
    )}

        </nav>
  )
}

export default Navbar
