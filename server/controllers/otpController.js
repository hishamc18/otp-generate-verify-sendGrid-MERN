const asyncHandler = require("../middlewares/asyncHandler");
const { sendOtp, verifyOtp } = require("../services/otpService");
const CustomError = require('../utils/customError')

const sendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new CustomError("Email is required");
  }
  const response = await sendOtp(email);
  res.json(response);
});

const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400);
    throw new CustomError("Email and OTP are required");
  }
  const response = await verifyOtp(email, otp);
  res.json(response);
});

module.exports = { sendOtpController, verifyOtpController };