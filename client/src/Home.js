import React from 'react'
import { Link } from 'react-router-dom'


const Home = () => {
	return (
		<div>
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
			<section className="landing">
				<div className="dark-overlay">
					<div className="landing-inner">
						<h1 className="x-large">Developer Connector</h1>
						<p className="lead">
							Create a developer profile/portfolio, share posts and get help from
							other developers
						</p>
						<div className="buttons">
							<Link to="/register" className="btn btn-primary">
								Sign Up
							</Link>
							<Link to="/login" className="btn btn-light">
								Login
							</Link>
						</div>
					</div>
				</div>
			</section>

		</div>
	)
}

export default Home
