import express from 'express';
import { 
  getUserProfile, 
  getAccountInformation, 
  updateUserDetails, 
  updateProfilePicture, 
  removeProfilePicture
} from '../controllers/userController.js';
import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Server is responding correctly' });
});

router.get('/user-profile', getUserProfile);
router.get('/account-information', getAccountInformation);
router.post('/update-user-details', updateUserDetails);
router.post('/update-profile-picture', upload.single('image'), updateProfilePicture);
router.delete('/remove-profile-picture', removeProfilePicture);

export default router;

