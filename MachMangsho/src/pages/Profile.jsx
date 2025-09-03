import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { axios, user, setUser, navigate } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/user/is-auth');
        if (data?.success && data?.user) {
          setMe(data.user);
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setUser(data.user);
        } else {
          toast.error('Please login to view profile');
          navigate('/');
        }
      } catch (e) {
        toast.error('Please login to view profile');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [axios, navigate, setUser]);

  const onSaveName = async (e) => {
    e.preventDefault();
    try {
      setSavingName(true);
      const trimmed = name.trim();
      if (trimmed.length < 2) {
        toast.error('Name must be at least 2 characters');
        return;
      }
  const { data } = await axios.put('/api/user/profile', { name: trimmed });
      if (data?.success) {
        toast.success('Profile updated');
        setMe((m) => ({ ...(m || {}), name: trimmed }));
        setUser((u) => ({ ...(u || {}), name: trimmed }));
      } else {
        toast.error(data?.message || 'Update failed');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || 'Update failed');
    } finally {
      setSavingName(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (!currentPwd) {
        toast.error('Enter your current password');
        return;
      }
      if (!pwd || !pwd2) {
        toast.error('Enter new password in both fields');
        return;
      }
      if (pwd !== pwd2) {
        toast.error('Passwords do not match');
        return;
      }
      if (pwd === currentPwd) {
        toast.error('New password must be different from current password');
        return;
      }
      // Basic strength checks to match backend rules
      if (pwd.length < 8 ||
          !/[A-Z]/.test(pwd) ||
          !/[a-z]/.test(pwd) ||
          !/[0-9]/.test(pwd) ||
          !/[^A-Za-z0-9]/.test(pwd)) {
        toast.error('Password must be 8+ chars with upper, lower, number, and special');
        return;
      }
      setChangingPwd(true);
      const { data } = await axios.post('/api/user/change-password', { currentPassword: currentPwd, newPassword: pwd });
      if (data?.success) {
        toast.success('Password updated');
        setCurrentPwd(''); setPwd(''); setPwd2('');
      } else {
        toast.error(data?.message || 'Password update failed');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || 'Password update failed');
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Account Info</h2>
        <form onSubmit={onSaveName} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input value={email} disabled className="mt-1 w-full bg-gray-50 cursor-not-allowed border border-gray-200 rounded px-3 py-2" />
          </div>
          <div>
            <label htmlFor="name" className="text-sm text-gray-600">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#c9595a]" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={savingName} className="px-5 py-2 rounded text-white disabled:opacity-70" style={{ backgroundColor: '#c9595a' }}>{savingName ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Change Password</h2>
        <form onSubmit={onChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPwd" className="text-sm text-gray-600">Current Password</label>
            <input id="currentPwd" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#c9595a]" />
          </div>
          <div>
            <label htmlFor="pwd" className="text-sm text-gray-600">New Password</label>
            <input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#c9595a]" placeholder="At least 8 chars, 1 upper, 1 lower, 1 number, 1 special" />
          </div>
          <div>
            <label htmlFor="pwd2" className="text-sm text-gray-600">Confirm New Password</label>
            <input id="pwd2" type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#c9595a]" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={changingPwd} className="px-5 py-2 rounded text-white disabled:opacity-70" style={{ backgroundColor: '#c9595a' }}>{changingPwd ? 'Updating...' : 'Update Password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
