// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    }),
    updateWallet: (token, walletAddress) => fetch(`${API_URL}/student/wallet`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress })
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
    }),
    getUsers: (token) => fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    awardPoints: (token, data) => fetch(`${API_URL}/admin/award-points`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
};

export default api;
