import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "./api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setResendSuccess("");

    try {
      await api.post("/auth/send-otp", { email });
      setResendSuccess("A new OTP has been sent to your email.");
      setOtp("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP.";
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
      <div className="bg-white p-3 rounded w-25">
        <h2>Verify OTP</h2>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Enter the 6-digit OTP sent to <strong>{email || "your email"}</strong>.
        </p>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="alert alert-success py-2" role="alert">
            {resendSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!emailFromState && (
            <div className="mb-3">
              <label htmlFor="verify-email">
                <strong>Email</strong>
              </label>
              <input
                id="verify-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="form-control rounded-0"
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="otp-input">
              <strong>OTP</strong>
            </label>
            <input
              id="otp-input"
              type="text"
              placeholder="Enter 6-digit OTP"
              autoComplete="off"
              name="otp"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(val);
                setError("");
              }}
              className="form-control rounded-0 text-center"
              style={{ letterSpacing: "8px", fontSize: "22px" }}
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying…" : "Verify OTP"}
          </button>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <span
              className="text-primary"
              style={{ cursor: resending ? "not-allowed" : "pointer", fontSize: "14px" }}
              onClick={!resending ? handleResend : undefined}
            >
              {resending ? "Resending…" : "Resend OTP"}
            </span>

            <span
              className="text-secondary"
              style={{ cursor: "pointer", fontSize: "14px" }}
              onClick={() => navigate("/forgot-password")}
            >
              Change email
            </span>
          </div>

          <button
            type="button"
            className="btn btn-default border w-100 bg-light rounded-0 mt-2"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;