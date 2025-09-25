import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const logoPath = join(__dirname, "../public/main-logo.webp");

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

const attachments = [
  {
    filename: "logo.png",
    path: join(__dirname, "../../public/main-logo.webp"),
    cid: "appLogo",
  },
];

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
      attachments,
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
      attachments,
    });
  }

  // console.log("Email sent:", info);
  return info;
};
