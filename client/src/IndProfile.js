import axios from 'axios';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const IndProfile = () => {
	let params = useParams();
	const [rating, setRating] = useState(null);
	const [taskprovider, setTaskprovider] = useState(null);
	const submitHandler = e => {
		e.preventDefault();
		axios.get('http://localhost:8000/myprofile', {
			headers: {
				'x-token': localStorage.getItem('token')
			}
		}).then(res => setTaskprovider(res.data.fullname))
		let review = {
			taskprovider,
			taskworker:params.id,
			rating
		}
		axios.post('http://localhost:8000/addreview', review, {
			headers: {
				'x-token': localStorage.getItem('token')
			}
		}).then(res => alert(res.data))
	}
	return (
		<div>
			<nav className='navbar bg-dark' >
				<h1>
					<Link to='/dashboard'><i className='fas fa-code'></i>Developers Hub</Link>
				</h1>
				<ul>
					<li><Link to="/dashboard">
						Dashboard
					</Link></li>
					<li><Link to="/login" onClick={() => localStorage.removeItem('token')}>
						Logout
					</Link></li>
				</ul>
			</nav>
			<div className='profiles'>

				{/* {data && */}
				<div className='profile bg-light'>
					<img src="https://wallpapercave.com/wp/wp9566448.jpg" alt='' className='round-img' />
					<div>
						{/* <h2>{match.params.fullname}</h2> */}
						<p>{params.fullname}</p>
						<p>
							<p>{params.email}</p>
						</p>
						<ul>
							{params.skill.split(",").map(skill =>
								<li><i className='fa fa-check' />{skill}</li>
							)}
						</ul>
					</div>
				</div>
				{/* } */}
				<form className="form" onSubmit={submitHandler}>
					<div className="form-group" style={{ border: "1px solid black" }}>
						<label>Enter Your Reviews</label>
						<input
							type="text"
							placeholder="Enter Your Rating"
							name="text"
							value={rating}
							onChange={e => setRating(e.target.value)}
							required
							className="mt-1"
						/>
						<input type="submit" className="btn btn-primary m-2" value="Add Rating" />
					</div>
				</form>
			</div>
		</div>
	)
}

export default IndProfile
