import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendNoReplyEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        headers: {
            "Reply-To": "no-reply@eventpress.com",
        },
    });
};
