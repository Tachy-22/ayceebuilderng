"use server";

import nodemailer from "nodemailer";

interface ConfirmationData {
  subject: string;
  content: string;
  recipients: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ subject, content, recipients }: ConfirmationData) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: subject,
      html: content,
    });
    

    return { success: true };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
}

