// StatsSection component - displays dashboard statistics in a responsive grid layout
function StatsSection({ stats }) {
  return (
    <div className="stats-section fade-in">
      {/* Stats cards with dynamic data from props - allows for real-time updates */}
      <div className="stat-card">
        <div className="stat-number">{stats.totalPosts}</div>
        <div className="stat-label">Total Posts</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.totalViews.toLocaleString()}</div>
        <div className="stat-label">Total Views</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.totalComments}</div>
        <div className="stat-label">Total Comments</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.totalShares}</div>
        <div className="stat-label">Total Shares</div>
      </div>
    </div>
  )
}

export default StatsSection 