import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    // Mock authentication logic (replace with real logic as needed)
    setIsSeller(true);
    setError("");
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  return (
    !isSeller && (
      <div className="min-h-screen flex">
        {/* Left Side - Logo Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <img 
                src={assets.Mach} 
                alt="Mach Logo" 
                className="w-48 h-48 mx-auto mb-6"
              />
              <div className="text-gray-800 text-4xl font-bold">MachMangsho</div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <form onSubmit={onSubmitHandler} className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  <span style={{ color: '#c9595a' }}>Seller</span> Login
                </h1>
                <p className="text-gray-500">Access your dashboard</p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    onChange={e => setEmail(e.target.value)} 
                    value={email}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9595a]/20 focus:border-[#c9595a] outline-none transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    onChange={e => setPassword(e.target.value)} 
                    value={password}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9595a]/20 focus:border-[#c9595a] outline-none transition-all duration-200"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform ${
                    email && password 
                      ? 'bg-[#c9595a] text-white hover:bg-[#b04849] hover:scale-[1.02] shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!email || !password}
                >
                  Sign In to Dashboard
                </button>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Need help? <span className="text-[#c9595a] cursor-pointer hover:underline">Contact Support</span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default SellerLogin;