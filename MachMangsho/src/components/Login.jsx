import React from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate} = useAppContext();  // Added setUser here
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [nameError, setNameError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Validation functions
    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!name.trim()) {
            return "Name is required";
        }
        if (name.trim().length < 2) {
            return "Name must be at least 2 characters long";
        }
        if (!nameRegex.test(name.trim())) {
            return "Name can only contain letters and spaces";
        }
        return "";
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        if (!password) {
            return "Password is required";
        }
        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long`;
        }
        if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter";
        }
        if (!hasLowerCase) {
            return "Password must contain at least one lowercase letter";
        }
        if (!hasNumbers) {
            return "Password must contain at least one number";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character";
        }
        return "";
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        if (state === "register") {
            setNameError(validateName(value));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (state === "register") {
            setPasswordError(validatePassword(value));
        }
    };

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            
            // Handle forgot password
            if (state === "forgot") {
                if (!email) {
                    toast.error("Please enter your email address");
                    return;
                }
                
                console.log("=== FRONTEND: Starting forgot password request ===");
                console.log("Email:", email);
                console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
                console.log("Axios baseURL:", axios.defaults.baseURL);
                
                try {
                    console.log("Making axios request to:", '/api/user/forgot-password');
                    const { data } = await axios.post('/api/user/forgot-password', { email });
                    console.log("Response received:", data);
                    
                    if (data.success) {
                        toast.success(data.message);
                        setState("login"); // Switch back to login form
                        setEmail(""); // Clear email field
                    } else {
                        toast.error(data.message);
                    }
                } catch (axiosError) {
                    console.error("=== FRONTEND: Axios request failed ===");
                    console.error("Full error:", axiosError);
                    console.error("Error message:", axiosError.message);
                    console.error("Error code:", axiosError.code);
                    console.error("Request config:", axiosError.config);
                    console.error("Response:", axiosError.response);
                    throw axiosError; // Re-throw to be caught by outer try-catch
                }
                return;
            }            // Client-side validation for registration
            if (state === "register") {
                const nameValidation = validateName(name);
                const passwordValidation = validatePassword(password);
                
                if (nameValidation) {
                    setNameError(nameValidation);
                    toast.error(nameValidation);
                    return;
                }
                
                if (passwordValidation) {
                    setPasswordError(passwordValidation);
                    toast.error(passwordValidation);
                    return;
                }
            }

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
            console.error('Request error:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);

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
        } finally {
            setIsLoading(false);
        }
    }

    return (
    <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
        <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-[#FF6B6C]">User</span> {
                    state === "login" ? "Login" : 
                    state === "register" ? "Sign Up" : 
                    "Reset Password"
                }
            </p>
            {state === "forgot" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">📧 Password Reset</span><br />
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
            )}
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input 
                        onChange={handleNameChange} 
                        value={name} 
                        placeholder="Enter your full name" 
                        className={`border ${nameError ? 'border-red-500' : 'border-gray-200'} rounded w-full p-2 mt-1 outline-[#FF6B6C]`} 
                        type="text" 
                        required 
                    />
                    {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#FF6B6C]" type="email" required />
            </div>
            {state !== "forgot" && (
                <div className="w-full ">
                    <p>Password</p>
                    <input 
                        onChange={handlePasswordChange} 
                        value={password} 
                        placeholder="Enter your password" 
                        className={`border ${passwordError ? 'border-red-500' : 'border-gray-200'} rounded w-full p-2 mt-1 outline-[#FF6B6C]`} 
                        type="password" 
                        required 
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    {state === "register" && (
                        <div className="text-xs text-gray-500 mt-1">
                            <p>Password must contain:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>At least 8 characters</li>
                            <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>One uppercase letter</li>
                            <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>One lowercase letter</li>
                            <li className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>One number</li>
                            <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-gray-500'}>One special character</li>
                        </ul>
                    </div>
                )}
                </div>
            )}
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-[#FF6B6C] cursor-pointer">click here</span>
                </p>
            ) : state === "login" ? (
                <div className="w-full">
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-[#FF6B6C] cursor-pointer">click here</span>
                    </p>
                    <p>
                        Forgot your password? <span onClick={() => setState("forgot")} className="text-[#FF6B6C] cursor-pointer">click here</span>
                    </p>
                </div>
            ) : (
                <p>
                    Back to login? <span onClick={() => setState("login")} className="text-[#FF6B6C] cursor-pointer">click here</span>
                </p>
            )}
            <button 
                className="bg-[#FF6B6C] hover:bg-[#FF8788] transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
            >
                {isLoading ? "Processing..." : 
                 state === "register" ? "Create Account" : 
                 state === "forgot" ? "Send Reset Link" : 
                 "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login