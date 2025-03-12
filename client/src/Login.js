import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css'

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
    try {
      await axios.post("http://localhost:5000/login", formData).then((res) => {
        localStorage.setItem("token", res.data.token);
        setAuth(true);
      });
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          alert(err.response.data)
        } else {
          alert("Internal Server Error")
        }
      }
    }
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
        <h3>
          <Link to="/">
            <i className="fas fa-code"></i> Developers Hub
          </Link>
        </h3>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-primary pt-5">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign into Your Account
      </p>
      <form className="form" onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={changeHandler}
          className='my-2 rounded'
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          minLength="6"
          className='my-2 rounded'
          value={password}
          onChange={changeHandler}
        />
        <input type="submit" className="btn btn-primary loginButton" value="Login" />
      </form>
      <p className="signup-prompt">
        Don't have an account? <Link to="/register" className="naviagte-link">Sign Up</Link>
      </p>


    </>
  );
};

export default Login;
