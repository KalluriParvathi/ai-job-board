import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    new_password: "",
  });

  const resetPassword = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        "https://ai-job-board-jq0f.onrender.com/forgot-password",
        form
      );

      alert("Password Updated Successfully");

      navigate("/login");

    } catch (err) {

      if (err.response) {
        alert(err.response.data.detail);
      } else {
        alert("Something went wrong");
      }

    }

  };

  return (

    <div className="container">

      <h1>Forgot Password</h1>

      <form
        className="form"
        onSubmit={resetPassword}
      >

        <input
          type="email"
          placeholder="Registered Email"
          value={form.email}
          onChange={(e)=>
            setForm({
              ...form,
              email:e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={form.new_password}
          onChange={(e)=>
            setForm({
              ...form,
              new_password:e.target.value
            })
          }
        />

        <button type="submit">
          Update Password
        </button>

      </form>

      <p style={{textAlign:"center"}}>

        <Link to="/login">
          Back to Login
        </Link>

      </p>

    </div>

  );

}

export default ForgotPassword;