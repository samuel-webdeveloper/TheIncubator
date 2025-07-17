// config/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // my gmail address
    pass: process.env.EMAIL_PASS   // app password
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"TheIncubator" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
