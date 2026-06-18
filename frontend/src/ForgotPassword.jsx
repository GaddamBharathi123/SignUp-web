import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/send-otp", { email });
      setSuccess("OTP sent! Check your inbox.");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login with OTP</h2>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Enter your registered email and we'll send you a 6-digit OTP.
        </p>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success py-2" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="forgot-email">
              <strong>Email</strong>
            </label>
            <input
              id="forgot-email"
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

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={loading}
          >
            {loading ? "Sending OTP…" : "Send OTP"}
          </button>

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

export default ForgotPassword;