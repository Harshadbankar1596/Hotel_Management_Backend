import transporter from "../config/nodemaile/nodemailer.js"; 

const sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: `"Hotel Management" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;