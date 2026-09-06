import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import { getAvatarUrl, calculateAverageRating, timeAgo } from './utils';
import { useToast } from './Toast';
import './Myprofile.css';

const Myprofile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = localStorage.getItem('token');

  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    mobile: '',
    skill: '',
    experience: '',
    bio: '',
    github: '',
    linkedin: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Fetch user profile
    axios
      .get(`${API_BASE_URL}/myprofile`, {
        headers: { 'x-token': token },
      })
      .then((res) => {
        setData(res.data);
        setEditForm({
          fullname: res.data.fullname || '',
          mobile: res.data.mobile || '',
          skill: res.data.skill || '',
          experience: res.data.experience || 'Full Stack Developer',
          bio: res.data.bio || '',
          github: res.data.github || '',
          linkedin: res.data.linkedin || '',
          avatar: res.data.avatar || '',
        });
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to load profile', 'error');
      })
      .finally(() => setLoading(false));

    // Fetch user reviews
    axios
      .get(`${API_BASE_URL}/myreview`, {
        headers: { 'x-token': token },
      })
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/myprofile`, editForm, {
        headers: { 'x-token': token },
      });
      setData(res.data);
      setIsEditModalOpen(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/review/${reviewId}`, {
        headers: { 'x-token': token },
      });
      setReviews(reviews.filter((r) => r._id !== reviewId));
      showToast('Review removed successfully', 'success');
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/myprofile`, {
        headers: { 'x-token': token },
      });
      localStorage.removeItem('token');
      showToast('Your account and profile have been deleted.', 'info');
      navigate('/register');
    } catch (err) {
      showToast('Failed to delete account. Please try again.', 'error');
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
          <h3 style={{ marginTop: '16px' }}>Loading Your Profile...</h3>
        </div>
      </div>
    );
  }

  const avgRating = calculateAverageRating(reviews);

  return (
    <div className="profile-page-wrapper">
      {/* Hero Profile Card */}
      {data && (
        <div className="glass-card profile-hero-card">
          <div className="profile-hero-content">
            <img
              src={getAvatarUrl(data.fullname, data.avatar)}
              alt={data.fullname}
              className="profile-avatar-large"
            />
            <div className="profile-header-info">
              <h1 className="profile-name">
                {data.fullname}
                <span className="rating-badge">
                  <i className="fa-solid fa-star"></i> {avgRating > 0 ? avgRating : 'New'}
                </span>
              </h1>

              <div className="profile-role-badge">
                <i className="fa-solid fa-laptop-code"></i> {data.experience || 'Full Stack Developer'}
              </div>

              <div className="profile-contact-row">
                <span className="contact-chip">
                  <i className="fa-solid fa-envelope"></i> {data.email}
                </span>
                <span className="contact-chip">
                  <i className="fa-solid fa-phone"></i> {data.mobile}
                </span>
              </div>

              {data.bio ? (
                <p className="profile-bio-text">{data.bio}</p>
              ) : (
                <p className="profile-bio-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
                  No bio added yet. Click "Edit Profile" to add a bio and social links.
                </p>
              )}

              <div className="profile-actions-bar">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-modern-primary"
                >
                  <i className="fa-solid fa-user-pen"></i> Edit Profile
                </button>

                {data.github && (
                  <a
                    href={data.github.startsWith('http') ? data.github : `https://${data.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-modern-secondary"
                  >
                    <i className="fa-brands fa-github"></i> GitHub
                  </a>
                )}

                {data.linkedin && (
                  <a
                    href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-modern-secondary"
                  >
                    <i className="fa-brands fa-linkedin"></i> LinkedIn
                  </a>
                )}

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="btn-modern-danger"
                  style={{ marginLeft: 'auto' }}
                >
                  <i className="fa-solid fa-trash-can"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div className="glass-card profile-section-card">
        <h2 className="section-title">
          <i className="fa-solid fa-code" style={{ color: '#6366f1' }}></i> Core Technical Skills
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data && data.skill ? (
            data.skill
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((skill) => (
                <span key={skill} className="skill-pill" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <i className="fa-solid fa-check"></i> {skill}
                </span>
              ))
          ) : (
            <p style={{ color: '#64748b' }}>No skills listed</p>
          )}
        </div>
      </div>

      {/* Reviews Received Section */}
      <div className="glass-card profile-section-card">
        <h2 className="section-title">
          <i className="fa-solid fa-star-half-stroke" style={{ color: '#f59e0b' }}></i> Peer Reviews & Ratings ({reviews.length})
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
            {reviews.map((r) => (
              <div key={r._id} className="single-review-card">
                <div className="review-card-top">
                  <div className="reviewer-name">
                    <i className="fa-solid fa-user-check" style={{ color: '#10b981' }}></i>{' '}
                    {r.taskprovider}
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>
                      • {timeAgo(r.createdAt)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="star-rating-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fa-star ${star <= parseInt(r.rating, 10) ? 'fa-solid' : 'fa-regular'}`}
                        ></i>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Remove review"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                {r.comment && <p className="review-comment-text">"{r.comment}"</p>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
            <i className="fa-regular fa-face-smile" style={{ fontSize: '2.5rem', marginBottom: '12px', display: 'block' }}></i>
            <p style={{ margin: 0 }}>No reviews received yet. Other developers can review your work from your public profile.</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: '#6366f1' }}></i> Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="modern-input"
                  value={editForm.fullname}
                  onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="input-label">Phone / Mobile</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Primary Role / Title</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Skills (Comma Separated)</label>
                <input
                  type="text"
                  className="modern-input"
                  value={editForm.skill}
                  onChange={(e) => setEditForm({ ...editForm, skill: e.target.value })}
                  placeholder="React, Node.js, TypeScript, Docker"
                  required
                />
              </div>

              <div>
                <label className="input-label">Bio</label>
                <textarea
                  className="modern-textarea"
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell other developers about your journey, passions, and tech focus..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="input-label">GitHub URL / Username</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={editForm.github}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="input-label">LinkedIn URL</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={editForm.linkedin}
                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Custom Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  className="modern-input"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  placeholder="https://example.com/photo.jpg (leave empty for auto avatar)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-modern-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modern-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '16px' }}></i>
            <h2 style={{ margin: '0 0 10px 0' }}>Delete Account?</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
              This action is permanent. Your developer profile, all reviews received, and community posts will be permanently erased.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-modern-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn-modern-danger"
                style={{ padding: '10px 20px' }}
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myprofile;
