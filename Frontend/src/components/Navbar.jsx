import React, { useState } from 'react';
import { Wallet, LogOut, Menu, X, BarChart3, Users, Gift, Upload, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, view, setView, onLogout }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const menuItems = user?.role === 'admin'
    ? [
      { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'manage-students', label: 'Students', icon: Users },
      { id: 'manage-rewards', label: 'Rewards', icon: Gift },
      { id: 'upload-attendance', label: 'Upload', icon: Upload }
    ]
    : [
      { id: 'student-dashboard', label: 'Wallet', icon: Wallet },
      { id: 'marketplace', label: 'Marketplace', icon: Gift },
      { id: 'ledger', label: 'History', icon: TrendingUp }
    ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-2xl border-b border-gray-800/50 shadow-2xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Wallet className="w-8 h-8 text-purple-400" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
              </motion.div>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CampusWallet
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Logout Button */}
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-red-500/20 hover:border-red-500/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = view === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        setMobileMenu(false);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
                <motion.button
                  onClick={onLogout}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.05 }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-red-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
