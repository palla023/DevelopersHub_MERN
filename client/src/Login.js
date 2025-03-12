import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const changeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/login", formData).then((res) => {
      localStorage.setItem("token", res.data.token);
      setAuth(true);
    });
  };
  // if(localStorage.getItem('token'))
  // {
  // 	return navigate("/dashboard");
  // }
  if (auth) {
    return navigate("/dashboard");
  }

  return (
    <>
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">
            <i className="fas fa-code"></i>Developers Hub
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign into Your Account
      </p>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={changeHandler}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={changeHandler}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </>
  );
};

export default Login;
