import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [form, setForm] = useState({
    username: "",
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

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://ai-job-board-jq0f.onrender.com/register",
        form
    );

      alert("Registration Successful!");

      navigate("/login");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.detail);
      } else {
        alert("Registration Failed");
      }
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
        <h1>Register</h1>

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

      <form onSubmit={register} className="form">

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

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
          {showPassword
            ? "Hide Password"
            : "Show Password"}
        </button>

        <button type="submit">
          Register
        </button>

      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "15px",
        }}
      >
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>

    </div>
  );
}

export default Register;