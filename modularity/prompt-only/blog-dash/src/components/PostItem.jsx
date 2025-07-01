// PostItem component - represents individual post cards with image, content, and actions
function PostItem({ post, formatDate, onViewPost, onEditPost, onDeletePost }) {
  return (
    <div className="post-item">
      {/* Post cover image section - provides visual appeal and content preview */}
      <div className="post-cover">
        <img 
          src={post.coverImage} 
          alt={`Cover for ${post.title}`} 
          loading="lazy"
        />
      </div>
      
      <div className="post-content">
        <div className="post-info">
          {/* Post title and metadata */}
          <div className="post-title">{post.title}</div>
          <div className="post-meta">
            <span>📅 {formatDate(post.date)}</span>
            <span>👁️ {post.views} views</span>
            <span>💬 {post.comments} comments</span>
          </div>
        </div>
        
        {/* Action buttons with event handlers passed as props - follows React patterns */}
        <div className="post-actions">
          <button 
            className="btn btn-view" 
            onClick={() => onViewPost(post.id)}
          >
            View
          </button>
          <button 
            className="btn btn-edit" 
            onClick={() => onEditPost(post.id)}
          >
            Edit
          </button>
          <button 
            className="btn btn-delete" 
            onClick={() => onDeletePost(post.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostItem 