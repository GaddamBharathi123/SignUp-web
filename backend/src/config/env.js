require("dotenv").config();

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: required("MONGO_URI"),

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: required("SMTP_USER"),
  SMTP_PASS: required("SMTP_PASS"),
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER,

  OTP_EXPIRES_IN_MINUTES: parseInt(process.env.OTP_EXPIRES_IN_MINUTES) || 10,
};