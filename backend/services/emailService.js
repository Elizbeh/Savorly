import nodemailer from 'nodemailer';

export const sendEmail = (to, first_name, verificationUrl) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing email credentials in environment variables.");
    return Promise.reject(new Error("Missing email credentials"));
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Your email address from which emails will be sent
    to: to,                       // Now correctly using the "to" parameter
    subject: 'Verify Your Email Address',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            .email-header {
              text-align: center;
              padding: 20px;
              background-color: #007bff;
              color: white;
              border-radius: 8px 8px 0 0;
            }
            .email-body {
              padding: 20px;
              font-size: 16px;
              color: #333333;
            }
            .email-footer {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #888888;
              border-top: 1px solid #f1f1f1;
            }
            .btn {
              display: inline-block;
              padding: 12px 25px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              text-align: center;
              cursor: pointer;
            }
            .btn:hover {
              background-color: #0056b3;
            }
            @media screen and (max-width: 600px) {
              .email-container {
                width: 100%;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h2>Welcome to Savorly</h2>
            </div>
            <div class="email-body">
              <p>Hi ${first_name},</p>
              <p>Thank you for signing up on Savorly! To complete your registration, please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" target="_blank" class="btn">
                  Verify My Email
                </a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
              </p>
              <p>If you did not sign up for this account, please ignore this email.</p>
            </div>
            <div class="email-footer">
              <p>Thanks,<br>Savorly Team</p>
              <p>If you have any questions, feel free to contact us at support@[yourapp].com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Password:', process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false, // This allows insecure connections, but it's useful for local testing.
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return reject(new Error('Failed to send email'));
      }
      console.log('Email sent:', info.response);
      resolve(info);
    });
  });
};
