import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1>Welcome to Tutorsaurus 🦕</h1>
      <p>Your trusted peer tutoring platform at NUS</p>
      <div>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Log In</button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
