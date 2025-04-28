"use server";

import nodemailer from "nodemailer";

interface ConfirmationData {
  subject: string;
  content: string;
  recipients: string;
}

// Create a transporter using Namecheap Private Email's SMTP settings
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com", // SMTP host for Namecheap Private Email
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // Your full email address (e.g., you@yourdomain.com)
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password if using 2FA
  },
});

export async function sendEmail({ subject, content, recipients }: ConfirmationData) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender email address
      to: recipients, // Recipient email address
      subject: subject, // Email subject
      html: content, // HTML content of the email
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
}
