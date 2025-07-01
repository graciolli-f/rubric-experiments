// SearchSection component - handles search input with controlled component pattern
function SearchSection({ searchTerm, onSearchChange }) {
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-input-wrapper">
          {/* Controlled input component - value and onChange handler passed as props */}
          <input
            type="text"
            placeholder="Search posts and comments..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
    </div>
  )
}

export default SearchSection 