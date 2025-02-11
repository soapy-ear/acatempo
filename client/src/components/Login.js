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
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) localStorage.setItem("token", parseRes.token);
      setAuth(true);
      //console.log(parseRes); for testing
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="email"
          name="email"
          placeholder="email"
          className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
        ></input>
        <input
          type="password"
          name="password"
          placeholder="password"
          className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
        ></input>
        <button className="btn btn-success w-100">Submit</button>
      </form>
      <Link to="/register">No account? Register here</Link>
    </Fragment>
  );
};

export default Login;
