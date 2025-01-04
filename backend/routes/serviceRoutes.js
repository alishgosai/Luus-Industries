import express from 'express';
import * as chatController from '../controllers/chatController.js';
import * as faqController from '../controllers/faqController.js';

const router = express.Router();

// Chat routes
router.post('/chat', chatController.handleChat);
router.get('/chat/history/:userId', chatController.getChatSessionHistory);
router.get('/chat/interests/:userId', chatController.getUserProductInterests);
router.delete('/chat/history/:userId', chatController.deleteUserChatHistory);
router.get('/chat/users', chatController.getAllUsers);

// FAQ routes (unchanged)
router.get('/faq', faqController.getAllFAQsController);
router.get('/faq/:id', faqController.getFAQByIdController);
router.post('/faq', faqController.createFAQController);
router.put('/faq/:id', faqController.updateFAQController);
router.delete('/faq/:id', faqController.deleteFAQController);

export default router;

