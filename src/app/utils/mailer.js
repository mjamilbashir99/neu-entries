import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER, // Your Gmail address
    pass: process.env.EMAIL_SERVER_PASSWORD, // Your Gmail App Password (Not your actual password)
  },
});

export default transporter;
