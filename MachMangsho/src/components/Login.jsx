import React from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate} = useAppContext();  // Added setUser here
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, {
                name,
                email,
                password,
            });

            if (data.success) {
                navigate('/'); // Redirect to home page after login/registration
                setUser(data.user); // Set user data in context
                setShowUserLogin(false);
                toast.success(`${state === 'login' ? 'Login' : 'Registration'} successful!`);
            } else {
                toast.error(data.message || 'Request failed');
            }
        } catch (error) {
            const resp = error?.response;
            const serverData = resp?.data;
            const validationMsg = Array.isArray(serverData?.errors) ? serverData.errors[0]?.msg : undefined;
            let message = serverData?.message || serverData?.error || validationMsg || error.message;

            // Optional friendly fallbacks by status if server message is missing
            if (!serverData?.message && resp?.status) {
                if (resp.status === 409) message = 'Account already exists';
                else if (resp.status === 401) message = 'Incorrect password';
                else if (resp.status === 404) message = 'No account found for this email';
            }

            toast.error(message);
        }
    }; // Added missing closing brace and semicolon

    return (
    <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
        <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-[#FF6B6C]">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#FF6B6C]" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#FF6B6C]" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#FF6B6C]" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-[#FF6B6C] cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-[#FF6B6C] cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-[#FF6B6C] hover:bg-[#FF8788] transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login