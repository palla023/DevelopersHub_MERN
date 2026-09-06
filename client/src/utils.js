// Utility helpers for DevelopersHub

export const getAvatarUrl = (name = 'Dev', customAvatar = '') => {
  if (customAvatar && customAvatar.trim().startsWith('http')) {
    return customAvatar;
  }
  const cleanName = encodeURIComponent(name.trim() || 'Developer');
  // High quality SVG avatars based on developer name seed
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanName}&backgroundColor=0f172a,1e293b,312e81,0c4a6e`;
};

export const calculateAverageRating = (reviews = []) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (parseFloat(r.rating) || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

export const timeAgo = (dateString) => {
  if (!dateString) return 'recently';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return past.toLocaleDateString();
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
};
