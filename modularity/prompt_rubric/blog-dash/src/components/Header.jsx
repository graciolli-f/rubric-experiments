import { useState, useEffect, useRef, useCallback } from 'react'

const Header = ({ 
  title = 'BlogDash', 
  userName = 'John Doe', 
  userInitials = 'JD',
  onMenuItemClick 
}) => {
  // Component state using React hooks
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // DOM references using useRef hooks
  const profileButtonRef = useRef(null)
  const dropdownRef = useRef(null)

  // Toggle dropdown state using useCallback for performance optimization
  const toggleDropdown = useCallback(() => {
    setDropdownOpen(prev => !prev)
  }, [])

  // Close dropdown handler
  const closeDropdown = useCallback(() => {
    setDropdownOpen(false)
  }, [])

  // Open dropdown and focus management
  const openDropdown = useCallback(() => {
    setDropdownOpen(true)
    // Focus the first menu item after opening
    setTimeout(() => {
      const firstMenuItem = dropdownRef.current?.querySelector('.header__profile-dropdown-item')
      firstMenuItem?.focus()
    }, 0)
  }, [])

  // Handle profile button click
  const handleProfileClick = useCallback((e) => {
    e.stopPropagation()
    if (dropdownOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }, [dropdownOpen, closeDropdown, openDropdown])

  // Handle keyboard navigation for accessibility compliance
  const handleDropdownKeydown = useCallback((e) => {
    if (!dropdownOpen) return
    
    const menuItems = Array.from(dropdownRef.current?.querySelectorAll('.header__profile-dropdown-item') || [])
    const currentIndex = menuItems.indexOf(document.activeElement)
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0
        menuItems[nextIndex]?.focus()
        break
        
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1
        menuItems[prevIndex]?.focus()
        break
        
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (document.activeElement) {
          document.activeElement.click()
        }
        break
        
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        profileButtonRef.current?.focus()
        break
    }
  }, [dropdownOpen, closeDropdown])

  // Handle menu item clicks
  const handleMenuItemClick = useCallback((action, element) => {
    // Extract action from menu item text or data attribute
    const actionText = action || element.textContent?.trim().toLowerCase().replace(' ', '-') || ''
    
    // Call parent callback if provided
    if (onMenuItemClick) {
      onMenuItemClick(actionText)
    }
    
    // Close dropdown after action
    closeDropdown()
  }, [onMenuItemClick, closeDropdown])

  // Setup global event listeners for dropdown management
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleDocumentClick = (e) => {
      if (dropdownOpen && !e.target.closest('.header__nav')) {
        closeDropdown()
      }
    }

    // Handle Escape key globally when dropdown is open
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && dropdownOpen) {
        closeDropdown()
        profileButtonRef.current?.focus()
      }
    }

    if (dropdownOpen) {
      document.addEventListener('click', handleDocumentClick)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [dropdownOpen, closeDropdown])

  // Update ARIA attributes when dropdown state changes
  useEffect(() => {
    if (profileButtonRef.current) {
      profileButtonRef.current.setAttribute('aria-expanded', dropdownOpen.toString())
    }
  }, [dropdownOpen])

  return (
    <div className="header">
      {/* Brand section with logo and title */}
      <a href="#" className="header__brand" data-testid="header-brand">
        <div className="header__logo" aria-hidden="true">B</div>
        <h1 className="header__title">{title}</h1>
      </a>
      
      {/* Navigation section */}
      <nav className="header__nav" role="navigation" aria-label="User navigation">
        {/* Profile button with dropdown functionality */}
        <button 
          ref={profileButtonRef}
          type="button" 
          className="header__profile-button" 
          aria-haspopup="true" 
          aria-expanded={dropdownOpen}
          data-testid="profile-button"
          id="profile-button"
          onClick={handleProfileClick}
        >
          <div className="header__profile-avatar" aria-hidden="true">
            {userInitials}
          </div>
          <span className="header__profile-name">{userName}</span>
          {/* Dropdown icon using inline SVG for better performance */}
          <svg className="header__dropdown-icon" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Dropdown menu with proper ARIA attributes */}
        <div 
          ref={dropdownRef}
          className="header__profile-dropdown" 
          role="menu" 
          aria-labelledby="profile-button"
          data-testid="profile-dropdown"
          onKeyDown={handleDropdownKeydown}
          style={{ display: dropdownOpen ? 'block' : 'none' }}
        >
          <a 
            href="#profile" 
            className="header__profile-dropdown-item" 
            role="menuitem" 
            tabIndex="-1"
            onClick={(e) => {
              e.preventDefault()
              handleMenuItemClick('view-profile', e.target)
            }}
          >
            View Profile
          </a>
          <a 
            href="#settings" 
            className="header__profile-dropdown-item" 
            role="menuitem" 
            tabIndex="-1"
            onClick={(e) => {
              e.preventDefault()
              handleMenuItemClick('settings', e.target)
            }}
          >
            Settings
          </a>
          <div className="header__profile-dropdown-separator" role="separator" aria-hidden="true"></div>
          <button 
            type="button" 
            className="header__profile-dropdown-item" 
            role="menuitem" 
            tabIndex="-1"
            onClick={(e) => handleMenuItemClick('sign-out', e.target)}
          >
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Header 