import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

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
      <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center text-sm text-gray-600">
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span style={{ color: '#c9595a' }}>Seller</span> Login
          </p>
          {error && <div className="text-red-500 w-full text-center text-sm">{error}</div>}

          <div className="w-full">
            <p>Email</p>
            <input onChange={e => setEmail(e.target.value)} value={email}
              type="email"
              placeholder="Enter your e-mail"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-[#c9595a] focus:ring-0"
              required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input onChange={e => setPassword(e.target.value)} value={password}
              type="password"
              placeholder="Enter your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-[#c9595a] focus:ring-0"
              required
            />
          </div>
          <button
  type="submit"
  className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 ${email && password ? 'bg-[#c9595a] text-white cursor-pointer hover:bg-[#b04849]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
  disabled={!email || !password}
>
  Login
</button>
        </div>
      </form>
    )
  );
};

export default SellerLogin;