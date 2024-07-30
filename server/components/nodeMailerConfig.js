// nodemailerConfig.js
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // use your email service
  auth: {
    user: 'yadneshgawas.infipreintern@gmail.com', // your email
    pass: 'ucjl hffp znoj saph', // your email password
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages:', success);
  }
});

export default transporter;
