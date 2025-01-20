import express from 'express';
import {
  register,
  login,
  logoutUser,
  changePassword,
  forgotPassword,
  verifyResetCode,
  verifyOTPAndResetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/change-password/:userId', changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', verifyOTPAndResetPassword);

export default router;
