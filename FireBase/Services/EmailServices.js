import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.FALLBACK_EMAIL_HOST,
      port: process.env.FALLBACK_EMAIL_PORT,
      secure: process.env.FALLBACK_EMAIL_SECURE === 'true',
      auth: {
        user: process.env.FALLBACK_EMAIL_USER,
        pass: process.env.FALLBACK_EMAIL_PASS,
      },
    });
  }

  async sendResetEmailFallback(email, token) {
    console.log(`Attempting to send reset email via fallback to ${email}`);
    const mailOptions = {
      from: process.env.FALLBACK_EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Information</h2>
        <p>You have requested to reset your password. Please use the following link:</p>
        <a href="${process.env.REACT_APP_FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Fallback reset email sent successfully. MessageId:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending fallback reset email:', error);
      throw error;
    }
  }

  async sendResetEmail(email, token) {
    const params = {
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <body>
                  <h2>Password Reset Information</h2>
                  <p>You have requested to reset your password. Please use the following link to reset your password:</p>
                  <p>
                    <a href="${process.env.REACT_APP_FRONTEND_URL}/reset-password?token=${token}">
                      Reset Password
                    </a>
                  </p>
                  <p>If you didn't request this, please ignore this email.</p>
                  <p>This link will expire in 1 hour.</p>
                </body>
              </html>
            `
          },
          Text: {
            Charset: "UTF-8",
            Data: `
              Password Reset Information

              You have requested to reset your password. Please use the following link to reset your password:
              ${process.env.REACT_APP_FRONTEND_URL}/reset-password?token=${token}

              If you didn't request this, please ignore this email.
              This link will expire in 1 hour.
            `
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Password Reset Request"
        }
      },
      Source: process.env.REACT_APP_SES_FROM_EMAIL
    };

    try {
      const result = await ses.sendEmail(params).promise();
      console.log("Password reset email sent successfully:", result.MessageId);
      return result;
    } catch (error) {
      console.error('Error sending reset email via AWS SES. Attempting fallback.');
      return this.sendResetEmailFallback(email, token);
    }
  }
}

export const emailService = new EmailService();
