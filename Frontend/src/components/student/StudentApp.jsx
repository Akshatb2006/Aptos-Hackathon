import React from 'react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { useStudent } from '../../hooks/useStudent';
import VantaWavesBackground from '../common/VantaBackground';
import StudentDashboard from './StudentDashboard';
import Marketplace from './Marketplace';
import Ledger from './Ledger';
import Redemptions from './Redemptions';

export default function StudentApp({ view, setView, token, user }) {
  const { account, isConnected } = useWalletConnection();
  const {
    balance,
    ledger,
    rewards,
    filteredRewards,
    redemptions,
    onChainBalance,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    redeemReward,
    loadLedger,
    loadRedemptions
  } = useStudent(token, account, isConnected);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
      <VantaWavesBackground />

      {view === 'student-dashboard' && (
        <StudentDashboard 
          user={user} 
          balance={balance} 
          onChainBalance={onChainBalance} 
          setView={setView}
          loadLedger={loadLedger}
          loadRedemptions={loadRedemptions}
        />
      )}

      {view === 'marketplace' && (
        <Marketplace 
          rewards={filteredRewards} // Pass filtered rewards
          balance={balance}
          onRedeem={redeemReward}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {view === 'ledger' && (
        <Ledger ledger={ledger} />
      )}

      {view === 'redemptions' && (
        <Redemptions redemptions={redemptions} />
      )}
    </div>
  );
}
