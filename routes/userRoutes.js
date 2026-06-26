const express = require('express');
const router = express.Router();
const { loginUser, createUser, getUsers, getUsersCount, updateUserRole, updateUserPassword, updateUserPermissions } = require('../controllers/userController');

const { adminAuth, userAuth } = require('../middleware/auth');

// Map auth endpoints
router.post('/login', loginUser);
router.post('/create-user', adminAuth, createUser);



// Admin endpoints
router.get('/users', adminAuth, getUsers);
router.get('/users/count', userAuth, getUsersCount);

router.put('/users/:id/role', adminAuth, updateUserRole);
router.put('/users/:id/permissions', adminAuth, updateUserPermissions);
router.put('/users/:id/password', adminAuth, updateUserPassword);

module.exports = router;
