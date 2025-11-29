import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { MODULE_ADDRESS } from '../aptosConfig';

export const useAdmin = (token, walletAccount, signAndSubmitTransaction) => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    try {
      const res = await api.admin.getAnalytics(token);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  }, [token]);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.admin.getUsers(token);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  }, [token]);

  const loadRewards = useCallback(async () => {
    try {
      const res = await api.admin.getRewards(token);
      const data = await res.json();
      setRewards(data);
    } catch (err) {
      console.error("Failed to load rewards", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      Promise.all([loadAnalytics(), loadUsers(), loadRewards()])
        .finally(() => setLoading(false));
    }
  }, [token, loadAnalytics, loadUsers, loadRewards]);

  const awardPoints = async (user, amount) => {
    if (!amount || amount <= 0) throw new Error('Invalid amount');

    // 1. DB Update
    const res = await api.admin.awardPoints(token, {
      userId: user._id,
      points: parseInt(amount),
      description: 'Awarded by Admin'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to award points');
    }

    // 2. On-Chain Minting (if wallet connected)
    if (user.walletAddress) {
      if (!walletAccount || String(walletAccount.address) !== MODULE_ADDRESS) {
        throw new Error(`WRONG WALLET: Connect Admin Wallet (${MODULE_ADDRESS.slice(0, 6)}...)`);
      }

      const payload = {
        data: {
          function: `${MODULE_ADDRESS}::campus_coin::mint`,
          typeArguments: [],
          functionArguments: [user.walletAddress, amount]
        }
      };

      await signAndSubmitTransaction(payload);
    }

    // Refresh data
    loadUsers();
    loadAnalytics();
  };

  const createReward = async (formData) => {
    const res = await api.admin.createReward(token, formData);
    if (!res.ok) throw new Error('Failed to create reward');
    loadRewards();
  };

  const uploadAttendance = async (file, points) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pointsPerAttendance', points);

    const res = await api.admin.uploadAttendance(token, formData);
    const data = await res.json();
    return data;
  };

  return {
    analytics,
    users,
    rewards,
    loading,
    error,
    awardPoints,
    createReward,
    uploadAttendance,
    refreshData: () => { loadUsers(); loadAnalytics(); loadRewards(); }
  };
};
