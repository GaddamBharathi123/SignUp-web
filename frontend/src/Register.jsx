import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");   
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/register", formData);
      setSuccess(res.data.message || "Account created! Redirecting to login…");

      
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>

        {/* Error banner */}
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="alert alert-success py-2" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name — BUG FIX: was name="email", now name="name" */}
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"               
              value={formData.name}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="reg-email">
              <strong>Email</strong>
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password">
              <strong>Password</strong>
            </label>
            <input
              id="reg-password"
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
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="mt-2 mb-1">Already have an account?</p>

          <button
            type="button"
            className="btn btn-default border w-100 bg-light rounded-0"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;