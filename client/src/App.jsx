import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const BASE_URL = "http://localhost:3300/api/otp";

const App = () => {
  const [email, setEmail] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/send-otp`, { email });
      setShowOtpField(true);
      setResponseMessage(res.data.message);
    } catch (error) {
      setResponseMessage("Failed to send OTP ❌");
    }
    setLoading(false);
  };

  const handleOtpChange = (index, e) => {
    let value = e.target.value.toUpperCase();
    if (!/^[A-Z]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 4) {
      alert("Please enter a 4-letter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp: otpCode,
      });
      setResponseMessage(res.data.message);
    } catch (error) {
      console.log(error);
      setResponseMessage("Invalid OTP ❌");
    }
    setLoading(false);
  };

  return (
      <div className="auth-container">
        {!showOtpField ? (
          <div className="email-section">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
            <button onClick={handleEmailSubmit} className="send-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="otp-section">
            <h2>Enter OTP</h2>
            <p className="email-display">{email}</p> {/* Show email here */}
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                />
              ))}
            </div>
            <button onClick={handleVerifyOtp} className="verify-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {responseMessage && <p className="response-msg">{responseMessage}</p>}
          </div>
        )}
      </div>
    );
  }
  
export default App;
