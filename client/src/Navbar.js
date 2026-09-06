import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { getAvatarUrl } from './utils';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE_URL}/myprofile`, {
          headers: { 'x-token': token },
        })
        .then((res) => setCurrentUser(res.data))
        .catch(() => {
          // Token may be invalid or expired
        });
    } else {
      setCurrentUser(null);
    }
  }, [token, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <header className="hub-navbar">
      <Link to={token ? '/dashboard' : '/'} className="brand-container">
        <div className="brand-icon-box">
          <i className="fa-solid fa-code"></i>
        </div>
        <h1 className="brand-title">DevelopersHub</h1>
      </Link>

      <nav>
        <ul className="nav-links-list">
          {token ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-item-link ${
                    location.pathname === '/dashboard' ? 'active' : ''
                  }`}
                >
                  <i className="fa-solid fa-compass"></i> Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/myprofile"
                  className={`nav-item-link ${
                    location.pathname === '/myprofile' ? 'active' : ''
                  }`}
                >
                  <i className="fa-solid fa-user-astronaut"></i> My Profile
                </Link>
              </li>
              {currentUser && (
                <li>
                  <Link to="/myprofile" className="user-profile-badge">
                    <img
                      src={getAvatarUrl(currentUser.fullname, currentUser.avatar)}
                      alt={currentUser.fullname}
                      className="badge-avatar"
                    />
                    <span>{currentUser.fullname.split(' ')[0]}</span>
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  title="Sign out of your account"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`nav-item-link ${
                    location.pathname === '/login' ? 'active' : ''
                  }`}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="nav-item-link btn-nav-primary"
                >
                  Join Community
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
