import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const mailOptions = new SMTPTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

const mail = nodemailer.createTransport(mailOptions);

export default mail;