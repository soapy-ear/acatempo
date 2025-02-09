import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch("https://acatempo.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include", // ✅ Ensure proper handling of credentials
      });

      const parseRes = await response.json();
      console.log("Login Response:", parseRes); // Debugging: Check what the API returns

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token); // ✅ Save token
        setAuth(true);
        setErrorMessage(""); // ✅ Clear errors on success
      } else {
        setAuth(false);
        setErrorMessage(parseRes.error || "Login failed: Invalid credentials"); // ✅ Show error
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      setAuth(false);
      setErrorMessage("Server error: Unable to log in"); // ✅ Handle server errors
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Login</h1>
      {errorMessage && (
        <p className="alert alert-danger">{errorMessage}</p>
      )}{" "}
      {/* ✅ Show errors */}
      <form onSubmit={onSubmitForm}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control my-3"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control my-3"
          value={password}
          onChange={onChange}
          required
        />
        <button className="btn btn-success w-100">Submit</button>
      </form>
      <Link to="/register">No account? Register here</Link>
    </Fragment>
  );
};

export default Login;
