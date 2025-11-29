import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Clock, Check } from 'lucide-react';

const Redemptions = ({ redemptions }) => {
  return (
    <div className="relative overflow-x-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
        >
          My Redemptions
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {redemptions.map((redemption, index) => (
            <motion.div
              key={redemption._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{redemption.rewardName}</h3>
                    <p className="text-gray-500 text-sm">{new Date(redemption.redeemedAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    redemption.status === 'used' 
                      ? 'bg-gray-100 text-gray-500' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {redemption.status === 'used' ? 'REDEEMED' : 'ACTIVE'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Redemption Code</p>
                      <p className="font-mono font-bold text-lg text-gray-900">{redemption.uniqueCode}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {redemption.status === 'used' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Redeemed on {new Date(redemption.usedAt).toLocaleDateString()}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>Show this code at the counter</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {redemptions.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 py-12">
              No redemptions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Redemptions;
