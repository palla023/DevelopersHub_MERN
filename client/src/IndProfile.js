import axios from "axios";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const IndProfile = () => {
  let params = useParams();
  const [rating, setRating] = useState(null);
  const [taskprovider, setTaskprovider] = useState(null);
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .get("https://developershub-mern.onrender.com/myprofile", {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      })
      .then((res) => setTaskprovider(res.data.fullname));  //for getting loggedin user
    let review = {
      taskprovider,
      taskworker: params.id,
      rating,
    };
    axios
      .post("https://developershub-mern.onrender.com/addreview", review, {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      })
      .then((res) => alert(res.data));
  };
  return (
    <div>
      <nav className="navbar bg-dark">
        <h1>
          <Link >
            <i className="fas fa-code"></i>Developers Hub
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login" onClick={() => localStorage.removeItem("token")}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <div className="profiles">
        {/* {data && */}
        <div className="card shadow w-50  profile bg-light ">
          <img
            src="https://wallpapercave.com/wp/wp9566448.jpg"
            alt=""
            style={{ borderRadius: "50%" }}
          />
          <div>
            <h2>{params.fullname}</h2>

            <p>{params.email}</p>
            <ul>
              {params.skill.split(",").map((skill) => (
                <li>
                  <i className="fa fa-check" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* } */}
        <form className="form" onSubmit={submitHandler}>
          <div
            className="form-group"
            style={{ border: "1px solid black", width: "50%" }}
          >
            <label><FontAwesomeIcon icon={faGithub } />  Enter Your Reviews</label>
            <input
              type="text"
              placeholder="Enter Your Rating"
              name="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="mt-1"
            />
            <input
              type="submit"
              className="btn btn-primary m-2"
              value="Add Rating"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndProfile;
