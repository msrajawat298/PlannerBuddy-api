import nodemailer from 'nodemailer';

const sendEmail = async (toEmail, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject || 'Test Subject',
    html: message || 'Test Message'
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Message could not be sent. Mailer Error:', error.message);
    } else {
      console.log('Message sent:', info.messageId);
    }
  });
};

export default sendEmail;