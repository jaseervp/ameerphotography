const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const auth = require('../middleware/auth');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, uploadMiddleware.single('profilePic'), authController.updateProfile);
router.post('/google-login', authController.googleLogin);
router.put('/update-password', auth, authController.updatePassword);

module.exports = router;
