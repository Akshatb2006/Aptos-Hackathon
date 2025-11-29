import React, { useState, useEffect } from 'react';
import { Wallet, Award, TrendingUp, Gift, Users, BarChart3, Upload, LogOut, Menu, X } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
// API Configuration
const API_URL = 'http://localhost:5000/api';

const api = {
  auth: {
    login: (data) => fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    register: (data) => fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    getMe: (token) => fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  student: {
    getBalance: (token) => fetch(`${API_URL}/student/balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    getLedger: (token) => fetch(`${API_URL}/student/ledger`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    getRewards: (token) => fetch(`${API_URL}/student/rewards`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    redeem: (token, rewardId) => fetch(`${API_URL}/student/redeem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rewardId })
    }),
    getRedemptions: (token) => fetch(`${API_URL}/student/redemptions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  admin: {
    getAnalytics: (token) => fetch(`${API_URL}/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    getRewards: (token) => fetch(`${API_URL}/admin/rewards`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    createReward: (token, data) => fetch(`${API_URL}/admin/rewards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }),
    uploadAttendance: (token, formData) => fetch(`${API_URL}/admin/upload-attendance`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
  }
};

// Main App Component
export default function CampusWallet() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.auth.getMe(token)
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
          setView(data.user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (!token) {
    return <AuthPage setToken={setToken} setUser={setUser} setView={setView} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} view={view} setView={setView} onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        {user?.role === 'student' ? (
          <StudentApp view={view} setView={setView} token={token} user={user} />
        ) : (
          <AdminApp view={view} setView={setView} token={token} />
        )}
      </div>
    </div>
  );
}

// Navbar Component
function Navbar({ user, view, setView, onLogout }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const menuItems = user?.role === 'admin'
    ? [
      { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'manage-rewards', label: 'Rewards', icon: Gift },
      { id: 'upload-attendance', label: 'Upload', icon: Upload }
    ]
    : [
      { id: 'student-dashboard', label: 'Wallet', icon: Wallet },
      { id: 'marketplace', label: 'Marketplace', icon: Gift },
      { id: 'ledger', label: 'History', icon: TrendingUp }
    ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">Campus Wallet</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${view === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden pb-4">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); setMobileMenu(false); }}
                  className={`flex items-center space-x-2 w-full px-4 py-3 ${view === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 w-full px-4 py-3 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// Auth Page

function AuthPage({ setToken, setUser, setView }) {
  const { connect, account, connected, disconnect, wallets } = useWallet();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rollNumber: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Aptos Wallet Login
  const handleAptosLogin = async () => {
    try {
      setLoading(true);
      setError('');

      if (!connected) {
        // Connect to first available wallet (Petra or Martian)
        const wallet = wallets?.[0];
        if (wallet) {
          await connect(wallet.name);
        } else {
          throw new Error('No Aptos wallet found. Please install Petra or Martian wallet.');
        }
        return;
      }

      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      // Call backend keyless-login
      const res = await fetch(`${API_URL}/auth/keyless-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: account.address,
          email: account.email || `${account.address.slice(0, 10)}@aptos.wallet`,
          name: account.name || `User ${account.address.slice(0, 8)}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setView(data.user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Regular email/password login
  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // Regex Patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // Min 8 chars, 1 letter, 1 number
    const nameRegex = /^[a-zA-Z\s]+$/;
    const rollNumberRegex = /^[a-zA-Z0-9]+$/;

    // Validation
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!nameRegex.test(formData.name)) {
        setError('Name must contain only alphabets and spaces');
        setLoading(false);
        return;
      }
      if (!rollNumberRegex.test(formData.rollNumber)) {
        setError('Roll Number must be alphanumeric');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? api.auth.login : api.auth.register;
      const res = await endpoint(formData);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setView(data.user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Wallet className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Campus Wallet
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Aptos Wallet Login Button */}
        <button
          onClick={handleAptosLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition mb-4 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>{connected ? 'Login with Aptos Wallet' : 'Connect Aptos Wallet'}</span>
        </button>

        {connected && account && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4 text-xs">
            Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <div className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
// Student App
function StudentApp({ view, setView, token, user }) {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    loadBalance();
    loadRewards();
  }, []);

  const loadBalance = async () => {
    const res = await api.student.getBalance(token);
    const data = await res.json();
    setBalance(data.balance);
  };

  const loadLedger = async () => {
    const res = await api.student.getLedger(token);
    const data = await res.json();
    setLedger(data);
  };

  const loadRewards = async () => {
    const res = await api.student.getRewards(token);
    const data = await res.json();
    setRewards(data);
  };

  const loadRedemptions = async () => {
    const res = await api.student.getRedemptions(token);
    const data = await res.json();
    setRedemptions(data);
  };

  const handleRedeem = async (rewardId) => {
    if (!confirm('Redeem this reward?')) return;

    try {
      const res = await api.student.redeem(token, rewardId);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert('Reward redeemed successfully!');
      loadBalance();
      loadRewards();
    } catch (err) {
      alert(err.message);
    }
  };

  if (view === 'student-dashboard') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-indigo-100 mb-6">Your Campus Wallet Balance</p>
          <div className="flex items-center space-x-4">
            <Award className="w-12 h-12" />
            <span className="text-5xl font-bold">{balance}</span>
            <span className="text-xl">Points</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => setView('marketplace')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <Gift className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Marketplace</h3>
            <p className="text-gray-600">Redeem rewards</p>
          </button>
          <button
            onClick={() => { setView('ledger'); loadLedger(); }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">History</h3>
            <p className="text-gray-600">View transactions</p>
          </button>
          <button
            onClick={() => { loadRedemptions(); setView('redemptions'); }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <Award className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">My Redemptions</h3>
            <p className="text-gray-600">QR codes</p>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'marketplace') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {rewards.map(reward => (
            <div key={reward._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={reward.imageUrl}
                alt={reward.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.name}</h3>
                <p className="text-gray-600 mb-4">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">{reward.pointsCost} pts</span>
                  <button
                    onClick={() => handleRedeem(reward._id)}
                    disabled={balance < reward.pointsCost}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'ledger') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Transaction History</h2>
        <div className="bg-white rounded-xl shadow-lg">
          {ledger.map(entry => (
            <div key={entry._id} className="border-b last:border-b-0 p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{entry.description}</p>
                <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
              <span className={`text-lg font-bold ${entry.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
                {entry.type === 'EARN' ? '+' : '-'}{entry.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'redemptions') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Redemptions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {redemptions.map(red => (
            <div key={red._id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">{red.rewardId?.name}</h3>
              {red.qrCode && <img src={red.qrCode} alt="QR Code" className="w-64 h-64 mx-auto mb-4" />}
              <p className="text-center font-mono text-sm">{red.redemptionCode}</p>
              <p className="text-center text-sm text-gray-500 mt-2">Status: {red.status}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// Admin App
function AdminApp({ view, setView, token }) {
  const [analytics, setAnalytics] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    category: 'food',
    stock: -1
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPoints, setUploadPoints] = useState(10);

  useEffect(() => {
    loadAnalytics();
    loadRewards();
  }, []);

  const loadAnalytics = async () => {
    const res = await api.admin.getAnalytics(token);
    const data = await res.json();
    setAnalytics(data);
  };

  const loadRewards = async () => {
    const res = await api.admin.getRewards(token);
    const data = await res.json();
    setRewards(data);
  };

  const handleCreateReward = async () => {
    try {
      const res = await api.admin.createReward(token, formData);
      if (!res.ok) throw new Error('Failed to create reward');
      alert('Reward created!');
      loadRewards();
      setFormData({ name: '', description: '', pointsCost: 0, category: 'food', stock: -1 });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUploadCSV = async () => {
    if (!uploadFile) return alert('Select a file');

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('pointsPerAttendance', uploadPoints);

    try {
      const res = await api.admin.uploadAttendance(token, formData);
      const data = await res.json();
      alert(`Processed: ${data.processed}, Errors: ${data.errors}`);
      setUploadFile(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (view === 'admin-dashboard') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        {analytics && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <p className="text-gray-600">Total Students</p>
              <p className="text-3xl font-bold">{analytics.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Award className="w-12 h-12 text-green-600 mb-4" />
              <p className="text-gray-600">Points Issued</p>
              <p className="text-3xl font-bold">{analytics.totalPointsIssued}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Gift className="w-12 h-12 text-purple-600 mb-4" />
              <p className="text-gray-600">Redemptions</p>
              <p className="text-3xl font-bold">{analytics.totalRedemptions}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
              <p className="text-gray-600">Active Rewards</p>
              <p className="text-3xl font-bold">{analytics.activeRewards}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'manage-rewards') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Rewards</h2>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Create New Reward</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Reward Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Points Cost"
              value={formData.pointsCost}
              onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="food">Food</option>
              <option value="subscription">Subscription</option>
              <option value="event">Event</option>
              <option value="coupon">Coupon</option>
            </select>
            <button
              onClick={handleCreateReward}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Create Reward
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Existing Rewards</h3>
          <div className="space-y-4">
            {rewards.map(reward => (
              <div key={reward._id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{reward.name}</h4>
                  <p className="text-sm text-gray-600">{reward.pointsCost} points</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${reward.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reward.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'upload-attendance') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Upload Attendance</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">CSV File (email or rollNumber column required)</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Points Per Attendance</label>
              <input
                type="number"
                value={uploadPoints}
                onChange={(e) => setUploadPoints(parseInt(e.target.value) || 10)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handleUploadCSV}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Upload & Process
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}