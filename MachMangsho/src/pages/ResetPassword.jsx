import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { axios } = useAppContext();
    
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error('Invalid reset link');
            navigate('/');
        }
    }, [searchParams, navigate]);

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

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordError(validatePassword(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        if (!newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const validation = validatePassword(newPassword);
        if (validation) {
            setPasswordError(validation);
            toast.error(validation);
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/user/reset-password', {
                token,
                newPassword
            });

            if (data.success) {
                toast.success(data.message);
                navigate('/');
                // Optional: Show login modal
                // setShowUserLogin(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Failed to reset password';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Reset Your <span className="text-[#FF6B6C]">Password</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your new password"
                                    className={`appearance-none block w-full px-3 py-2 border ${
                                        passwordError ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#FF6B6C] focus:border-[#FF6B6C] sm:text-sm`}
                                    required
                                />
                                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                                <div className="text-xs text-gray-500 mt-1">
                                    <p>Password must contain:</p>
                                    <ul className="list-disc list-inside ml-2">
                                        <li className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>At least 8 characters</li>
                                        <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>One uppercase letter</li>
                                        <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>One lowercase letter</li>
                                        <li className={/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>One number</li>
                                        <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>One special character</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your new password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#FF6B6C] focus:border-[#FF6B6C] sm:text-sm"
                                    required
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || passwordError || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B6C] hover:bg-[#FF8788] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6C] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Resetting Password...
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6C] transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
