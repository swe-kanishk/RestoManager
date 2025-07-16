import nodemailer from "nodemailer";

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


// function to send Email
export const sendEmail = async (to, subject, text, html) => {
    try {
       const info = await  transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html
       });
       return {success: false, messageId: info.messageId}
    } catch (error) {
        return {success: false, error: error.message}
    }
}