import React from "react";
import "../App.css";

//Need to add proper navigation for "go back home" button
const Error = ({ code, message }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Error {code}</h1>
      <p>{message}</p>
      <a href="/" style={{ textDecoration: "none", color: "blue" }}>
        Go Back Home
      </a>
    </div>
  );
};

export default Error;
