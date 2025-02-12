import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

//Had the help of https://www.youtube.com/watch?v=cjqfF5hyZFg throughout

const Login = ({ setAuth }) => {
  //State to store the user's input (email and password)
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  //State to store error message if login fails
  const [errorMessage, setErrorMessage] = useState("");

  //Destructure email and password from the inputs state
  const { email, password } = inputs;

  /**
   * Handle changes in input fields
   * Updates state as the user types in the email and password fields
   */

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  /**
   * Handles the form submission for user login
   * Sends a POST request to the backend with email and password
   * If successful, stores the JWT token in localStorage and sets authentication state
   */
  const onSubmitForm = async (e) => {
    e.preventDefault(); // Prevent default form submission behaviour
    try {
      const body = { email, password }; // Create request body with user credentials

      // Send a POST request to the authentication API endpoint
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
        body: JSON.stringify(body), // Convert the body object to JSON
      });

      // Parse the JSON response
      const parseRes = await response.json();

      // If the server responds with a valid JWT token, store it in localStorage
      if (parseRes.token) localStorage.setItem("token", parseRes.token);
      setAuth(true); // Update authentication state
      //console.log(parseRes); for testing, uncomment for testing 
    } catch (err) {
      console.error(err.message); // Log any errors to the console
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Login</h1>
      {/* Login Form */}
      <form onSubmit={onSubmitForm}>
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="email"
          className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
        ></input>
        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="password"
          className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
        ></input>
        {/* Submit Button */}
        <button className="btn btn-success w-100">Submit</button>
      </form>
      {/* Link to Register Page */}
      <Link to="/register">No account? Register here</Link>
    </Fragment>
  );
};

export default Login;
