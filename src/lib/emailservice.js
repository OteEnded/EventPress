import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },
});

export const sendEmail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: `"EventPress" <ratnarit.j@ku.th>`,
    to,
    subject,
    html,
  });
};