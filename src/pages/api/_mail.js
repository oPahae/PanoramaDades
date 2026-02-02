import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    const { email, html } = req.query;
    if (!email || !html) return res.status(400).json({ message: 'Missing Infos' });

    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP,
        port: 587,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_API,
        },
    });

    try {
        await transporter.verify();
        await transporter.sendMail({
            from: process.env.BREVO_SENDER,
            to: email,
            subject: 'Code de vérification',
            text: `Votre code de vérification est : ${code}`,
            html,
        });

        return res.status(200).json({ message: 'Email sent!' });
    } catch (message) {
        console.log('Erreur lors de l\'envoi de l\'email :', message);
        return res.status(500).json({ message: 'Failed to send email', details: message.message });
    }
}