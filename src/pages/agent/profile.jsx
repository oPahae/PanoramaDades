import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Lock, Mail, Phone, AlertCircle, CheckCircle, Save, KeyRound, Loader } from 'lucide-react';
import { verifyAuth } from '@/middlewares/agentAuth';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [agent, setAgent] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setFetching(true);
        const response = await fetch('/api/agents/getOne');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch agent data');
        }

        setAgent(data.agent);
        setProfileData({
          name: data.agent.name || '',
          email: data.agent.email || '',
          phone: data.agent.phone || '',
        });
      } catch (err) {
        console.error('Error fetching agent data:', err);
        setError('Failed to load profile data');
      } finally {
        setFetching(false);
      }
    };

    fetchAgentData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/agents/updateProfile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        router.reload();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/agents/updatePassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password update failed');
      }

      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (fetching) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden flex items-center justify-center py-36">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Profile Container */}
      <div className="relative w-full max-w-2xl mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="text-xs tracking-[0.4em] uppercase text-amber-100 font-semibold mb-3">
              Administration
            </div>
            <h1 className="text-4xl font-serif font-bold text-white leading-tight">
              Agent
              <br />
              <span className="italic">Profile</span>
            </h1>
          </div>

          {/* Tabs */}
          <div className="bg-stone-50/50 border-b border-stone-200 flex">
            <button
              onClick={() => {
                setActiveTab('profile');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 px-6 py-4 font-semibold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-amber-700 border-b-4 border-amber-600'
                  : 'text-stone-600 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile Info</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('password');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 px-6 py-4 font-semibold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'password'
                  ? 'bg-white text-amber-700 border-b-4 border-amber-600'
                  : 'text-stone-600 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <KeyRound className="w-4 h-4" />
                <span>Change Password</span>
              </div>
            </button>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-start space-x-3 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-emerald-900 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4 flex items-start space-x-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-rose-900 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Profile Form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-stone-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                      placeholder="Enter your name"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-stone-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-stone-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                      placeholder="Enter your phone number"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-8 py-5 overflow-hidden rounded-lg font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 text-white flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}

            {/* Password Form */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Current Password Input */}
                <div className="space-y-2">
                  <label 
                    htmlFor="currentPassword" 
                    className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    Current Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-stone-400" />
                    </div>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                      placeholder="Enter current password"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                  <label 
                    htmlFor="newPassword" 
                    className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    New Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-stone-400" />
                    </div>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-stone-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                      placeholder="Confirm new password"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-8 py-5 overflow-hidden rounded-lg font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 text-white flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-200">
            <p className="text-center text-sm text-stone-600 font-light">
              {agent?.dateCreation && (
                <>
                  Account created on {new Date(agent.dateCreation).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const agent = verifyAuth(req, res);

  if (!agent) {
    return {
      redirect: {
        destination: "/agent/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { connected: true } },
  };
}