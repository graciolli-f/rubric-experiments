import { useState, useCallback, useRef, useEffect } from 'react'

const SearchBar = ({ 
  placeholder = 'Search posts and comments...', 
  debounceMs = 300,
  onSearchQuery 
}) => {
  // Component state using React hooks
  const [query, setQuery] = useState('')
  const [isActive, setIsActive] = useState(false)
  
  // DOM references
  const searchInputRef = useRef(null)
  const debounceTimeoutRef = useRef(null)

  // Debounced search function to prevent excessive filtering during fast typing
  const debouncedSearch = useCallback((searchQuery) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      if (onSearchQuery) {
        onSearchQuery(searchQuery)
      }
    }, debounceMs)
  }, [onSearchQuery, debounceMs])

  // Handle input changes with debounced search
  const handleInputChange = useCallback((event) => {
    const newQuery = event.target.value.trim()
    setQuery(newQuery)
    
    // Trigger debounced search to avoid excessive filtering during fast typing
    debouncedSearch(newQuery)
  }, [debouncedSearch])

  // Handle clear button click - resets search and emits empty query
  const handleClear = useCallback(() => {
    setQuery('')
    
    // Clear the input field
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
    
    // Immediately emit search event with empty query to reset filters
    if (onSearchQuery) {
      onSearchQuery('')
    }
    
    // Return focus to search input for better UX
    searchInputRef.current?.focus()
  }, [onSearchQuery])

  // Handle focus event - adds active state for visual feedback
  const handleFocus = useCallback(() => {
    setIsActive(true)
  }, [])

  // Handle blur event - removes active state
  const handleBlur = useCallback(() => {
    setIsActive(false)
  }, [])

  // Handle keyboard events for enhanced UX
  const handleKeydown = useCallback((event) => {
    // Escape key clears search if there's content, otherwise blurs input
    if (event.key === 'Escape') {
      if (query) {
        handleClear()
      } else {
        searchInputRef.current?.blur()
      }
    }
  }, [query, handleClear])

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Generate CSS classes for component state
  const containerClasses = [
    'search-bar',
    isActive && 'search-bar--active',
    query && 'search-bar--has-query'
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses} data-testid="search-bar">
      <div className="search-bar__container">
        <div className="search-bar__input-wrapper">
          <svg 
            className="search-bar__icon search-bar__icon--search" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref={searchInputRef}
            type="search"
            className="search-bar__input"
            placeholder={placeholder}
            aria-label="Search posts and comments"
            data-testid="search-input"
            autoComplete="off"
            spellCheck="false"
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeydown}
          />
          <button
            type="button"
            className="search-bar__clear"
            aria-label="Clear search"
            data-testid="search-clear"
            style={{ display: query ? 'flex' : 'none' }}
            onClick={handleClear}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar 