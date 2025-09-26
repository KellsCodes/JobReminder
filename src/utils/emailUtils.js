import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ejs from "ejs";

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

export const sendEmail = async (to, subject, emailHtmlData) => {
  let info;
  try {
    const mailBody = await ejs.renderFile(
      path.join(__dirname, "../templates/emailReminder.ejs"),
      { emailHtmlData },
      {
        async: true,
      }
    );
    const mailOptions = {
      from: {
        name: "Time.it",
      },
      to,
      subject,
      html: mailBody,
      attachments,
    };
    if (process.env.NODE_ENV === "development") {
      info = await mailTrapTransport.sendMail({
        ...mailOptions,
        from: { ...mailOptions.from, address: process.env.GMAIL_USER },
      });
    } else {
      info = await gmailTransport.sendMail({
        ...mailOptions,
        from: { ...mailOptions.from, address: process.env.GMAIL_USER },
      });
    }
  } catch (error) {
    console.error(error);
  }
  return info;
};
