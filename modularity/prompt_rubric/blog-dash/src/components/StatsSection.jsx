import { useState, useEffect, useCallback, useRef } from 'react'

const StatsSection = ({ 
  showChanges = true, 
  showPeriod = true, 
  animateCounters = true,
  postsCount = 5,
  onStatsLoaded 
}) => {
  // Component state using React hooks
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  
  // Ref for tracking if component is mounted (for cleanup)
  const isMountedRef = useRef(true)

  // Mock data for UI demonstration
  const mockStats = [
    {
      id: 'posts',
      title: 'Total Posts',
      value: postsCount, // Use actual posts count from props for consistency
      change: +12.5,
      period: 'vs last month',
      icon: 'document'
    },
    {
      id: 'views',
      title: 'Total Views',
      value: 45821,
      change: +8.2,
      period: 'vs last month',
      icon: 'eye'
    },
    {
      id: 'comments',
      title: 'Total Comments',
      value: 3456,
      change: -2.4,
      period: 'vs last month',
      icon: 'chat'
    },
    {
      id: 'shares',
      title: 'Total Shares',
      value: 546, // Adding shares stat to display total shares across all posts
      change: +15.3,
      period: 'vs last month',
      icon: 'share'
    }
  ]

  // Simulate loading stats data - in real app this would be an API call
  const loadStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate network delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      if (!isMountedRef.current) return // Component unmounted, don't update state
      
      const statsWithUpdatedPosts = mockStats.map(stat => 
        stat.id === 'posts' ? { ...stat, value: postsCount } : stat
      )
      
      setStats(statsWithUpdatedPosts)
      setLoading(false)
      
      // Emit loaded event for parent component
      if (onStatsLoaded) {
        onStatsLoaded(statsWithUpdatedPosts)
      }
      
          } catch (error) {
      if (!isMountedRef.current) return
      
      setError(error.message)
      setLoading(false)
    }
  }, [postsCount, onStatsLoaded])

  // Load stats on component mount and when postsCount changes
  useEffect(() => {
    loadStats()
  }, [loadStats])

  // Set mounted state on mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true // Reset to true on mount/remount
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Get CSS class for change indicator based on value
  const getChangeClass = useCallback((change) => {
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return 'neutral'
  }, [])

  // Get icon for change direction
  const getChangeIcon = useCallback((change) => {
    if (change > 0) {
      return (
        <svg className="stats-card__change-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" transform="rotate(180 8 8)" clipRule="evenodd" />
        </svg>
      )
    } else if (change < 0) {
      return (
        <svg className="stats-card__change-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" clipRule="evenodd" />
        </svg>
      )
    }
    return null
  }, [])

  // Get SVG icon for each stat type
  const getIconSVG = useCallback((iconType) => {
    const icons = {
      document: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M4 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5L9.5 1H4zM9 4.5V2L12 4.5H9z" clipRule="evenodd" />
        </svg>
      ),
      eye: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M8 2C4.5 2 1.4 4.5 0 8c1.4 3.5 4.5 6 8 6s6.6-2.5 8-6c-1.4-3.5-4.5-6-8-6zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
        </svg>
      ),
      chat: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894z"/>
        </svg>
      ),
      share: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
        </svg>
      )
    }
    return icons[iconType] || null
  }, [])

  // Format numbers with commas for better readability
  const formatNumber = useCallback((value) => {
    return new Intl.NumberFormat().format(value)
  }, [])

  // Format change percentage for display
  const formatChange = useCallback((change) => {
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }, [])

  // Handle retry action for error recovery
  const handleRetry = useCallback(() => {
    loadStats()
  }, [loadStats])

  // Render individual stat card
  const renderStatCard = useCallback((stat) => {
    const changeClass = getChangeClass(stat.change)
    const changeIcon = getChangeIcon(stat.change)
    const formattedValue = formatNumber(stat.value)
    const formattedChange = formatChange(stat.change)
    
    return (
      <div key={stat.id} className="stats-card" data-testid={`stats-card-${stat.id}`}>
        {/* Card header with title and icon */}
        <div className="stats-card__header">
          <h3 className="stats-card__title">{stat.title}</h3>
          <div className={`stats-card__icon stats-card__icon--${stat.id}`} aria-hidden="true">
            {getIconSVG(stat.icon)}
          </div>
        </div>
        
        {/* Main value with animation support */}
        <div className="stats-card__value" data-value={stat.value}>{formattedValue}</div>
        
        {/* Change indicator if enabled */}
        {showChanges && (
          <div className={`stats-card__change stats-card__change--${changeClass}`}>
            {changeIcon}
            <span>{formattedChange}</span>
          </div>
        )}
        
        {/* Period indicator if enabled */}
        {showPeriod && (
          <div className="stats-card__period">{stat.period}</div>
        )}
      </div>
    )
  }, [showChanges, showPeriod, getChangeClass, getChangeIcon, formatNumber, formatChange, getIconSVG])

  // Render loading skeleton while data loads
  const renderLoadingState = useCallback(() => {
    return mockStats.map((_, index) => (
      <div key={index} className="stats-card stats-card--loading" data-testid="stats-card-loading">
        <div className="stats-card__header">
          <h3 className="stats-card__title">Loading...</h3>
          <div className="stats-card__icon stats-card__icon--posts" aria-hidden="true">
            <span>?</span>
          </div>
        </div>
        <div className="stats-card__value stats-card__value--loading">0000</div>
        <div className="stats-card__change stats-card__change--loading"></div>
        <div className="stats-card__period">Loading...</div>
      </div>
    ))
  }, [])

  // Render error state
  const renderError = useCallback(() => {
    return (
      <div className="stats-section__error">
        <h3>Unable to load statistics</h3>
        <p>{error}</p>
        <button type="button" className="button button--primary" onClick={handleRetry}>
          Try Again
        </button>
      </div>
    )
  }, [error, handleRetry])

  // Main render
  if (error) {
    return renderError()
  }

  return (
    <div className="stats-section" data-testid="stats-section">
      {loading ? renderLoadingState() : stats?.map(renderStatCard)}
    </div>
  )
}

export default StatsSection 