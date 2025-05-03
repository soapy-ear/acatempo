import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

// Had the help of https://www.youtube.com/watch?v=cjqfF5hyZFg throughout

// Component: Login form for authenticating users
const Login = ({ setAuth }) => {
  // Local state to store form inputs
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  // State for displaying error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Destructure values from input state for convenience
  const { email, password } = inputs;

  // Handle changes to input fields
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const onSubmitForm = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      const body = { email, password };

      // Send POST request to login endpoint
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), // Send login credentials as JSON
      });

      const parseRes = await response.json();

      // If login successful, store token and specialisation in localStorage
      if (response.ok && parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        localStorage.setItem(
          "user_specialisation",
          parseRes.user_specialisation
        );
        setAuth(true); // Update auth state to reflect logged-in status
      } else {
        // Display appropriate error message
        setErrorMessage(parseRes.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err.message);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <Fragment>
      {/* Page heading */}
      <div className="text-center my-4">
        <h1 className="welcome-text">AcaTempo</h1>
        <h2>Login</h2>
      </div>

      {/* Conditionally show error message if login fails */}
      {errorMessage && (
        <p className="alert alert-danger text-center">{errorMessage}</p>
      )}

      {/* Login form */}
      <form onSubmit={onSubmitForm}>
        {/* Email input field */}
        <input
          type="email"
          name="email"
          placeholder="email"
          className="form-control my-3"
          value={email}
          onChange={onChange}
        />

        {/* Password input field */}
        <input
          type="password"
          name="password"
          placeholder="password"
          className="form-control my-3"
          value={password}
          onChange={onChange}
        />

        {/* Submit button */}
        <button className="btn btn-success w-100">Submit</button>
      </form>

      {/* Link to registration page for users without an account */}
      <div className="text-center mt-3">
        <Link to="/register">No account? Register here</Link>
      </div>
    </Fragment>
  );
};

export default Login;
