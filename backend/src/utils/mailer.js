const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, OTP_EXPIRES_IN_MINUTES } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"SignUp App" <${SMTP_FROM}>`,
    to: toEmail,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="color: #555;">Use the OTP below to verify your email. It expires in <strong>${OTP_EXPIRES_IN_MINUTES} minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4CAF50; text-align: center; padding: 24px 0;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };