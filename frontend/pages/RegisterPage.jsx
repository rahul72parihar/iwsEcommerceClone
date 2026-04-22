import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../src/store/slices/authSlice";
import { loadCart } from "../src/store/slices/uiSlice";
import { apiService } from "../services/api.js";
import "../styles/LoginPage.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { data, status } = await apiService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (status === "success") {
      const loginData = await apiService.login({
        email: formData.email,
        password: formData.password,
      });

      if (loginData.status === "success") {
        dispatch(
          loginSuccess({
            user: loginData.data.user || loginData.data,
            token: loginData.data.token,
          })
        );

        dispatch(loadCart()); // 🔥 critical fix
        navigate("/");
      } else {
        setError(loginData.data?.message || "Login failed after register");
      }
    } else {
      setError(data?.message || "Registration failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join us today</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {["name", "email", "password", "confirmPassword"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field}</label>
                <input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            ))}

            <button className="login-button" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p>
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}