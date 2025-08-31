import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// Input Field Component
const InputField =({type, placeholder, name, handleChange, address})=>(
    <input 
    className='w-full px-2 py-2.5 border border-gray-400 rounded outline-none text-gray-500 transition focus:border-[#c9595a]' 
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange} 
    value={address[name]}
    required
    />
)

const AddAddress = () => {
    const { axios, user, navigate } = useAppContext();
    const BD_DIVISIONS = [
        'Dhaka',
        'Chattogram',
        'Rajshahi',
        'Khulna',
        'Barishal',
        'Sylhet',
        'Rangpur',
        'Mymensingh',
    ];
    const DIVISION_DISTRICTS = {
        Dhaka: ['Dhaka','Gazipur','Kishoreganj','Manikganj','Munshiganj','Narayanganj','Narsingdi','Tangail','Faridpur','Gopalganj','Madaripur','Rajbari','Shariatpur'],
        Chattogram: ["Chattogram","Cox's Bazar","Cumilla","Feni","Noakhali","Lakshmipur","Brahmanbaria","Chandpur","Khagrachhari","Rangamati","Bandarban"],
        Rajshahi: ['Rajshahi','Chapai Nawabganj','Naogaon','Natore','Pabna','Sirajganj','Bogura','Joypurhat'],
        Khulna: ['Khulna','Bagerhat','Satkhira','Jashore','Narail','Magura','Jhenaidah','Chuadanga','Kushtia','Meherpur'],
        Barishal: ['Barishal','Bhola','Jhalokati','Pirojpur','Patuakhali','Barguna'],
        Sylhet: ['Sylhet','Moulvibazar','Habiganj','Sunamganj'],
        Rangpur: ['Rangpur','Dinajpur','Thakurgaon','Panchagarh','Nilphamari','Lalmonirhat','Kurigram','Gaibandha'],
        Mymensingh: ['Mymensingh','Jamalpur','Netrokona','Sherpur'],
    };

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        division: '',
        district: '',
        zipCode: '', 
        country: '',
        phone: '',

    })

    const handleChange = (e)=> {
        const { name, value } = e.target;
        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]: value,

        }))
        

    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // Minimal client validations to block 1-letter or empty fields before hitting server
        const trim = (v) => (v ?? '').toString().trim();
        const { firstName, lastName, email, street, city, division, district, zipCode, country, phone } = address;
        if (trim(firstName).length < 2) return toast.error('First name must be at least 2 characters');
        if (trim(lastName).length < 2) return toast.error('Last name must be at least 2 characters');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trim(email))) return toast.error('Invalid email');
        if (trim(street).length < 3) return toast.error('Street must be at least 3 characters');
        const cityNorm = trim(city).replace(/\.+$/, '');
        if (cityNorm.length < 2) return toast.error('City must be at least 2 characters');
        if (trim(division).length < 2) return toast.error('Division must be at least 2 characters');
        if (!division) return toast.error('Please select a division');
        if (!district) return toast.error('Please select a district');
        if (division && district) {
            const list = DIVISION_DISTRICTS[division] || [];
            if (!list.includes(district)) return toast.error('Selected district does not belong to the chosen division');
        }
        if (!/^\d{3,10}$/.test(trim(zipCode))) return toast.error('ZIP/Postal code must be 3-10 digits');
        if (trim(country).length < 2) return toast.error('Country must be at least 2 characters');
        if (!/^\+?[0-9\s-]{7,15}$/.test(trim(phone))) return toast.error('Phone must be 7-15 digits');
        try {
            // Map division to state for backend compatibility
            const payload = { ...address, state: address.division };
            delete payload.division;
            const { data } = await axios.post('/api/address/add', { address: payload });

            if(data.success) {
                toast.success(data.message);
                navigate('/cart');
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if(!user) {
            navigate('/cart');
        }


    },[]);
  return (
    <div className='mt-16 pb-16'>
        <p className='text-2xl md:text-3xl text-gray-500'>Add Ship<span className="relative inline-block pb-1">ping
    <span className="absolute left-0 w-full h-0.5 bg-[#c9595a] rounded-full" style={{bottom: '-6px'}}></span>
</span> <span className='font-semibold' style={{color:'#c9595a'}}>Address</span></p>
        <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
            <div className='flex-1 max-w-md'>
                <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                    <div className='grid grid-cols-2 gap-4'>
                        <InputField handleChange={handleChange} address={address} name='firstName' type="text" placeholder="First Name"/>
                         <InputField handleChange={handleChange} address={address} name='lastName' type="text" placeholder="Last Name"/>
                    </div>

                    <InputField handleChange={handleChange} address={address} name='email' type="email" placeholder="Email Address"/>
                    <InputField handleChange={handleChange} address={address} name='street' type="text" placeholder="Street"/>

                                                            <div className='grid grid-cols-2 gap-4'>
                                                                    <InputField handleChange={handleChange} address={address} name='city' type="text" placeholder="City"/>
                                                                    <select
                                                                        name="division"
                                                                        className='w-full px-2 py-2.5 border border-gray-400 rounded outline-none text-gray-500 transition focus:border-[#c9595a] bg-white'
                                                                        value={address.division}
                                                                        onChange={(e) => {
                                                                            handleChange(e);
                                                                            // Reset district when division changes
                                                                            setAddress(prev => ({ ...prev, district: '' }));
                                                                        }}
                                                                        required
                                                                    >
                                                                        <option value="">Select Division</option>
                                                                        {BD_DIVISIONS.map((d) => (
                                                                            <option key={d} value={d}>{d}</option>
                                                                        ))}
                                                                    </select>
                                                            </div>
                                                            <div className='grid grid-cols-2 gap-4'>
                                                                    <select
                                                                        name="district"
                                                                        className='w-full px-2 py-2.5 border border-gray-400 rounded outline-none text-gray-500 transition focus:border-[#c9595a] bg-white'
                                                                        value={address.district}
                                                                        onChange={handleChange}
                                                                        required
                                                                        disabled={!address.division}
                                                                    >
                                                                        <option value="">Select District</option>
                                                                        {(DIVISION_DISTRICTS[address.division] || []).map((dist) => (
                                                                            <option key={dist} value={dist}>{dist}</option>
                                                                        ))}
                                                                    </select>
                                                                    <div />
                                                            </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <InputField handleChange={handleChange} address={address} name='zipCode' type="number" placeholder="Zip Code"/>
                        <InputField handleChange={handleChange} address={address} name='country' type="text" placeholder="Country"/>
                    </div>

                    <InputField handleChange={handleChange} address={address} name='phone' type="text" placeholder="Phone Number"/>
                    <button 
    type="submit"
    className='w-full mt-6 bg-[#c9595a] text-white py-3 hover:bg-[#b14a4b] transition cursor-pointer uppercase'>
    Save Address
</button>


                </form>

            </div>
        <img 
    className='md:mr-16 mb-16 md:mt-0 w-64 md:w-80 max-w-full h-auto object-contain' 
    src={assets.add_address_image} 
    alt="Add Address" 
/>

        </div>

    </div>
  )
}

export default AddAddress