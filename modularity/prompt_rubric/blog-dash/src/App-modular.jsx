import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import StatsSection from './components/StatsSection'
import SearchBar from './components/SearchBar'
import PostsList from './components/PostsList'
import CommentsList from './components/CommentsList'
import Footer from './components/Footer'

function App() {
  // Global application state using React hooks
  const [appState, setAppState] = useState({
    loading: true,
    error: null,
    initialized: false,
    searchQuery: '', // Global search query for filtering posts and comments
  })

  // Component data states
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

  // Initialize the dashboard application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing BlogDash React application...')
        
        // Setup global event listeners
        setupGlobalEventListeners()
        
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setAppState(prev => ({
          ...prev,
          loading: false,
          initialized: true
        }))
        
        console.log('✅ BlogDash React application initialized successfully')
        
      } catch (error) {
        console.error('❌ Failed to initialize BlogDash:', error)
        setAppState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
      }
    }

    initializeApp()

    // Cleanup function for component unmount
    return () => {
      cleanupGlobalEventListeners()
    }
  }, [])

  // Setup global event listeners for keyboard navigation and performance optimization
  const setupGlobalEventListeners = useCallback(() => {
    // Global keyboard navigation handler
    const handleKeyboardNavigation = (event) => {
      // Escape key handling for global shortcuts
      if (event.key === 'Escape') {
        setAppState(prev => ({ ...prev, searchQuery: '' }))
      }
    }

    // Page visibility change handling for performance optimization
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Dashboard visible - resuming updates')
      } else {
        console.log('Dashboard hidden - pausing updates')
      }
    }

    document.addEventListener('keydown', handleKeyboardNavigation)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Store cleanup functions
    window._globalCleanup = () => {
      document.removeEventListener('keydown', handleKeyboardNavigation)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Cleanup global event listeners
  const cleanupGlobalEventListeners = useCallback(() => {
    if (window._globalCleanup) {
      window._globalCleanup()
      delete window._globalCleanup
    }
  }, [])

  // Handle search query changes from SearchBar component
  const handleSearchQuery = useCallback((query) => {
    console.log('Search query updated:', query)
    setAppState(prev => ({ ...prev, searchQuery: query }))
  }, [])

  // Handle stats data loaded from StatsSection component
  const handleStatsLoaded = useCallback((statsData) => {
    console.log('Stats loaded:', statsData)
    setStats(statsData)
  }, [])

  // Handle posts data loaded from PostsList component
  const handlePostsLoaded = useCallback((postsData) => {
    console.log('Posts loaded:', postsData)
    setPosts(postsData)
    
    // Update stats with actual posts count for consistency using functional update
    // to avoid circular dependency with stats state
    setStats(prevStats => {
      if (prevStats) {
        return prevStats.map(stat => 
          stat.id === 'posts' ? { ...stat, value: postsData.length } : stat
        )
      }
      return prevStats
    })
  }, []) // Removed stats dependency to break circular dependency

  // Handle comments data loaded from CommentsList component
  const handleCommentsLoaded = useCallback((commentsData) => {
    console.log('Comments loaded:', commentsData)
    setComments(commentsData)
  }, [])

  // Handle component events for inter-component communication
  const handleComponentEvents = useCallback((eventType, data) => {
    console.log('Component event:', eventType, data)
    
    switch (eventType) {
      case 'header:menuItemClick':
        console.log('Header menu item clicked:', data.action)
        break
      case 'footer:linkClick':
        console.log('Footer link clicked:', data.action)
        break
      default:
        console.log('Unhandled component event:', eventType)
    }
  }, [])

  // Handle retry action for error recovery
  const handleRetry = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      loading: true,
      error: null
    }))
    
    // Re-initialize the application
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        loading: false,
        initialized: true
      }))
    }, 1000)
  }, [])

  // Loading state component
  if (appState.loading) {
    return (
      <div className="loading-indicator" aria-live="polite" data-testid="loading-indicator">
        <div className="loading-spinner" aria-hidden="true"></div>
        <span className="loading-text">Loading dashboard...</span>
      </div>
    )
  }

  // Error state component
  if (appState.error) {
    return (
      <div className="error-container" role="alert" aria-live="assertive" data-testid="error-container">
        <h2>Unable to load dashboard</h2>
        <p>{appState.error}</p>
        <button 
          type="button" 
          className="button button--primary"
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    )
  }

  // Main dashboard layout
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header component with site branding and user profile */}
      <Header 
        title="BlogDash"
        userName="John Doe"
        userInitials="JD"
        onMenuItemClick={(action) => handleComponentEvents('header:menuItemClick', { action })}
      />

      {/* Main content landmark */}
      <main id="main-content" role="main" data-testid="dashboard-main">
        {/* Stats section with key metrics */}
        <section id="stats-section" aria-labelledby="stats-heading" data-testid="stats-section">
          <h2 id="stats-heading" className="visually-hidden">Dashboard Statistics</h2>
          <StatsSection 
            animateCounters={true}
            showChanges={true}
            showPeriod={true}
            postsCount={posts.length}
            onStatsLoaded={handleStatsLoaded}
          />
        </section>

        {/* Search section for filtering posts and comments */}
        <section id="search-section" aria-labelledby="search-heading" data-testid="search-section">
          <h2 id="search-heading" className="visually-hidden">Search Posts and Comments</h2>
          <SearchBar 
            placeholder="Search posts and comments..."
            debounceMs={300}
            onSearchQuery={handleSearchQuery}
          />
        </section>

        {/* Content grid for posts and comments */}
        <div className="content-grid" data-testid="content-grid">
          {/* All posts section */}
          <section id="posts-section" aria-labelledby="posts-heading" data-testid="posts-section">
            <h2 id="posts-heading" className="section-heading">All Posts</h2>
            <PostsList 
              maxPosts={5}
              showActions={true}
              sortBy="date"
              sortOrder="desc"
              searchQuery={appState.searchQuery}
              onPostsLoaded={handlePostsLoaded}
            />
          </section>

          {/* Recent comments section */}
          <section id="comments-section" aria-labelledby="comments-heading" data-testid="comments-section">
            <h2 id="comments-heading" className="section-heading">Recent Comments</h2>
            <CommentsList 
              maxComments={5}
              showActions={true}
              showViewAll={true}
              searchQuery={appState.searchQuery}
              onCommentsLoaded={handleCommentsLoaded}
            />
          </section>
        </div>
      </main>

      {/* Footer component with links and company information */}
      <Footer 
        companyName="BlogDash"
        showSocialLinks={true}
        showQuickLinks={true}
        onLinkClick={(action) => handleComponentEvents('footer:linkClick', { action })}
      />
    </>
  )
}

export default App 