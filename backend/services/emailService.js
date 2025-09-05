import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS use karega
  auth: {
    user: process.env.BREVO_USER, // always "apikey"
    pass: process.env.BREVO_PASS, // Brevo API key
  },
});

export default async function sendEmail(to, subject, message) {
  try {
    const info = await transporter.sendMail({
      from: `"Return Verification" <nidhidevi425@gmail.com>`, // yaha apna domain ya gmail dal sakte ho
      to,
      subject,
      text: message,
    });

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    return false;
  }
}
