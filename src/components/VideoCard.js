import { useState } from 'react';
import './VideoCard.css';

export default function VideoCard({ video }) {
  const [enlarged, setEnlarged] = useState(false);

  if (!video) return null;

  const handleClick = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    }
  };

  return (
    <>
      <div className="video-card" onClick={handleClick}>
        {video.thumbnail && (
          <img src={video.thumbnail} alt={video.title} className="video-card-thumbnail" />
        )}
        <div className="video-card-content">
          <h3 className="video-card-title">{video.title}</h3>
          {video.description && (
            <p className="video-card-description">{video.description.slice(0, 150)}...</p>
          )}
          <div className="video-card-stats">
            {video.viewCount > 0 && (
              <span className="video-card-stat">👁️ {video.viewCount.toLocaleString()} views</span>
            )}
            {video.likeCount > 0 && (
              <span className="video-card-stat">👍 {video.likeCount.toLocaleString()} likes</span>
            )}
          </div>
        </div>
        <button 
          className="video-card-enlarge"
          onClick={(e) => {
            e.stopPropagation();
            setEnlarged(true);
          }}
        >
          🔍
        </button>
      </div>

      {enlarged && (
        <div className="video-card-overlay" onClick={() => setEnlarged(false)}>
          <div className="video-card-enlarged" onClick={(e) => e.stopPropagation()}>
            <button className="video-card-close" onClick={() => setEnlarged(false)}>×</button>
            {video.thumbnail && (
              <img src={video.thumbnail} alt={video.title} className="video-card-enlarged-thumbnail" />
            )}
            <h2>{video.title}</h2>
            {video.description && <p>{video.description}</p>}
            <div className="video-card-enlarged-stats">
              {video.viewCount > 0 && <span>Views: {video.viewCount.toLocaleString()}</span>}
              {video.likeCount > 0 && <span>Likes: {video.likeCount.toLocaleString()}</span>}
            </div>
            <button className="video-card-watch-btn" onClick={handleClick}>
              Watch on YouTube
            </button>
          </div>
        </div>
      )}
    </>
  );
}
