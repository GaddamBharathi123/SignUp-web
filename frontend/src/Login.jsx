import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", formData);

      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>

        {/* Error banner */}
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="login-email">
              <strong>Email</strong>
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="login-password">
              <strong>Password</strong>
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          <p className="mt-2 mb-1">Don't have an account?</p>

          <button
            type="button"
            className="btn btn-default border w-100 bg-light rounded-0"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;