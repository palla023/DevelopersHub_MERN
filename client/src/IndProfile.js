import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './IndProfile.css'

const IndProfile = () => {
  let params = useParams();
  const [rating, setRating] = useState(null);
  const [taskprovider, setTaskprovider] = useState(null);

  // Fetch the task provider when the component mounts
  useEffect(() => {
    const fetchTaskProvider = async () => {
      try {
        const res = await axios.get("http://localhost:5000/myprofile", {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        });
        setTaskprovider(res.data.fullname);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 400) {
            alert(err.response.data);
          } else {
            alert("Internal Server Error");
          }
        }
      }
    };

    fetchTaskProvider();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (params.fullname.trim().toLowerCase() !== taskprovider.trim().toLowerCase()) {
      if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Please enter a valid number between 1 and 5 for the rating");
        return;
      }

      let review = {
        taskprovider,
        taskworker: params.fullname,
        rating,
      };

      try {
        const res = await axios.post("http://localhost:5000/addreview", review, {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        });
        alert(res.data);
        setRating("")
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Task provider and task worker cannot be the same.");
    }
  };

  return (
    <div className="profile-page">
      <nav className='navbar bg-dark'>
        <h1 className='navbar-brand'>
          <Link to="/dashboard" className='brand-link'><i className='fas fa-code'></i> Developers Hub</Link>
        </h1>
        <ul className='navbar-menu'>
          <li><Link to="/dashboard" className='nav-link'>Dashboard</Link></li>
          <li><Link to="/login" className='nav-link' onClick={() => localStorage.removeItem('token')}>Logout</Link></li>
        </ul>
      </nav>

      <div className="profile-container container">
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-8' key={params._id}>
              <div className='card profile-card shadow bg-light'>
                <div className='row no-gutters'>
                  <div className='col-md-6 d-flex align-items-center left-section'>
                    <img
                      src="https://wallpapercave.com/wp/wp9566448.jpg"
                      alt=''
                      className='profile-img'
                    />
                    <div className='profile-info'>
                      <h2>{params.fullname}</h2>
                      <p>{params.email}</p>
                    </div>
                  </div>
                  <div className='col-md-6 right-section d-flex flex-column justify-content-center'>
                    <h3>Skills</h3>
                    <ul className='skills-list'>
                      {params.skill.split(',').map(skill => (
                        <li key={skill}><i className='fa fa-check' /> {skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {params.fullname && taskprovider && params.fullname.trim() !== taskprovider.trim() ? (
          <form className="form my-4" onSubmit={submitHandler}>
            <div className="form-group">
              <label><FontAwesomeIcon icon={faGithub} /> Enter Your Reviews</label>
              <input
                type="text"
                placeholder="Enter Your Rating out of 5"
                name="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="form-control mt-1"
                required
              />
              <input
                type="submit"
                className="btn btn-primary mt-2"
                value="Add Rating"
              />
            </div>
          </form>
        ) : (
          <p style={{color:"#F79A8E"}}>Task provider and task worker are the same. The review form is not available.</p>
        )}
      </div>
    </div>
  );
};

export default IndProfile;
