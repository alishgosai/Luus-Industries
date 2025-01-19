import nodemailer from 'nodemailer';

let transporter = null;

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials are not set in environment variables');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const initializeEmailService = () => {
  transporter = createTransporter();
  if (transporter) {
    console.log('Email service initialized successfully');
  } else {
    console.error('Failed to initialize email service');
  }
};

const generateEmailTemplate = (formData, formType) => {
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Form Submission</title>
    <style>
        /* Reset default styles */
        body, h1, h2, h3, p, div {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }

        .header {
            background-color: #1a365d;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .logo {
            max-width: 150px;
            height: auto;
        }

        .content {
            padding: 20px;
        }

        .section {
            margin-bottom: 30px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 20px;
        }

        .section:last-child {
            border-bottom: none;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #1a365d;
        }

        h2 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #2c5282;
        }

        .field {
            margin-bottom: 15px;
        }

        .label {
            font-weight: bold;
            color: #4a5568;
        }

        .value {
            margin-top: 5px;
        }

        .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }

        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Service Form Submission</h1>
        </div>
        <div class="content">
            <div class="section">
                <h2>Customer Information</h2>
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${formData.name || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">${formData.email || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="label">Mobile Number:</div>
                    <div class="value">${formData.mobileNumber || 'Not provided'}</div>
                </div>
                ${formData.businessName ? `
                <div class="field">
                    <div class="label">Business Name:</div>
                    <div class="value">${formData.businessName}</div>
                </div>
                ` : ''}
            </div>
            <div class="section">
                <h2>Form Details</h2>
                ${Object.entries(formData)
                    .filter(([key]) => !['name', 'email', 'mobileNumber', 'businessName'].includes(key))
                    .map(([key, value]) => `
                        <div class="field">
                            <div class="label">${key.charAt(0).toUpperCase() + key.slice(1)}:</div>
                            <div class="value">${value}</div>
                        </div>
                    `).join('')}
            </div>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>


  `;
};

export const sendEmail = async (formData, formType, file) => {
  if (!transporter) {
    console.error('Email service not initialized');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'mbishnu2024@gmail.com', // Replace with the actual recipient email
    subject: `New ${formType} Submission`,
    html: generateEmailTemplate(formData, formType),
    attachments: []
  };

  if (file) {
    mailOptions.attachments.push({
      filename: file.originalname,
      content: file.buffer
    });
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

