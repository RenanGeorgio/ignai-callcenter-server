import mail from "../services/mail";

export default async function sendEmail(destinationEmail: string, subject: string, html: string) {
    const send = await mail.sendMail({
        from: '"DiamondBigger"<info@supplyfy.com.br>',
        to: destinationEmail,
        subject,
        html
    });

    return send;
}