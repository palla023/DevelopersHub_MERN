import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import { getAvatarUrl, timeAgo } from './utils';
import { useToast } from './Toast';
import './Dashboard.css';

const QUICK_SKILL_FILTERS = [
  'All',
  'React',
  'Node.js',
  'JavaScript',
  'Python',
  'Full Stack',
  'MongoDB',
  'CSS',
];

const Dashboard = () => {
  const { showToast } = useToast();
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('developers'); // 'developers' | 'feed'
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '',
    link: '',
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Fetch current user details
    axios
      .get(`${API_BASE_URL}/myprofile`, {
        headers: { 'x-token': token },
      })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error(err));

    // Fetch all profiles
    axios
      .get(`${API_BASE_URL}/allprofiles`, {
        headers: { 'x-token': token },
      })
      .then((res) => {
        setProfiles(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to load developers directory', 'error');
      })
      .finally(() => setLoading(false));

    // Fetch community posts
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPosts = () => {
    if (!token) return;
    axios
      .get(`${API_BASE_URL}/allposts`, {
        headers: { 'x-token': token },
      })
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error('Fetch posts error:', err));
  };

  // Filtered Developers
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.fullname && p.fullname.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.skill && p.skill.toLowerCase().includes(q)) ||
        (p.experience && p.experience.toLowerCase().includes(q));

      const matchesSkill =
        selectedSkillFilter === 'All' ||
        (p.skill &&
          p.skill.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

      return matchesSearch && matchesSkill;
    });
  }, [profiles, searchQuery, selectedSkillFilter]);

  // Handle Post Creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      showToast('Title and content are required to share a post', 'error');
      return;
    }

    setPosting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/addpost`, newPost, {
        headers: { 'x-token': token },
      });
      setPosts([res.data, ...posts]);
      setNewPost({ title: '', content: '', tags: '', link: '' });
      showToast('Project / discussion post published!', 'success');
    } catch (err) {
      showToast('Failed to create post. Please try again.', 'error');
    } finally {
      setPosting(false);
    }
  };

  // Handle Like Post
  const handleLikePost = async (postId) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/post/like/${postId}`,
        {},
        { headers: { 'x-token': token } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: res.data } : post
        )
      );
    } catch (err) {
      showToast('Error liking post', 'error');
    }
  };

  // Handle Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/post/${postId}`, {
        headers: { 'x-token': token },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      showToast('Post deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete post', 'error');
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-headline">
          <i className="fa-solid fa-layer-group" style={{ color: '#6366f1' }}></i>{' '}
          Developers Community
        </h1>
        <p className="dashboard-subheadline">
          Browse software developers, view technical profiles, and collaborate on projects.
        </p>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dash-tab-btn ${activeTab === 'developers' ? 'active' : ''}`}
          onClick={() => setActiveTab('developers')}
        >
          <i className="fa-solid fa-users"></i> Developers Directory ({profiles.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <i className="fa-solid fa-bullhorn"></i> Projects & Discussions ({posts.length})
        </button>
      </div>

      {activeTab === 'developers' && (
        <>
          {/* Search & Skill Filter Bar */}
          <div className="search-filter-section">
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                placeholder="Search developers by name, role, email, or skill (e.g. React, Python, MongoDB)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar-input"
              />
            </div>

            <div className="filter-chips-list">
              <span style={{ fontSize: '0.825rem', color: '#64748b', marginRight: '4px' }}>
                Quick Filter:
              </span>
              {QUICK_SKILL_FILTERS.map((skill) => (
                <button
                  key={skill}
                  className={`filter-chip ${
                    selectedSkillFilter === skill ? 'active' : ''
                  }`}
                  onClick={() => setSelectedSkillFilter(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Developers Grid */}
          {loading ? (
            <div className="glass-card empty-state-card">
              <i className="fa-solid fa-circle-notch fa-spin empty-state-icon"></i>
              <h3>Loading Developers...</h3>
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div className="developers-grid">
              {filteredProfiles.map((profile) => (
                <div key={profile._id} className="glass-card developer-card">
                  <div>
                    <div className="dev-card-header">
                      <div className="dev-avatar-box">
                        <img
                          src={getAvatarUrl(profile.fullname, profile.avatar)}
                          alt={profile.fullname}
                          className="dev-avatar"
                        />
                      </div>
                      <div className="dev-main-info">
                        <h2 className="dev-fullname">{profile.fullname}</h2>
                        <div className="dev-role">
                          {profile.experience || 'Full Stack Developer'}
                        </div>
                        <p className="dev-email">{profile.email}</p>
                      </div>
                    </div>

                    {profile.bio && (
                      <p className="dev-bio">{profile.bio}</p>
                    )}

                    <div className="dev-skills-wrapper">
                      {profile.skill &&
                        profile.skill
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((skill) => (
                            <span key={skill} className="skill-pill">
                              <i className="fa-solid fa-code" style={{ fontSize: '0.75rem' }}></i>{' '}
                              {skill}
                            </span>
                          ))}
                    </div>
                  </div>

                  <div className="dev-card-footer">
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {profile.github && (
                        <a
                          href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#94a3b8', fontSize: '1.1rem' }}
                          title="GitHub Profile"
                        >
                          <i className="fa-brands fa-github"></i>
                        </a>
                      )}
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#38bdf8', fontSize: '1.1rem' }}
                          title="LinkedIn Profile"
                        >
                          <i className="fa-brands fa-linkedin"></i>
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/indprofile/${encodeURIComponent(profile.fullname)}/${encodeURIComponent(
                        profile.email
                      )}/${encodeURIComponent(profile.skill)}/${profile._id}`}
                      className="btn-modern-primary"
                      style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                    >
                      <i className="fa-solid fa-id-card"></i> View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card empty-state-card">
              <i className="fa-solid fa-user-slash empty-state-icon"></i>
              <h3>No Developers Found</h3>
              <p>No developers match your current search criteria. Try a different keyword.</p>
              <button
                className="btn-modern-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkillFilter('All');
                }}
              >
                Clear Search Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Community Projects & Feed Tab */}
      {activeTab === 'feed' && (
        <div>
          {/* Create Post Card */}
          <div className="glass-card post-create-card">
            <h2 className="post-create-title">
              <i className="fa-solid fa-pen-nib" style={{ color: '#6366f1' }}></i> Share a Project or Question
            </h2>
            <form onSubmit={handleCreatePost} className="post-create-form">
              <input
                type="text"
                placeholder="Post / Project Title (e.g. Built a Realtime Chat App with WebSockets)"
                className="modern-input"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Describe your project, architecture, challenge, or ask for peer feedback..."
                className="modern-textarea"
                rows={3}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input
                  type="text"
                  placeholder="Tech Tags (e.g. React, Docker, GraphQL)"
                  className="modern-input"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="GitHub / Live Demo Link (https://...)"
                  className="modern-input"
                  value={newPost.link}
                  onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn-modern-primary"
                  disabled={posting}
                >
                  {posting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Publishing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i> Publish Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div className="posts-feed-list">
            {posts.length > 0 ? (
              posts.map((post) => {
                const isLiked =
                  currentUser &&
                  post.likes &&
                  post.likes.some(
                    (like) => (like.user || like).toString() === currentUser._id.toString()
                  );
                const isAuthor =
                  currentUser && post.user && post.user.toString() === currentUser._id.toString();

                return (
                  <div key={post._id} className="glass-card post-card">
                    <div className="post-card-header">
                      <div className="post-author-box">
                        <img
                          src={getAvatarUrl(post.fullname, post.avatar)}
                          alt={post.fullname}
                          className="post-author-avatar"
                        />
                        <div>
                          <h3 className="post-author-name">{post.fullname}</h3>
                          <p className="post-time">{timeAgo(post.createdAt)}</p>
                        </div>
                      </div>

                      {isAuthor && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="btn-modern-danger"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          title="Delete your post"
                        >
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      )}
                    </div>

                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.content}</p>

                    {post.link && (
                      <a
                        href={post.link.startsWith('http') ? post.link : `https://${post.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="post-link-pill"
                      >
                        <i className="fa-solid fa-link"></i> {post.link}
                      </a>
                    )}

                    <div className="post-footer">
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {post.tags &&
                          post.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                            <span key={tag} className="skill-pill" style={{ fontSize: '0.75rem' }}>
                              #{tag}
                            </span>
                          ))}
                      </div>

                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`post-like-btn ${isLiked ? 'liked' : ''}`}
                      >
                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>{' '}
                        {post.likes ? post.likes.length : 0} Likes
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-card empty-state-card">
                <i className="fa-regular fa-comments empty-state-icon"></i>
                <h3>No Community Posts Yet</h3>
                <p>Be the first to share a project, ask a question, or introduce yourself!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
