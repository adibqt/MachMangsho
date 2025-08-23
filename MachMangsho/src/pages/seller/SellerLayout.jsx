import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const SellerLayout = () => {

    const { logoutSeller } = useAppContext();

    

   
   

    const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
];

    const logout = async () => {
        // Use context helper to clear cookie on the server and update state
        await logoutSeller();
    }

    return (
        <>
            <div className="flex items-center justify-between px-2 md:px-4 border-b border-gray-300 py-1.5 bg-[#fbeaea]" style={{ minHeight: '48px' }}>

                <Link to='/' >
                    <img src= {assets.Mach} alt="logo" className="cursor-pointer w-34 md:w-38" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p style={{ color: '#c9595a' }}>Hi! Admin</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1' style={{ color: '#c9595a', borderColor: '#c9595a' }}
  onMouseEnter={e => e.target.style.backgroundColor = '#fbeaea'}
  onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
>
  Logout
</button>
                </div>
            </div>
            <div className="flex">
                <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item) => (
    <NavLink
      to={item.path}
      key={item.name}
      {...(item.path === "/seller" ? { end: true } : {})}
      className={({isActive})=>`flex items-center py-3 px-4 gap-3 
        ${isActive ? "border-r-4 md:border-r-[6px] border-[#c9595a] bg-[#fbeaea] text-[#c9595a]" : "hover:bg-[#fbeaea] border-white"}
      `}
    >
                            <img src={item.icon} alt=" " className="w-7 h-7" style={{ filter: 'invert(32%) sepia(92%) saturate(747%) hue-rotate(-16deg) brightness(92%) contrast(91%)' }} />
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet/>
            </div>
        </>
    );
};

export default SellerLayout;

