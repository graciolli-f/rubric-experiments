import PostItem from './PostItem'

// PostsSection component - displays recent posts with search filtering and no results handling
function PostsSection({ posts, searchTerm, onViewPost, onEditPost, onDeletePost }) {
  // Utility function to format date for display - consistent date formatting across the app
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="section fade-in">
      <div className="section-header">📄 Recent Posts</div>
      <div className="section-content">
        {/* Conditional rendering based on search results - provides appropriate feedback */}
        {posts.length === 0 && searchTerm ? (
          <div className="no-results">
            <div className="no-results-icon">📭</div>
            <div>No posts found matching "{searchTerm}"</div>
          </div>
        ) : (
          <div className="posts-grid">
            {/* Map through posts and render PostItem components with proper props */}
            {posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                formatDate={formatDate}
                onViewPost={onViewPost}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostsSection 