const User = require('../../domain/user/user.model');

class AuthService {
  static async login(walletAddress, userData = {}) {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = await User.create({
        walletAddress,
        ...userData
      });
    } else {
      // Check if the user is trying to login with a different role
      if (userData.role && user.role !== userData.role) {
        throw new Error(`Access Denied: You are registered as a ${user.role}, but trying to login as ${userData.role}.`);
      }

      if (Object.keys(userData).length > 0) {
        // Optional: Update user data if provided on login (e.g. from Signup page)
        user.name = userData.name || user.name;
        user.email = userData.email || user.email;
        // user.role = userData.role || user.role; // Do not allow role update on login
        await user.save();
      }
    }

    return user;
  }
}

module.exports = AuthService;
