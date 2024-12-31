import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Mock user data (replace this with a database in a real application)
let userData = {
  name: "Luxe User",
  avatar: "https://example.com/avatar.jpg",
  accountInfo: {
    dateOfBirth: "21/09/2000",
    phoneNumber: "941234567",
    email: "luxeuser@luxe.com",
    password: "********"
  },
  warrantyProducts: [
    { id: 1, name: "Product 1", warranty: "1 year" },
    { id: 2, name: "Product 2", warranty: "2 years" }
  ]
};

app.get('/api/user-profile', (req, res) => {
  res.json(userData);
});

app.get('/api/account-information', (req, res) => {
  res.json({
    name: userData.name,
    avatar: userData.avatar,
    ...userData.accountInfo
  });
});

app.post('/api/update-profile-picture', upload.single('image'), (req, res) => {
  console.log('Received request to update profile picture');
  try {
    if (req.file) {
      console.log('File received:', req.file);
      const imageUrl = `http://192.168.0.23:${port}/uploads/${req.file.filename}`;
      userData.avatar = imageUrl;
      console.log('Profile picture updated:', imageUrl);
      res.json({ success: true, imageUrl });
    } else {
      console.log('No file received');
      res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
  } catch (error) {
    console.error('Error in update-profile-picture:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.delete('/api/remove-profile-picture', (req, res) => {
  console.log('Received request to remove profile picture');
  try {
    if (userData.avatar && userData.avatar.startsWith(`http://192.168.0.23:${port}/uploads/`)) {
      const filename = userData.avatar.split('/').pop();
      const filePath = path.join(uploadsDir, filename);
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
    
    userData.avatar = null;
    console.log('Profile picture removed');
    res.json({ success: true });
  } catch (error) {
    console.error('Error in remove-profile-picture:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

