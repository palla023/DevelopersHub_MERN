import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	useEffect(() => {
		axios.get('https://developershub-mern.onrender.com/allprofiles', {
			headers: {
				'x-token': localStorage.getItem('token')
			}
		}).then(res => setData(res.data));
	}, [])  // eslint-disable-next-line
	if (!localStorage.getItem('token')) {
		return navigate('/login');
	}
	return (
		<div>
			<nav className='navbar bg-dark' >
				<h1>
					<Link ><i className='fas fa-code'></i>Developers Hub</Link>
				</h1>
				<ul>
					<li><Link to="/myprofile">
						My Profile
					</Link></li>
					<li><Link to="/login" onClick={() => localStorage.removeItem('token')}>
						Logout
					</Link></li>
				</ul>
			</nav>
			<Fragment>
				<h1 className='large text-primary'>Developers</h1>
				<p className='lead'>
					<i className='fab fa-connectdevelop' /> Browse and connect with
					developers
				</p>
				<div className='profiles center'>
					{data.length > 0 ?
						data.map(profile =>
							<div className='card shadow w-50  profile bg-light '>
								<img src="https://wallpapercave.com/wp/wp9566448.jpg" alt='' 
								style={{borderRadius:'50%'}} />
								<div>
									<h2>{profile.fullname}</h2>

									<p>
										{profile.email}
									</p>
									<ul>
										{profile.skill.split(",").map(skill =>
											<li><i className='fa fa-check' />{skill}</li>
										)}
									</ul>
									{/* <p style={{marginLeft:"36px"}}>Hyd</p> */}
									<Link to={`/indprofile/${profile.fullname}/${profile.email}/${profile.skill}/${profile._id}`} className='btn btn-primary' style={{ marginLeft: "36px" }}>
										View Profile
									</Link>
								</div>
							</div>) : (
							<h4>No profiles found...</h4>
						)}
				</div>
			</Fragment>

		</div>
	)
}

export default Dashboard
