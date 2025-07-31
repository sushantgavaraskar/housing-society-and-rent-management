const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Missing EMAIL credentials in .env');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const result = await transporter.sendMail({ 
      from: process.env.EMAIL_USER, 
      to, 
      subject, 
      text 
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
