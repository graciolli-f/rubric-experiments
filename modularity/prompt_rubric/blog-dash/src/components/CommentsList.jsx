import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

const CommentsList = ({ 
  showActions = true, 
  maxComments = 5,
  showViewAll = true,
  searchQuery = '',
  onCommentsLoaded 
}) => {
  // Component state using React hooks
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [error, setError] = useState(null)
  
  // Ref for tracking if component is mounted
  const isMountedRef = useRef(true)

  // Mock data for UI demonstration
  const mockComments = [
    {
      id: 1,
      author: 'Alice Johnson',
      authorInitials: 'AJ',
      content: 'This article really helped me understand the concepts better. The examples are clear and practical. Thank you for sharing!',
      postTitle: 'Getting Started with Modern Web Development',
      postId: 1,
      time: '2024-01-15T10:30:00Z',
      status: 'approved'
    },
    {
      id: 2,
      author: 'Bob Smith',
      authorInitials: 'BS',
      content: 'Great tutorial! I was struggling with CSS Grid for weeks and this finally made it click for me.',
      postTitle: 'Advanced CSS Grid Techniques',
      postId: 2,
      time: '2024-01-15T09:45:00Z',
      status: 'approved'
    },
    {
      id: 3,
      author: 'Carol Williams',
      authorInitials: 'CW',
      content: 'Could you provide more examples for the performance optimization section? I\'d love to see more real-world use cases.',
      postTitle: 'JavaScript Performance Optimization Tips',
      postId: 3,
      time: '2024-01-15T08:20:00Z',
      status: 'pending'
    },
    {
      id: 4,
      author: 'David Brown',
      authorInitials: 'DB',
      content: 'Accessibility is so important and often overlooked. Thanks for highlighting these key points!',
      postTitle: 'Building Accessible Web Applications',
      postId: 4,
      time: '2024-01-14T16:15:00Z',
      status: 'approved'
    },
    {
      id: 5,
      author: 'Eve Davis',
      authorInitials: 'ED',
      content: 'Looking forward to the future of frontend! Do you think WebAssembly will become more mainstream?',
      postTitle: 'The Future of Frontend Development',
      postId: 5,
      time: '2024-01-14T14:30:00Z',
      status: 'approved'
    }
  ]

  // Simulate loading comments data - in real app this would be an API call
  const loadComments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate network delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 600))
      
      if (!isMountedRef.current) return // Component unmounted, don't update state
      
      setComments([...mockComments])
      setLoading(false)
      
      // Emit loaded event for parent component
      if (onCommentsLoaded) {
        onCommentsLoaded(mockComments)
      }
      
    } catch (error) {
      if (!isMountedRef.current) return
      
      setError(error.message)
      setLoading(false)
    }
  }, [onCommentsLoaded])

  // Load comments on component mount
  useEffect(() => {
    loadComments()
  }, [loadComments])

  // Set mounted state on mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true // Reset to true on mount/remount
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Filter comments based on search query using useMemo for performance
  const filteredComments = useMemo(() => {
    if (!searchQuery.trim()) {
      return comments
    }
    
    const query = searchQuery.toLowerCase()
    return comments.filter(comment => 
      comment.content.toLowerCase().includes(query) ||
      comment.author.toLowerCase().includes(query) ||
      comment.postTitle.toLowerCase().includes(query)
    )
  }, [comments, searchQuery])

  // Get comments to display considering maxComments limit
  const commentsToDisplay = useMemo(() => {
    return filteredComments.slice(0, maxComments)
  }, [filteredComments, maxComments])

  // Handle comment actions (approve, delete, etc.)
  const handleCommentAction = useCallback((action, comment) => {
    console.log(`${action} action for comment:`, comment.id)
    
    switch (action) {
      case 'approve':
        setComments(prev => prev.map(c => 
          c.id === comment.id ? { ...c, status: 'approved' } : c
        ))
        console.log('Comment approved successfully')
        break
      case 'delete':
        // Confirm delete action
        if (window.confirm('Are you sure you want to delete this comment?')) {
          setComments(prev => prev.filter(c => c.id !== comment.id))
          console.log('Comment deleted successfully')
        }
        break
      case 'spam':
        setComments(prev => prev.map(c => 
          c.id === comment.id ? { ...c, status: 'spam' } : c
        ))
        console.log('Comment marked as spam')
        break
      default:
        console.log('Unknown action:', action)
    }
  }, [])

  // Get action icon for buttons
  const getActionIcon = useCallback((action) => {
    const icons = {
      approve: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
      ),
      delete: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L13.962 3.5H14.5a.5.5 0 0 0 0-1h-1.006a.58.58 0 0 0-.01 0H11Z"/>
        </svg>
      ),
      spam: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
      )
    }
    return icons[action] || null
  }, [])

  // Format time ago for display
  const getTimeAgo = useCallback((timestamp) => {
    const now = new Date()
    const commentTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now - commentTime) / 1000)
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ]
    
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds)
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
      }
    }
    
    return 'Just now'
  }, [])

  // Handle retry action for error recovery
  const handleRetry = useCallback(() => {
    loadComments()
  }, [loadComments])

  // Render individual comment item
  const renderCommentItem = useCallback((comment) => (
    <div key={comment.id} className="comments-list__item" data-testid={`comment-${comment.id}`}>
      <div className="comments-list__item-header">
        <div className="comments-list__author">
          <div className="comments-list__author-avatar" aria-hidden="true">
            {comment.authorInitials}
          </div>
          <div className="comments-list__author-info">
            <h4 className="comments-list__author-name">{comment.author}</h4>
            <div className="comments-list__comment-meta">
              <span className="comments-list__post-title">on {comment.postTitle}</span>
              <span className="comments-list__time">
                {getTimeAgo(comment.time)}
              </span>
            </div>
          </div>
        </div>
        {comment.status === 'pending' && (
          <span className="comments-list__status comments-list__status--pending">
            Pending
          </span>
        )}
      </div>
      <div className="comments-list__content">
        <p>{comment.content}</p>
      </div>
      {showActions && (
        <div className="comments-list__actions">
          {comment.status === 'pending' && (
            <button 
              type="button" 
              className="comments-list__action comments-list__action--approve"
              onClick={() => handleCommentAction('approve', comment)}
              aria-label={`Approve comment by ${comment.author}`}
            >
              {getActionIcon('approve')}
              Approve
            </button>
          )}
          <button 
            type="button" 
            className="comments-list__action comments-list__action--spam"
            onClick={() => handleCommentAction('spam', comment)}
            aria-label={`Mark comment by ${comment.author} as spam`}
          >
            {getActionIcon('spam')}
            Spam
          </button>
          <button 
            type="button" 
            className="comments-list__action comments-list__action--delete"
            onClick={() => handleCommentAction('delete', comment)}
            aria-label={`Delete comment by ${comment.author}`}
          >
            {getActionIcon('delete')}
            Delete
          </button>
        </div>
      )}
    </div>
  ), [showActions, getTimeAgo, handleCommentAction, getActionIcon])

  // Main render
  if (loading) {
    return (
      <div className="comments-list" data-testid="comments-list">
        <div className="comments-list__header">
          <h3 className="comments-list__title">Recent Comments</h3>
        </div>
        <div className="comments-list--loading">
          <div className="comments-list__items">
            {Array(3).fill().map((_, index) => (
              <div key={index} className="comments-list__item">
                <div className="comments-list__item-header">
                  <div className="comments-list__skeleton comments-list__skeleton--author"></div>
                  <div className="comments-list__skeleton comments-list__skeleton--meta"></div>
                </div>
                <div className="comments-list__skeleton comments-list__skeleton--content"></div>
                <div className="comments-list__skeleton comments-list__skeleton--content"></div>
                <div className="comments-list__skeleton comments-list__skeleton--meta"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="comments-list" data-testid="comments-list">
        <div className="comments-list__error">
          <h3>Unable to load comments</h3>
          <p>{error}</p>
          <button type="button" className="button button--primary" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-list" data-testid="comments-list">
        <div className="comments-list__header">
          <h3 className="comments-list__title">Recent Comments</h3>
        </div>
        <div className="comments-list__empty">
          <div className="comments-list__empty-icon" aria-hidden="true">💬</div>
          <h3>No comments yet</h3>
          <p>Comments from your readers will appear here.</p>
        </div>
      </div>
    )
  }

  // Show "No results found" when search returns no results but we have comments
  if (searchQuery && (!filteredComments || filteredComments.length === 0)) {
    return (
      <div className="comments-list" data-testid="comments-list">
        <div className="comments-list__header">
          <h3 className="comments-list__title">Recent Comments</h3>
        </div>
        <div className="comments-list__empty">
          <div className="comments-list__empty-icon" aria-hidden="true">🔍</div>
          <h3>No comments found</h3>
          <p>No comments match your search query "{searchQuery}". Try adjusting your search terms.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="comments-list" data-testid="comments-list">
      <div className="comments-list__header">
        <h3 className="comments-list__title">Recent Comments</h3>
      </div>
      <div className="comments-list__items">
        {commentsToDisplay.map(renderCommentItem)}
      </div>
      {showViewAll && (
        <div className="comments-list__view-all">
          <a href="#comments" className="comments-list__view-all-link" data-testid="view-all-comments">
            View All Comments
          </a>
        </div>
      )}
    </div>
  )
}

export default CommentsList 