import nodemailer from "nodemailer";

const gmailTransport = nodemailer.createTransport({
  service: process.env.GMAIL_SERVICE,
  host: process.env.GMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Looking to send emails in production? Check out our Email API/SMTP product!
const mailTrapTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: !isNaN(parseInt(process.env.MAILTRAP_PORT))
    ? parseInt(process.env.MAILTRAP_PORT)
    : 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  let info;
  if (process.env.NODE_ENV === "development") {
    info = await mailTrapTransport.sendMail({
      from: {
        name: "Task.it",
        address: process.env.GMAIL_USER,
      },
      to,
      subject,
      html,
    });
  } else {
    info = await gmailTransport.sendMail({
      from: {
        name: "Task.it",
        address: process.env.GMAIL_USER,
      },
      to,
      subject,
      html,
    });
  }

  // console.log("Email sent:", info);
  return info;
};
