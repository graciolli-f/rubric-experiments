// Header component - follows modular architecture from modularity.rux
// Manages header state, dropdown interactions, and keyboard navigation

class Header {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      title: config.title || 'BlogDash',
      userName: config.userName || 'John Doe',
      userInitials: config.userInitials || 'JD',
      ...config
    };
    
    // Component state
    this.state = {
      dropdownOpen: false
    };
    
    // DOM references
    this.element = null;
    this.profileButton = null;
    this.dropdown = null;
    
    // Event handlers bound to this instance
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleDropdownKeydown = this.handleDropdownKeydown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }
  
  // Render method returns DOM element as required by modularity.rux
  render() {
    this.element = document.createElement('div');
    this.element.className = 'header';
    this.element.innerHTML = this.getTemplate();
    
    // Setup event listeners after DOM creation
    this.setupEventListeners();
    
    return this.element;
  }
  
  // Template method for clean separation of concerns
  getTemplate() {
    return `
      <!-- Brand section with logo and title -->
      <a href="#" class="header__brand" data-testid="header-brand">
        <div class="header__logo" aria-hidden="true">B</div>
        <h1 class="header__title">${this.config.title}</h1>
      </a>
      
      <!-- Navigation section -->
      <nav class="header__nav" role="navigation" aria-label="User navigation">
        <!-- Profile button with dropdown functionality -->
        <button 
          type="button" 
          class="header__profile-button" 
          aria-haspopup="true" 
          aria-expanded="false"
          data-testid="profile-button"
          id="profile-button"
        >
          <div class="header__profile-avatar" aria-hidden="true">
            ${this.config.userInitials}
          </div>
          <span class="header__profile-name">${this.config.userName}</span>
          <!-- Dropdown icon using inline SVG for better performance -->
          <svg class="header__dropdown-icon" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Dropdown menu with proper ARIA attributes -->
        <div 
          class="header__profile-dropdown" 
          role="menu" 
          aria-labelledby="profile-button"
          data-testid="profile-dropdown"
        >
          <a href="#profile" class="header__profile-dropdown-item" role="menuitem" tabindex="-1">
            View Profile
          </a>
          <a href="#settings" class="header__profile-dropdown-item" role="menuitem" tabindex="-1">
            Settings
          </a>
          <div class="header__profile-dropdown-separator" role="separator" aria-hidden="true"></div>
          <button type="button" class="header__profile-dropdown-item" role="menuitem" tabindex="-1">
            Sign Out
          </button>
        </div>
      </nav>
    `;
  }
  
  // Setup event listeners following accessibility requirements
  setupEventListeners() {
    this.profileButton = this.element.querySelector('.header__profile-button');
    this.dropdown = this.element.querySelector('.header__profile-dropdown');
    
    // Profile button click handler
    this.profileButton.addEventListener('click', this.handleProfileClick);
    
    // Keyboard navigation for dropdown
    this.dropdown.addEventListener('keydown', this.handleDropdownKeydown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleDocumentClick);
    
    // Close dropdown on Escape key
    document.addEventListener('keydown', this.handleEscapeKey);
    
    // Setup menu item click handlers
    this.setupMenuItemHandlers();
  }
  
  // Setup individual menu item handlers
  setupMenuItemHandlers() {
    const menuItems = this.dropdown.querySelectorAll('.header__profile-dropdown-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Custom event for component communication as required by modularity.rux
        const event = new CustomEvent('header:menuItemClick', {
          detail: {
            action: e.target.textContent.trim().toLowerCase().replace(' ', '-'),
            element: e.target
          }
        });
        this.element.dispatchEvent(event);
        this.closeDropdown();
      });
    });
  }
  
  // Profile button click handler
  handleProfileClick(e) {
    e.stopPropagation();
    this.toggleDropdown();
  }
  
  // Keyboard navigation handler for accessibility compliance
  handleDropdownKeydown(e) {
    if (!this.state.dropdownOpen) return;
    
    const menuItems = Array.from(this.dropdown.querySelectorAll('.header__profile-dropdown-item'));
    const currentIndex = menuItems.indexOf(document.activeElement);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[nextIndex].focus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prevIndex].focus();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (document.activeElement) {
          document.activeElement.click();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        this.profileButton.focus();
        break;
    }
  }
  
  // Close dropdown when clicking outside
  handleDocumentClick(e) {
    if (this.state.dropdownOpen && !this.element.contains(e.target)) {
      this.closeDropdown();
    }
  }
  
  // Handle Escape key globally when dropdown is open
  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.state.dropdownOpen) {
      this.closeDropdown();
      this.profileButton.focus();
    }
  }
  
  // Toggle dropdown state
  toggleDropdown() {
    if (this.state.dropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }
  
  // Open dropdown with proper accessibility attributes
  openDropdown() {
    this.state.dropdownOpen = true;
    this.profileButton.setAttribute('aria-expanded', 'true');
    this.profileButton.classList.add('header__profile-button--open');
    this.dropdown.classList.add('header__profile-dropdown--open');
    
    // Focus first menu item for keyboard users
    const firstMenuItem = this.dropdown.querySelector('.header__profile-dropdown-item');
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
    
    // Emit custom event for other components
    const event = new CustomEvent('header:dropdownOpen');
    this.element.dispatchEvent(event);
  }
  
  // Close dropdown and reset state
  closeDropdown() {
    this.state.dropdownOpen = false;
    this.profileButton.setAttribute('aria-expanded', 'false');
    this.profileButton.classList.remove('header__profile-button--open');
    this.dropdown.classList.remove('header__profile-dropdown--open');
    
    // Emit custom event for other components
    const event = new CustomEvent('header:dropdownClose');
    this.element.dispatchEvent(event);
  }
  
  // Update method for dynamic content changes as required by modularity.rux
  update(newConfig) {
    Object.assign(this.config, newConfig);
    
    // Update title if changed
    const titleElement = this.element.querySelector('.header__title');
    if (titleElement) {
      titleElement.textContent = this.config.title;
    }
    
    // Update user name if changed
    const nameElement = this.element.querySelector('.header__profile-name');
    if (nameElement) {
      nameElement.textContent = this.config.userName;
    }
    
    // Update user initials if changed
    const avatarElement = this.element.querySelector('.header__profile-avatar');
    if (avatarElement) {
      avatarElement.textContent = this.config.userInitials;
    }
  }
  
  // Cleanup method for proper resource management as required by modularity.rux
  destroy() {
    // Remove event listeners to prevent memory leaks
    if (this.profileButton) {
      this.profileButton.removeEventListener('click', this.handleProfileClick);
    }
    
    if (this.dropdown) {
      this.dropdown.removeEventListener('keydown', this.handleDropdownKeydown);
    }
    
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleEscapeKey);
    
    // Clear references
    this.element = null;
    this.profileButton = null;
    this.dropdown = null;
  }
}

// Export for ES6 module system
export default Header; 