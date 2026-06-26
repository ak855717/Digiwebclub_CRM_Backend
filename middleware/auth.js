const User = require('../models/userModel');

/**
 * Middleware to check if the requesting user is an administrator.
 * Expects the requesting user's MongoDB ObjectId to be sent in the 'x-user-id' header.
 */
const adminAuth = async (req, res, next) => {
  try {
    const adminId = req.headers['x-user-id'];
    
    if (!adminId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized. x-user-id header is missing.' 
      });
    }

    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized. User session not found.' 
      });
    }

    if (adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden. Access restricted to admin users only.' 
      });
    }

    // Attach admin info to request
    req.admin = adminUser;
    next();
  } catch (error) {
    console.error('adminAuth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An error occurred during authorization check.' 
    });
  }
};

/**
 * Middleware to check if the requesting user is authenticated (any valid user).
 */
const userAuth = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized. x-user-id header is missing.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized. User session not found.' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden. User account is deactivated.' 
      });
    }

    // Attach user info to request
    req.user = user;
    next();
  } catch (error) {
    console.error('userAuth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An error occurred during authorization check.' 
    });
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
