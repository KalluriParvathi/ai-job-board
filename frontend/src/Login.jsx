import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://ai-job-board-jq0f.onrender.com/login",
        form
      );

      localStorage.setItem("token", res.data.access_token);

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="container">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Login</h1>

        <button
          style={{
            width: "140px",
            background: darkMode ? "#facc15" : "#374151",
            color: darkMode ? "black" : "white",
          }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      <form onSubmit={login} className="form">

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          type="button"
          style={{
            background: "#6b7280",
            marginBottom: "10px",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </button>

        <button type="submit">
          Login
        </button>

      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        <Link to="/forgot-password">
          Forgot Password?
        </Link>
      </p>

      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>

    </div>
  );
}

export default Login;