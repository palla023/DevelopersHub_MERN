import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, Navigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import { getAvatarUrl, calculateAverageRating, timeAgo } from './utils';
import { useToast } from './Toast';
import './IndProfile.css';

const IndProfile = () => {
  const params = useParams();
  const { showToast } = useToast();
  const token = localStorage.getItem('token');

  const [devUser, setDevUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Fetch logged in user to check if self-review
    axios
      .get(`${API_BASE_URL}/myprofile`, {
        headers: { 'x-token': token },
      })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error(err));

    // Fetch target developer details
    axios
      .get(`${API_BASE_URL}/userprofile/${params.id}`, {
        headers: { 'x-token': token },
      })
      .then((res) => setDevUser(res.data))
      .catch(() => {
        // Fallback to route parameters if individual route fails
        setDevUser({
          _id: params.id,
          fullname: decodeURIComponent(params.fullname),
          email: decodeURIComponent(params.email),
          skill: decodeURIComponent(params.skill),
          experience: 'Full Stack Developer',
        });
      })
      .finally(() => setLoading(false));

    // Fetch target developer's reviews
    axios
      .get(`${API_BASE_URL}/userreviews/${params.id}`, {
        headers: { 'x-token': token },
      })
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, token]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      showToast('Please select a star rating between 1 and 5', 'error');
      return;
    }

    if (currentUser && devUser && currentUser._id.toString() === devUser._id.toString()) {
      showToast('You cannot review your own profile', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const reviewPayload = {
        taskworker: devUser._id || params.id,
        rating: rating.toString(),
        comment,
      };

      const res = await axios.post(`${API_BASE_URL}/addreview`, reviewPayload, {
        headers: { 'x-token': token },
      });

      showToast(res.data || 'Review submitted successfully!', 'success');

      // Add to local reviews list immediately
      const newRev = {
        _id: Date.now().toString(),
        taskprovider: currentUser ? currentUser.fullname : 'You',
        rating: rating.toString(),
        comment,
        createdAt: new Date().toISOString(),
      };
      setReviews([newRev, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      const msg =
        err.response && typeof err.response.data === 'string'
          ? err.response.data
          : 'Failed to submit review. Please try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: '#6366f1' }}></i>
          <h3 style={{ marginTop: '16px' }}>Loading Developer Profile...</h3>
        </div>
      </div>
    );
  }

  const isSelf =
    currentUser &&
    devUser &&
    (currentUser._id.toString() === devUser._id.toString() ||
      currentUser.fullname.toLowerCase() === devUser.fullname.toLowerCase());

  const avgRating = calculateAverageRating(reviews);

  return (
    <div className="profile-page-wrapper">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/dashboard" className="btn-modern-secondary" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Developers Directory
        </Link>
      </div>

      {/* Hero Profile Card */}
      {devUser && (
        <div className="glass-card profile-hero-card">
          <div className="profile-hero-content">
            <img
              src={getAvatarUrl(devUser.fullname, devUser.avatar)}
              alt={devUser.fullname}
              className="profile-avatar-large"
            />
            <div className="profile-header-info">
              <h1 className="profile-name">
                {devUser.fullname}
                <span className="rating-badge">
                  <i className="fa-solid fa-star"></i> {avgRating > 0 ? avgRating : 'New'}
                </span>
              </h1>

              <div className="profile-role-badge">
                <i className="fa-solid fa-laptop-code"></i> {devUser.experience || 'Full Stack Developer'}
              </div>

              <div className="profile-contact-row">
                <span className="contact-chip">
                  <i className="fa-solid fa-envelope"></i> {devUser.email}
                </span>
                {devUser.mobile && (
                  <span className="contact-chip">
                    <i className="fa-solid fa-phone"></i> {devUser.mobile}
                  </span>
                )}
              </div>

              {devUser.bio ? (
                <p className="profile-bio-text">{devUser.bio}</p>
              ) : (
                <p className="profile-bio-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
                  No bio provided yet.
                </p>
              )}

              <div className="profile-actions-bar">
                {devUser.github && (
                  <a
                    href={devUser.github.startsWith('http') ? devUser.github : `https://${devUser.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-modern-secondary"
                  >
                    <i className="fa-brands fa-github"></i> GitHub Profile
                  </a>
                )}
                {devUser.linkedin && (
                  <a
                    href={devUser.linkedin.startsWith('http') ? devUser.linkedin : `https://${devUser.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-modern-secondary"
                  >
                    <i className="fa-brands fa-linkedin"></i> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div className="glass-card profile-section-card">
        <h2 className="section-title">
          <i className="fa-solid fa-code" style={{ color: '#6366f1' }}></i> Verified Skills
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {devUser && devUser.skill ? (
            devUser.skill
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((skill) => (
                <span key={skill} className="skill-pill" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <i className="fa-solid fa-check"></i> {skill}
                </span>
              ))
          ) : (
            <p style={{ color: '#64748b' }}>No skills specified</p>
          )}
        </div>
      </div>

      {/* Reviews Received */}
      <div className="glass-card profile-section-card">
        <h2 className="section-title">
          <i className="fa-solid fa-star-half-stroke" style={{ color: '#f59e0b' }}></i> Peer Reviews & Endorsements ({reviews.length})
        </h2>

        {reviews.length > 0 && (
          <div className="reviews-summary-bar">
            <div className="reviews-score-box">
              <span className="score-number">{avgRating}</span>
              <span className="score-max">/ 5.0</span>
            </div>
            <div>
              <div className="star-rating-display">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star ${star <= Math.round(avgRating) ? 'fa-solid' : 'fa-regular'}`}
                  ></i>
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Based on {reviews.length} peer recommendation{reviews.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div key={r._id || i} className="single-review-card">
                <div className="review-card-top">
                  <div className="reviewer-name">
                    <i className="fa-solid fa-user-check" style={{ color: '#10b981' }}></i>{' '}
                    {r.taskprovider}
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>
                      • {timeAgo(r.createdAt)}
                    </span>
                  </div>

                  <div className="star-rating-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fa-star ${star <= parseInt(r.rating, 10) ? 'fa-solid' : 'fa-regular'}`}
                      ></i>
                    ))}
                  </div>
                </div>

                {r.comment && <p className="review-comment-text">"{r.comment}"</p>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
            <p style={{ margin: 0 }}>This developer has not received any reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>

      {/* Write a Review Section */}
      {!isSelf ? (
        <div className="glass-card profile-section-card review-form-card">
          <h2 className="review-form-title">
            <i className="fa-solid fa-award" style={{ color: '#f59e0b' }}></i> Leave a Peer Review for {devUser ? devUser.fullname : 'Developer'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '18px' }}>
            Share your collaboration experience or endorse this developer's technical skills.
          </p>

          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Overall Rating (1 to 5 Stars)</label>
              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star ${(hoverRating || rating) >= star ? 'fa-solid active' : 'fa-regular'}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  ></i>
                ))}
                <span style={{ fontSize: '1rem', color: '#cbd5e1', marginLeft: '8px', alignSelf: 'center' }}>
                  {hoverRating || rating} / 5
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Written Feedback / Endorsement</label>
              <textarea
                className="modern-textarea"
                rows={3}
                placeholder="e.g. Fantastic problem solving and React architecture skills. Great communication throughout the sprint..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-modern-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Submitting Review...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i> Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="self-review-notice">
          <i className="fa-solid fa-circle-info"></i>
          <span>This is your public developer profile. You cannot review your own profile.</span>
        </div>
      )}
    </div>
  );
};

export default IndProfile;
