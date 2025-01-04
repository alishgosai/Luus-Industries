import express from 'express';
import { 
  getUserById,
  getUserProfile, 
  getAccountInformation, 
  updateUserDetails, 
  updateProfilePicture, 
  removeProfilePicture
} from '../controllers/userController.js';
import { upload } from '../middleware/fileUpload.js';
//import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Server is responding correctly' });
});

// Public routes
router.get('/user-profile/:id', getUserProfile);
router.get('/:id', getUserById);

// Protected routes (require authentication)
//router.use(authenticateUser);

router.get('/profile', getUserProfile);
router.get('/account-information', getAccountInformation);
router.put('/update-details/:id', updateUserDetails);  // Changed this line
router.post('/update-profile-picture/:id', upload.single('image'), updateProfilePicture);
router.delete('/remove-profile-picture/:id', removeProfilePicture);

export default router;

