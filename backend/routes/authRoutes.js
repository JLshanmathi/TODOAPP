const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword, forgotPassword,resetPassword} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);  
router.post('/forgot-password', forgotPassword);  // 👈 ADD THIS ROUTE
router.post('/reset-password', resetPassword);    // 👈 ADD THIS ROUTE


module.exports = router;