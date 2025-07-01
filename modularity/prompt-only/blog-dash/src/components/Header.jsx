// Header component - displays the site title and profile section with proper event handling
function Header({ onProfileClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="site-title">BlogDash</h1>
        <div className="profile-section">
          <span>Welcome, John Doe</span>
          {/* Profile button with onClick handler passed as prop - follows React event handling patterns */}
          <button className="profile-button" onClick={onProfileClick}>
            👤 Profile
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 