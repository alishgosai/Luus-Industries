import express from 'express';
import { register, login, logoutUser, changePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/change-password/:userId', changePassword);

export default router;

