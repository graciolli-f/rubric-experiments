import CommentItem from './CommentItem'

// CommentsSection component - displays recent comments with search filtering
function CommentsSection({ comments, searchTerm }) {
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
      <div className="section-header">💬 Recent Comments</div>
      <div className="section-content">
        {/* Conditional rendering based on search results - provides appropriate feedback */}
        {comments.length === 0 && searchTerm ? (
          <div className="no-results">
            <div className="no-results-icon">💬</div>
            <div>No comments found matching "{searchTerm}"</div>
          </div>
        ) : (
          <div>
            {/* Map through comments and render CommentItem components */}
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentsSection 