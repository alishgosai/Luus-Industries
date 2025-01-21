# Luus Industries Mobile App

Welcome to the Luus Industries Mobile App project! This React Native application is designed to showcase Luus Industries' products and provide a seamless user experience for customers and partners.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## About the Project

The Luus Industries Mobile App is a cross-platform mobile application developed for Android and iOS using React Native and Expo. It serves as a digital platform for Luus Industries, allowing users to browse products, access information, and interact with the company's services.

## Features

- **Home Screen:** Displays featured products and company information.
- **Browse:** Explore Luus Industries' range of commercial kitchen equipment.
- **Product Details:** View detailed information and specifications for each product.
- **Services:** Information about services offered by Luus Industries.
- **Chatbot:** In-app customer support chatbot feature.
- **Account Profile:** Manage user account information.
- **FAQs:** Access frequently asked questions and answers.
- **Scan Feature:** Scan QR codes for additional product information.
- **In-App Browser:** Open website links within the app.


## Technologies Used

- **React Native:** Core framework for building the cross-platform mobile app.
- **Expo:** Development toolchain and platform for React Native.
- **React Navigation:** For managing screen navigation and routing.
- **Firebase:** For backend services and database management.
- **Node.js:** For server-side operations.
- **Axios:** For making HTTP requests to the backend API.
- **React Native Elements:** UI component library for consistent design.
- **React Native Vector Icons:** For using custom icons throughout the app.
- **AsyncStorage:** For local data persistence.

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS development, macOS only)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/luus-industries/mobile-app.git
   cd mobile-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required API endpoints and keys

### Running the Project

1. Start the Expo development server:
   \`\`\`bash
   expo start
   \`\`\`

2. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)

## Project Structure

\`\`\`
luus-industries-mobile-app/
├── assets/                  # Static assets (images, fonts)
├── components/              # Reusable React components
│   ├── BottomNavBar.js      # Bottom navigation bar component
│   └── ...
├── screens/                 # Individual app screens
│   ├── HomeScreen.js        # Home screen with featured products
│   ├── LoginScreen.js       # Login screen
│   ├── RegisterScreen.js    # Register screen
│   ├── ScanPage.js          # QR code scanning page
│   ├── BrowseScreen.js      # Product browsing screen
│   ├── ServicesScreen.js    # Services information screen
│   ├── ChatbotScreen.js     # Chatbot interface
│   ├── ProfileScreen.js     # User profile management
│   ├── FAQScreen.js         # Frequently Asked Questions
│   ├── ForgotPasswordScreen.js
│   ├── ResetCodeScreen.js
│   ├── NewPasswordScreen.js
│   └── ...
├── navigation/              # Navigation configuration
├── services/                # API and Firebase service integrations
├── utils/                   # Utility functions and helpers
├── App.js                   # Main app entry point
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
\`\`\`

## Contributing

We welcome contributions to the Luus Industries Mobile App! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.

---

For any questions or support, please contact the Luus Industries development team.

