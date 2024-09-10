import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const mailOptions = new SMTPTransport({
    host: process.env.EMAIL_HOST ? process.env.EMAIL_HOST.replace(/[\\"]/g, '') : "",
    port: parseInt(process.env.EMAIL_PORT ? process.env.EMAIL_PORT.replace(/[\\"]/g, '') : '465'),
    auth: {
        user: process.env.EMAIL_USERNAME ? process.env.EMAIL_USERNAME.replace(/[\\"]/g, '') : "",
        pass: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/[\\"]/g, '') : ""
    }
})

const mail = nodemailer.createTransport(mailOptions);

export default mail;