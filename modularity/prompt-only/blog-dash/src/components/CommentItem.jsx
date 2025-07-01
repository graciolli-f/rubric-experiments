// CommentItem component - represents individual comment items with author, content, and metadata
function CommentItem({ comment, formatDate }) {
  return (
    <div className="comment-item">
      {/* Comment header with author and date */}
      <div className="comment-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{formatDate(comment.date)}</span>
      </div>
      
      {/* Comment content and associated post reference */}
      <div className="comment-content">{comment.content}</div>
      <div className="comment-post">on "{comment.postTitle}"</div>
    </div>
  )
}

export default CommentItem 