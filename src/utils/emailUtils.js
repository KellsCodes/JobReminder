import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.GMAIL_SERVICE,
  host: process.env.GMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: {
      name: "Task.it",
      address: process.env.GMAIL_USER,
    },
    to,
    subject,
    html,
  });

  console.log("Email sent:", info);
  return info;
};
