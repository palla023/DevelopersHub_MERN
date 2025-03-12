import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import './Myprofile.css'

const Myprofile = () => {
  const [data, setData] = useState(null); //my profile is a single object of contains Logged user details taken from the middleware JWT
  const [review, setReview] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/myprofile", {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      })
      .then((res) => setData(res.data));

    axios
      .get("http://localhost:5000/myreview", {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      })
      .then((res) => setReview(res.data));
  }, []);
  if (!localStorage.getItem("token")) {
    return navigate("/login");
  }

  return (
    <div>
      <nav className="navbar bg-dark">
        <h1 className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <i className="fas fa-code"></i> Developers Hub
          </Link>
        </h1>
        <ul className="navbar-menu">
          <li>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li>
            <Link to="/login" className="nav-link" onClick={() => localStorage.removeItem("token")}>Logout</Link>
          </li>
        </ul>
      </nav>

      <div className="container profiles">
        {data && (
          <div className="card shadow profile-card bg-light">
            <div className="row no-gutters">
              <div className="col-md-6 d-flex align-items-center left-section">
                <img src="https://wallpapercave.com/wp/wp9566448.jpg" alt='' className="profile-img" />
                <div className="profile-info">
                  <h2>{data.fullname}</h2>
                  <p>{data.email}</p>
                  <Link to={`/indprofile/${data.fullname}/${data.email}/${data.skill}/${data._id}`} className='btn btn-primary'>
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="col-md-6 right-section">
                <h3>Skills</h3>
                <ul className="skills-list">
                  {data.skill.split(',').map(skill => (
                    <li key={skill}><i className='fa fa-check' /> {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}


        <h1 className="mt-4">Reviews and Ratings</h1>
        {review && review.length > 0 ? (
          review.map((review, index) => (
            <div className="review-card my-2" key={index}>
              <h4>{review.taskprovider}</h4>
              <p>{review.rating}/5</p>
            </div>
          ))
        ) : (
          <p>No Reviews Added Yet</p>
        )}
      </div>
    </div>
  );
};

export default Myprofile;
