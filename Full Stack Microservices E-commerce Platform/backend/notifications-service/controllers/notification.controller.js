import nodemailer from "nodemailer";
import twilio from "twilio";

// SETUP THE EMAIL
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// SETUP TWILIO
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendEmail = async (to, subject, message) => {
  console.log(`Sending email to ${to}: ${message}`);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: message,
  });
};

export const sendSMS = async (to, message) => {
  console.log(`Sending SMS to ${to}: ${message}`);
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to,
    body: message,
  });
};
