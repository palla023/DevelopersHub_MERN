import axios from 'axios';
import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

	const [formData, setFormData] = useState({
		fullname: '',
		email: '',
    mobile:'',
    skill:'',
		password: '',
		confirmpassword: ''
	  });
	
	  const { fullname, email,mobile, skill,password, confirmpassword } = formData;
	
	  const changeHandler = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });
	
	  const submitHandler = async e => {
		e.preventDefault();
    axios.post('https://developershub-mern.onrender.com/register', formData).then(
			res =>alert(res.data));
      navigate("/login");
	  };
    
  return (
	
    <Fragment>
      <nav className='navbar bg-dark' >
				<h1>
					<Link to='/'><i className='fas fa-code'></i>Developers Hub</Link>
				</h1>
				<ul>
				<li><Link to="/register">
						Register
					</Link></li>
					<li><Link to="/login">
						Login
					</Link></li>
				</ul>
			</nav>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="fullname"
            value={fullname}
            onChange={changeHandler}
            required
          />
        </div>
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
            type="text"
            placeholder="Mobile"
            name="mobile"
            value={mobile}
            onChange={changeHandler}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="skill"
            name="skill"
            value={skill}
            onChange={changeHandler}
            required
          />
          <small>Example: HTML, CSS, JavaScript</small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmpassword"
            minLength="6"
            value={confirmpassword}
            onChange={changeHandler}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
	  
    </Fragment>
  )
}

export default Register
