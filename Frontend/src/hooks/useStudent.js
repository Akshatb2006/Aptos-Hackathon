import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { MODULE_ADDRESS } from '../aptosConfig';
import { AptosClient } from 'aptos';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

export const useStudent = (token, walletAccount, isConnected) => {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [onChainBalance, setOnChainBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadBalance = useCallback(async () => {
    try {
      const res = await api.student.getBalance(token);
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Failed to load balance", err);
    }
  }, [token]);

  const loadLedger = useCallback(async () => {
    try {
      const res = await api.student.getLedger(token);
      const data = await res.json();
      setLedger(data);
    } catch (err) {
      console.error("Failed to load ledger", err);
    }
  }, [token]);

  const loadRewards = useCallback(async () => {
    try {
      const res = await api.student.getRewards(token);
      const data = await res.json();
      setRewards(data);
    } catch (err) {
      console.error("Failed to load rewards", err);
    }
  }, [token]);

  const loadRedemptions = useCallback(async () => {
    try {
      const res = await api.student.getRedemptions(token);
      const data = await res.json();
      setRedemptions(data);
    } catch (err) {
      console.error("Failed to load redemptions", err);
    }
  }, [token]);

  // Initial Data Load
  useEffect(() => {
    if (token) {
      Promise.all([loadBalance(), loadRewards()])
        .finally(() => setLoading(false));
    }
  }, [token, loadBalance, loadRewards]);

  // Wallet Sync & On-Chain Balance
  useEffect(() => {
    if (isConnected && walletAccount?.address) {
      // Sync wallet with backend
      api.student.updateWallet(token, String(walletAccount.address))
        .catch(err => console.error("Failed to sync wallet", err));
      
      // Fetch on-chain balance
      const fetchOnChainBalance = async () => {
        try {
          const resource = await client.getAccountResource(
            walletAccount.address,
            `${MODULE_ADDRESS}::campus_coin::Balance`
          );
          setOnChainBalance(resource.data.coin.value);
        } catch (e) {
          console.warn("Failed to fetch on-chain balance:", e);
          setOnChainBalance(null);
        }
      };
      fetchOnChainBalance();
    }
  }, [isConnected, walletAccount?.address, token]);

  const redeemReward = async (rewardId) => {
    const res = await api.student.redeem(token, rewardId);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Redemption failed');

    // Refresh data
    loadBalance();
    loadRewards();
    return data;
  };

  const filteredRewards = useMemo(() => {
    return rewards.filter(reward => {
      const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           reward.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [rewards, searchTerm, selectedCategory]);

  return {
    balance,
    ledger,
    rewards,
    filteredRewards,
    redemptions,
    onChainBalance,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    redeemReward,
    loadLedger,
    loadRedemptions
  };
};
