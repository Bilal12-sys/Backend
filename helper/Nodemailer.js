// Import nodemailer
import nodemailer from "nodemailer";

// Create Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Google_Email,
    pass: process.env.Google_App_Password,
  },
});

// Check SMTP connection
try {
  await transporter.verify();
  console.log("Nodemailer is ready to send emails ");
} catch (error) {
  console.error(`Nodemailer connection fails: ${error}`);
}

// Export transporter
export default transporter;