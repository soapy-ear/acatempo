import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

//Created with the help of https://www.youtube.com/watch?v=cjqfF5hyZFg

const Register = ({ setAuth }) => {
  //State to store user inputs (email, password and name)
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    user_specialisation: "student",
  });

  //Destructure values from inputs state
  const { email, password, name, user_specialisation } = inputs;

  //Handles changes in input fields, updates state dynamically based on input name attribute.
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //Handles form submission for user registration. Sends a POST request to the backend with user credentials.
  //If successful, stores the JWT token and updates authentication state.
  const onSubmitForm = async (e) => {
    // Prevent default form submission behaviour
    e.preventDefault();

    try {
      // Create request body with input values
      const body = { email, password, name, user_specialisation };

      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
        body: JSON.stringify(body), // Convert body object to JSON format
      });

      // Parse the JSON response
      const parseRes = await response.json();

      if (response.ok && parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true); // Only set auth after successful registration
      } else {
        alert(parseRes.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Fragment>
      <h1 className="text-center my-5">Register</h1>
      {/* Registration Form */}
      <form onSubmit={onSubmitForm}>
        {/* Email Input Field */}
        <input
          type="email"
          name="email"
          placeholder="email"
          className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
        />
        {/* Password Input Field */}
        <input
          type="password"
          name="password"
          placeholder="password"
          className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
        />
        {/* Name Input Field */}
        <input
          type="text"
          name="name"
          placeholder="name"
          className="form-control my-3"
          value={name}
          onChange={(e) => onChange(e)}
        />
        {/* Role Selection (Dropdown) */}
        <select
          name="user_specialisation"
          className="form-control my-3"
          value={user_specialisation}
          onChange={onChange}
          required
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
        {/* Submit Button */}
        <button className="btn btn-success w-100">Submit</button>
      </form>
      {/* Link to Login Page */}
      <Link to="/login">Already have an account? Log in here</Link>
    </Fragment>
  );
};

export default Register;
