import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class User {
  constructor(name, avatar, accountInfo) {
    this.name = name;
    this.avatar = avatar;
    this.accountInfo = accountInfo;
  }
}

class AccountInfo {
  constructor(dateOfBirth, phoneNumber, email, password) {
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
  }
}

let userData = new User(
  "Luxe User",
  "https://example.com/avatar.jpg",
  new AccountInfo("21/09/2000", "941234567", "luxeuser@luxe.com", "********")
);

export const getUserData = () => {
  return { ...userData };
};

export const updateUserData = ({ name, dateOfBirth, phoneNumber, email, password }) => {
  if (name) userData.name = name;
  if (dateOfBirth) userData.accountInfo.dateOfBirth = dateOfBirth;
  if (phoneNumber) userData.accountInfo.phoneNumber = phoneNumber;
  if (email) userData.accountInfo.email = email;
  
  if (password && password !== '********') {
    userData.accountInfo.password = password;
  }

  console.log('Updated user data:', JSON.stringify(userData, null, 2));
  return { ...userData };
};

export const updateUserAvatar = (imageUrl) => {
  userData.avatar = imageUrl;
  return { ...userData };
};

export const removeUserAvatar = () => {
  if (userData.avatar && userData.avatar.startsWith(`http://192.168.0.23:${process.env.PORT || 3000}/uploads/`)) {
    const filename = userData.avatar.split('/').pop();
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        throw new Error('Failed to delete avatar file');
      } else {
        console.log('File deleted successfully');
      }
    });
  }

  userData.avatar = null;
  return { ...userData };
};

export default User;

