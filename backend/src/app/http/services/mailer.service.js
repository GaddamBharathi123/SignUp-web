const nodemailer = require("nodemailer");
const environment = require("../../../config/environment");
const { createLogger } = require("./logger.service");

const log = createLogger("mailer");

const transporter = nodemailer.createTransport({
  host: environment.smtp.host,
  port: Number(environment.smtp.port),
  secure: Number(environment.smtp.port) === 465,
  auth: {
    user: environment.smtp.user,
    pass: environment.smtp.pass,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  try {
    await transporter.sendMail({
      from: `"SignUp App" <${environment.smtp.from}>`,
      to: toEmail,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#333;">Email Verification</h2>
          <p style="color:#555;">Use the OTP below. It expires in <strong>${environment.auth.otpExpiryMinutes} minutes</strong>.</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4CAF50;text-align:center;padding:24px 0;">${otp}</div>
          <p style="color:#999;font-size:12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    log.info(`OTP email sent to ${toEmail}`);
  } catch (error) {
    log.exception(`Failed to send OTP email to ${toEmail}`, error);
    throw error;
  }
};

module.exports = { sendOtpEmail };