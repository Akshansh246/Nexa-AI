import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// 🔐 Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// 🔑 Set refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// 🚀 Function to create transporter dynamically
async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token, // 🔥 CRITICAL FIX
    },
  });

  return transporter;
}

// 🧪 Optional: verify transporter (for debugging)
export async function verifyTransporter() {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    console.log("✅ Transporter is ready to send emails...");
  } catch (err) {
    console.log("❌ Transporter verification failed:", err);
  }
}
verifyTransporter()

// 📧 Send Email function
export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    };

    const details = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent:", details);
  } catch (err) {
    console.log("❌ Error sending email:", err);
  }
}