import React from 'react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { useAdmin } from '../../hooks/useAdmin';
import VantaWavesBackground from '../common/VantaBackground';
import AdminDashboard from './AdminDashboard';
import ManageStudents from './ManageStudents';
import ManageRewards from './ManageRewards';

export default function AdminApp({ view, setView, token }) {
  const { account, signAndSubmitTransaction } = useWalletConnection();
  const { 
    analytics, 
    users, 
    rewards, 
    awardPoints, 
    createReward, 
    uploadAttendance 
  } = useAdmin(token, account, signAndSubmitTransaction);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
      <VantaWavesBackground />

      {view === 'admin-dashboard' && (
        <AdminDashboard analytics={analytics} />
      )}

      {view === 'manage-students' && (
        <ManageStudents users={users} onAwardPoints={awardPoints} />
      )}

      {view === 'manage-rewards' && (
        <ManageRewards rewards={rewards} onCreateReward={createReward} />
      )}
    </div>
  );
}
