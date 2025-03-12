import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'

const Dashboard = () => {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	useEffect(() => {
		axios.get('http://localhost:5000/allprofiles', {
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
			<nav className='navbar bg-dark'>
					<h1 className='navbar-brand'>
						<Link to="/dashboard" className='brand-link'><i className='fas fa-code'></i> Developers Hub</Link>
					</h1>
					<ul className='navbar-menu'>
						<li><Link to="/myprofile" className='nav-link'>My Profile</Link></li>
						<li><Link to="/login" className='nav-link' onClick={() => localStorage.removeItem('token')}>Logout</Link></li>
					</ul>
			</nav>

			<Fragment>
				<h1 className='large text-primary'>Developers</h1>
				<p className='lead'>
					<i className='fab fa-connectdevelop' /> Browse and connect with developers
				</p>
				<div className='container'>
					<div className='row justify-content-center'>
						{data.length > 0 ? (
							data.map(profile => (
								<div className='col-md-8' key={profile._id}>
									<div className='card shadow profile-card bg-light'>
										<div className='row no-gutters'>
											<div className='left-section col-md-6 d-flex align-items-center'>
												<img
													src="https://wallpapercave.com/wp/wp9566448.jpg"
													alt=''
													className='profile-img'
												/>
												<div className='profile-info'>
													<h2>{profile.fullname}</h2>
													<p>{profile.email}</p>
													<Link
														to={`/indprofile/${profile.fullname}/${profile.email}/${profile.skill}/${profile._id}`}
														className='btn btn-primary'
													>
														View Profile
													</Link>
												</div>
											</div>
											<div className='right-section col-md-6 d-flex flex-column justify-content-center'>
												<h3>Skills</h3>
												<ul className='skills-list'>
													{profile.skill.split(',').map(skill => (
														<li key={skill}><i className='fa fa-check' /> {skill}</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<h4>No profiles found...</h4>
						)}
					</div>
				</div>
			</Fragment>

		</div>
	)
}

export default Dashboard
