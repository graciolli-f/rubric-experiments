import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

const PostsList = ({ 
  showActions = true, 
  maxPosts = 10,
  sortBy = 'date',
  sortOrder = 'desc',
  searchQuery = '',
  onPostsLoaded 
}) => {
  // Component state using React hooks
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({ sortBy, sortOrder })
  
  // Ref for tracking if component is mounted
  const isMountedRef = useRef(true)

  // Mock data for UI demonstration
  const mockPosts = [
    {
      id: 1,
      title: 'Getting Started with Modern Web Development',
      date: '2024-01-15',
      views: 2834,
      comments: 45,
      shares: 156,
      status: 'published',
      author: 'John Doe',
      // Added cover image for 2-column grid display
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=entropy&auto=format'
    },
    {
      id: 2,
      title: 'Advanced CSS Grid Techniques for Responsive Design',
      date: '2024-01-12',
      views: 1923,
      comments: 32,
      shares: 89,
      status: 'published',
      author: 'Jane Smith',
      // Added cover image for 2-column grid display
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=entropy&auto=format'
    },
    {
      id: 3,
      title: 'JavaScript Performance Optimization Tips',
      date: '2024-01-10',
      views: 3156,
      comments: 67,
      shares: 234,
      status: 'published',
      author: 'Mike Johnson',
      // Added cover image for 2-column grid display
      coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop&crop=entropy&auto=format'
    },
    {
      id: 4,
      title: 'Building Accessible Web Applications',
      date: '2024-01-08',
      views: 1456,
      comments: 28,
      shares: 67,
      status: 'draft',
      author: 'Sarah Wilson',
      // Added cover image for 2-column grid display
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=entropy&auto=format'
    },
    {
      id: 5,
      title: 'The Future of Frontend Development',
      date: '2024-01-20',
      views: 0,
      comments: 0,
      shares: 0,
      status: 'scheduled',
      author: 'Alex Brown',
      // Added cover image for 2-column grid display
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=entropy&auto=format'
    }
  ]

  // Simulate loading posts data - in real app this would be an API call
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate network delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (!isMountedRef.current) return // Component unmounted, don't update state
      
      setPosts([...mockPosts])
      setLoading(false)
      
      // Calculate displayed posts count considering maxPosts limit
      const displayedPosts = mockPosts.slice(0, maxPosts)
      
      // Emit loaded event for parent component with displayed posts count
      if (onPostsLoaded) {
        onPostsLoaded(displayedPosts)
      }
      
    } catch (error) {
      if (!isMountedRef.current) return
      
      setError(error.message)
      setLoading(false)
    }
  }, [maxPosts, onPostsLoaded])

  // Load posts on component mount
  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Set mounted state on mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true // Reset to true on mount/remount
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Filter posts based on search query using useMemo for performance
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts
    }
    
    const query = searchQuery.toLowerCase()
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    )
  }, [posts, searchQuery])

  // Sort posts based on current sort settings using useMemo for performance
  const sortedPosts = useMemo(() => {
    const postsToSort = [...filteredPosts]
    
    postsToSort.sort((a, b) => {
      let aValue = a[sortConfig.sortBy]
      let bValue = b[sortConfig.sortBy]
      
      // Handle date sorting
      if (sortConfig.sortBy === 'date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      // Handle numeric sorting
      if (typeof aValue === 'number') {
        return sortConfig.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      // Handle string sorting
      if (typeof aValue === 'string') {
        return sortConfig.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      // Handle date sorting
      if (aValue instanceof Date) {
        return sortConfig.sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }
      
      return 0
    })
    
    return postsToSort
  }, [filteredPosts, sortConfig])

  // Get posts to display considering maxPosts limit
  const postsToDisplay = useMemo(() => {
    return sortedPosts.slice(0, maxPosts)
  }, [sortedPosts, maxPosts])

  // Handle sort changes
  const handleSort = useCallback((newSortBy) => {
    setSortConfig(prev => ({
      sortBy: newSortBy,
      sortOrder: prev.sortBy === newSortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  // Handle post actions (edit, delete, etc.)
  const handlePostAction = useCallback((action, post) => {
    console.log(`${action} action for post:`, post.title)
    
    switch (action) {
      case 'edit':
        console.log('Navigating to edit post...')
        break
      case 'delete':
        // Confirm delete action
        if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
          setPosts(prev => prev.filter(p => p.id !== post.id))
          console.log('Post deleted successfully')
        }
        break
      case 'view':
        console.log('Opening post in new tab...')
        break
      default:
        console.log('Unknown action:', action)
    }
  }, [])

  // Get action icon for buttons
  const getActionIcon = useCallback((action) => {
    const icons = {
      edit: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
        </svg>
      ),
      delete: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L13.962 3.5H14.5a.5.5 0 0 0 0-1h-1.006a.58.58 0 0 0-.01 0H11Z"/>
        </svg>
      ),
      view: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          <path d="M8 2C4.5 2 1.4 4.5 0 8c1.4 3.5 4.5 6 8 6s6.6-2.5 8-6c-1.4-3.5-4.5-6-8-6zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
        </svg>
      )
    }
    return icons[action] || null
  }, [])

  // Format date for display
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }, [])

  // Format number with commas
  const formatNumber = useCallback((value) => {
    return new Intl.NumberFormat().format(value)
  }, [])

  // Handle retry action for error recovery
  const handleRetry = useCallback(() => {
    loadPosts()
  }, [loadPosts])

  // Render individual post card
  const renderPostCard = useCallback((post) => (
    <div key={post.id} className="posts-list__item" data-testid={`post-${post.id}`}>
      <div className="posts-list__item-image">
        <img 
          src={post.coverImage} 
          alt="" 
          className="posts-list__image"
          loading="lazy"
        />
        <div className={`posts-list__status posts-list__status--${post.status}`}>
          {post.status}
        </div>
      </div>
      <div className="posts-list__item-content">
        <h4 className="posts-list__item-title">{post.title}</h4>
        <div className="posts-list__item-meta">
          <span className="posts-list__author">by {post.author}</span>
          <span className="posts-list__date">{formatDate(post.date)}</span>
        </div>
        <div className="posts-list__item-stats">
          <span className="posts-list__stat">
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M8 2C4.5 2 1.4 4.5 0 8c1.4 3.5 4.5 6 8 6s6.6-2.5 8-6c-1.4-3.5-4.5-6-8-6zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
            </svg>
            {formatNumber(post.views)}
          </span>
          <span className="posts-list__stat">
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894z"/>
            </svg>
            {formatNumber(post.comments)}
          </span>
          <span className="posts-list__stat">
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
            </svg>
            {formatNumber(post.shares)}
          </span>
        </div>
        {showActions && (
          <div className="posts-list__item-actions">
            <button 
              type="button" 
              className="posts-list__action posts-list__action--view"
              onClick={() => handlePostAction('view', post)}
              aria-label={`View ${post.title}`}
            >
              {getActionIcon('view')}
            </button>
            <button 
              type="button" 
              className="posts-list__action posts-list__action--edit"
              onClick={() => handlePostAction('edit', post)}
              aria-label={`Edit ${post.title}`}
            >
              {getActionIcon('edit')}
            </button>
            <button 
              type="button" 
              className="posts-list__action posts-list__action--delete"
              onClick={() => handlePostAction('delete', post)}
              aria-label={`Delete ${post.title}`}
            >
              {getActionIcon('delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  ), [showActions, formatDate, formatNumber, handlePostAction, getActionIcon])

  // Render loading skeleton
  const renderLoadingState = useCallback(() => (
    <div className="posts-list--loading">
      <div className="posts-list__grid">
        {Array(6).fill().map((_, index) => (
          <div key={index} className="posts-list__item">
            <div className="posts-list__skeleton posts-list__skeleton--image"></div>
            <div className="posts-list__item-content">
              <div className="posts-list__skeleton posts-list__skeleton--title"></div>
              <div className="posts-list__skeleton posts-list__skeleton--date"></div>
              <div className="posts-list__item-stats">
                <div className="posts-list__skeleton posts-list__skeleton--stats"></div>
                <div className="posts-list__skeleton posts-list__skeleton--stats"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ), [])

  // Render empty state when no posts exist
  const renderEmptyState = useCallback(() => (
    <div className="posts-list__empty">
      <div className="posts-list__empty-icon" aria-hidden="true">📝</div>
      <h3>No posts yet</h3>
      <p>Create your first post to get started with your blog dashboard.</p>
      <button type="button" className="button button--primary">
        Create First Post
      </button>
    </div>
  ), [])

  // Render no search results state
  const renderNoSearchResults = useCallback(() => (
    <div className="posts-list__empty">
      <div className="posts-list__empty-icon" aria-hidden="true">🔍</div>
      <h3>No posts found</h3>
      <p>No posts match your search query "{searchQuery}". Try adjusting your search terms.</p>
    </div>
  ), [searchQuery])

  // Render error state
  const renderError = useCallback(() => (
    <div className="posts-list__error">
      <h3>Unable to load posts</h3>
      <p>{error}</p>
      <button type="button" className="button button--primary" onClick={handleRetry}>
        Try Again
      </button>
    </div>
  ), [error, handleRetry])

  // Main render
  if (loading) {
    return (
      <div className="posts-list" data-testid="posts-list">
        {renderLoadingState()}
      </div>
    )
  }

  if (error) {
    return (
      <div className="posts-list" data-testid="posts-list">
        {renderError()}
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="posts-list" data-testid="posts-list">
        {renderEmptyState()}
      </div>
    )
  }

  // Show "No results found" when search returns no results but we have posts
  if (searchQuery && (!filteredPosts || filteredPosts.length === 0)) {
    return (
      <div className="posts-list" data-testid="posts-list">
        {renderNoSearchResults()}
      </div>
    )
  }

  return (
    <div className="posts-list" data-testid="posts-list">
      <div className="posts-list__grid">
        {postsToDisplay.map(renderPostCard)}
      </div>
    </div>
  )
}

export default PostsList 