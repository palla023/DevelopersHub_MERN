import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Myprofile = () => {
  const [data, setData] = useState(null);
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
        <h1>
          <Link>
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
      <div className="profiles container">
        {data && (
          <div className='card shadow w-50  profile bg-light '>
		  <img src="https://wallpapercave.com/wp/wp9566448.jpg" alt='' 
		  style={{borderRadius:'50%'}} />
		  <div>
			  <h2>{data.fullname}</h2>

			  <p>
				  {data.email}
			  </p>
			  <ul>
				  {data.skill.split(",").map(skill =>
					  <li><i className='fa fa-check' />{skill}</li>
				  )}
			  </ul>
			  {/* <p style={{marginLeft:"36px"}}>Hyd</p> */}
			  <Link  className='btn btn-primary' style={{ marginLeft: "36px" }}>
				  View Profile
			  </Link>
		  </div>
	  </div>
		
        )}
        <h1>Reviews and Ratings</h1>
        {review ? (
          review.map((review) => (
            <div style={{ width: "50%" }}>
              {/* who is Given the Rating */}
              <h4>{review.taskprovider}</h4>
              <p>{review.rating}/5</p>
            </div>
          ))
        ) : (
          <p>No Reviews Added Yet</p>
        )}
        <form className="form">
          <div
            className="form-group"
            style={{ border: "1px solid black", width: "50%" }}
          >
            <label><FontAwesomeIcon icon={faGithub } />  Enter Your Reviews</label>
            <input
              type="text"
              placeholder="Enter Your Rating"
              name="text"
              value=""
              // onChange={changeHandler}  onSubmit={submitHandler}
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

export default Myprofile;
