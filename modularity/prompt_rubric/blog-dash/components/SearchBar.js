// SearchBar component - provides live search functionality for posts and comments
// Follows modular architecture and emits search events

class SearchBar {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      placeholder: config.placeholder || 'Search posts and comments...',
      debounceMs: config.debounceMs || 300, // Debounce search to avoid excessive filtering
      ...config
    };
    
    // Component state
    this.state = {
      query: '',
      isActive: false
    };
    
    // DOM references
    this.element = null;
    this.searchInput = null;
    this.clearButton = null;
    
    // Event handlers bound to this instance
    this.handleInput = this.handleInput.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    
    // Debounced search function to prevent excessive filtering
    this.debouncedSearch = this.debounce(this.emitSearchEvent.bind(this), this.config.debounceMs);
  }
  
  // Render method returns DOM element as required by modularity.rux
  render() {
    this.element = document.createElement('div');
    this.element.className = 'search-bar';
    this.element.setAttribute('data-testid', 'search-bar');
    
    this.element.innerHTML = `
      <div class="search-bar__container">
        <div class="search-bar__input-wrapper">
          <svg class="search-bar__icon search-bar__icon--search" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="search"
            class="search-bar__input"
            placeholder="${this.config.placeholder}"
            aria-label="Search posts and comments"
            data-testid="search-input"
            autocomplete="off"
            spellcheck="false"
          />
          <button
            type="button"
            class="search-bar__clear"
            aria-label="Clear search"
            data-testid="search-clear"
            style="display: none;"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Get references to important elements
    this.searchInput = this.element.querySelector('.search-bar__input');
    this.clearButton = this.element.querySelector('.search-bar__clear');
    
    // Setup event listeners
    this.setupEventListeners();
    
    return this.element;
  }
  
  // Setup event listeners for search interactions
  setupEventListeners() {
    if (this.searchInput) {
      // Input event for live search as user types
      this.searchInput.addEventListener('input', this.handleInput);
      // Focus and blur events for visual state management
      this.searchInput.addEventListener('focus', this.handleFocus);
      this.searchInput.addEventListener('blur', this.handleBlur);
      // Keyboard events for accessibility and UX enhancement
      this.searchInput.addEventListener('keydown', this.handleKeydown);
    }
    
    if (this.clearButton) {
      // Clear button click handler
      this.clearButton.addEventListener('click', this.handleClear);
    }
  }
  
  // Handle input changes with debounced search
  handleInput(event) {
    const query = event.target.value.trim();
    this.state.query = query;
    
    // Show/hide clear button based on input content
    this.updateClearButtonVisibility();
    
    // Update visual state based on whether there's a search query
    this.updateSearchState();
    
    // Trigger debounced search to avoid excessive filtering during fast typing
    this.debouncedSearch(query);
  }
  
  // Handle clear button click - resets search and emits empty query
  handleClear() {
    this.state.query = '';
    this.searchInput.value = '';
    this.updateClearButtonVisibility();
    this.updateSearchState();
    
    // Immediately emit search event with empty query to reset filters
    this.emitSearchEvent('');
    
    // Return focus to search input for better UX
    this.searchInput.focus();
  }
  
  // Handle focus event - adds active state for visual feedback
  handleFocus() {
    this.state.isActive = true;
    this.element.classList.add('search-bar--active');
  }
  
  // Handle blur event - removes active state
  handleBlur() {
    this.state.isActive = false;
    this.element.classList.remove('search-bar--active');
  }
  
  // Handle keyboard events for enhanced UX
  handleKeydown(event) {
    // Escape key clears search if there's content, otherwise blurs input
    if (event.key === 'Escape') {
      if (this.state.query) {
        this.handleClear();
      } else {
        this.searchInput.blur();
      }
    }
  }
  
  // Update clear button visibility based on search query
  updateClearButtonVisibility() {
    if (this.clearButton) {
      this.clearButton.style.display = this.state.query ? 'flex' : 'none';
    }
  }
  
  // Update search bar visual state
  updateSearchState() {
    if (this.state.query) {
      this.element.classList.add('search-bar--has-query');
    } else {
      this.element.classList.remove('search-bar--has-query');
    }
  }
  
  // Emit search event for other components to listen to
  emitSearchEvent(query) {
    const event = new CustomEvent('search:query', {
      detail: { 
        query: query,
        timestamp: Date.now()
      }
    });
    this.element.dispatchEvent(event);
  }
  
  // Debounce utility to prevent excessive search events during fast typing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Public method to get current search query
  getQuery() {
    return this.state.query;
  }
  
  // Public method to set search query programmatically
  setQuery(query) {
    this.state.query = query;
    if (this.searchInput) {
      this.searchInput.value = query;
      this.updateClearButtonVisibility();
      this.updateSearchState();
    }
  }
  
  // Public method to clear search
  clear() {
    this.handleClear();
  }
  
  // Public method to focus search input
  focus() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }
  
  // Clean up event listeners and resources
  destroy() {
    if (this.searchInput) {
      this.searchInput.removeEventListener('input', this.handleInput);
      this.searchInput.removeEventListener('focus', this.handleFocus);
      this.searchInput.removeEventListener('blur', this.handleBlur);
      this.searchInput.removeEventListener('keydown', this.handleKeydown);
    }
    
    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClear);
    }
    
    // Clear debounced function
    if (this.debouncedSearch) {
      clearTimeout(this.debouncedSearch);
    }
  }
}

export default SearchBar; 