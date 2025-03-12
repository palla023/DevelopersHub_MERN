import axios from 'axios';
import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobile: '',
    skill: '',
    password: '',
    confirmpassword: ''
  });

  const { fullname, email, mobile, skill, password, confirmpassword } = formData;

  const changeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async e => {
    e.preventDefault();
    axios.post('http://localhost:5000/register', formData).then(
      res => alert(res.data));
    navigate("/login");
  };

  return (

    <Fragment>
      <nav className='navbar bg-dark' >
        <h3>
          <Link to='/'><i className='fas fa-code'></i> Developers Hub</Link>
        </h3>
        <ul>
          <li><Link to="/register">
            Register
          </Link></li>
          <li><Link to="/login">
            Login
          </Link></li>
        </ul>
      </nav>
      <h1 className="large text-primary mt-5">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={submitHandler}>
        <input
          className='my-2 rounded' type="text"
          placeholder="Name"
          name="fullname"
          value={fullname}
          onChange={changeHandler}
          required
        />


        <input
          className='my-2 rounded' type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={changeHandler}
          required
        />

        <input
          className='my-2 rounded' type="text"
          placeholder="Mobile"
          name="mobile"
          value={mobile}
          onChange={changeHandler}
          required
        />

        <input
          className='my-2 rounded' type="text"
          placeholder="skill"
          name="skill"
          value={skill}
          onChange={changeHandler}
          required
        />   
        <small style={{color:"#a00b0b"}}>Please Provide skills by seperation of Comma -  Example: HTML, CSS, JavaScript</small>

        <input
          className='my-2 rounded' type="password"
          placeholder="Password"
          name="password"
          minLength="6"
          value={password}
          onChange={changeHandler}
        />
        <input
          className='my-2 rounded' type="password"
          placeholder="Confirm Password"
          name="confirmpassword"
          minLength="6"
          value={confirmpassword}
          onChange={changeHandler}
        />
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="signup-prompt">
        If you already having account already please go thorugh LoginPage? <Link to="/login" className="naviagte-link">Login</Link>
      </p>

    </Fragment>
  )
}

export default Register