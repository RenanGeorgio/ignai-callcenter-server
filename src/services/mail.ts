import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "../config/env";

const mailOptions = new SMTPTransport({
    host: config.email.host,
    port: config.email.port,
    ...(config.email.username ? { auth: { user: config.email.username, pass: config.email.password }}: {})
})

const mail = nodemailer.createTransport(mailOptions);

export default mail;