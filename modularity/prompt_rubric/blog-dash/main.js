// Main application entry point
// Orchestrates all components following modular architecture from modularity.rux

import Header from './components/Header.js';
import StatsSection from './components/StatsSection.js';
import SearchBar from './components/SearchBar.js';
import PostsList from './components/PostsList.js';
import CommentsList from './components/CommentsList.js';
import Footer from './components/Footer.js';

class BlogDashboard {
  constructor() {
    // Application state
    this.state = {
      loading: true,
      error: null,
      initialized: false
    };
    
    // Component instances
    this.components = {
      header: null,
      stats: null,
      searchBar: null, // Adding search bar component for live filtering functionality
      posts: null,
      comments: null,
      footer: null // Adding footer component to track component instances
    };
    
    // DOM references
    this.elements = {
      loadingIndicator: null,
      errorContainer: null,
      retryButton: null
    };
    
    // Event handlers bound to this instance
    this.handleComponentEvents = this.handleComponentEvents.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this); // Adding search query handler for live filtering
    this.handleRetry = this.handleRetry.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }
  
  // Initialize the dashboard application
  async init() {
    try {
      console.log('🚀 Initializing BlogDash application...');
      
      // Get DOM references
      this.getDOMReferences();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Initialize all components
      await this.initializeComponents();
      
      // Setup inter-component communication
      this.setupComponentCommunication();
      
      // Hide loading indicator and show dashboard
      this.showDashboard();
      
      this.state.loading = false;
      this.state.initialized = true;
      
      console.log('✅ BlogDash application initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize BlogDash:', error);
      this.handleInitializationError(error);
    }
  }
  
  // Get references to important DOM elements
  getDOMReferences() {
    this.elements.loadingIndicator = document.getElementById('loading-indicator');
    this.elements.errorContainer = document.getElementById('error-container');
    this.elements.retryButton = document.getElementById('retry-button');
  }
  
  // Setup global event listeners for the application
  setupGlobalEventListeners() {
    // Retry button handler
    if (this.elements.retryButton) {
      this.elements.retryButton.addEventListener('click', this.handleRetry);
    }
    
    // Global keyboard navigation
    document.addEventListener('keydown', this.handleKeyboardNavigation);
    
    // Page visibility change handling for performance optimization
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Unload cleanup
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }
  
  // Initialize all dashboard components
  async initializeComponents() {
    console.log('🔧 Initializing components...');
    
    try {
      // Initialize Header component - creates header with site branding and user profile dropdown
      this.components.header = new Header({
        title: 'BlogDash',
        userName: 'John Doe',
        userInitials: 'JD'
      });
      
      // Initialize StatsSection component - displays key metrics with animated counters  
      this.components.stats = new StatsSection({
        animateCounters: true,
        showChanges: true,
        showPeriod: true
      });
      
      // Initialize SearchBar component - provides live search functionality for filtering posts and comments
      this.components.searchBar = new SearchBar({
        placeholder: 'Search posts and comments...',
        debounceMs: 300 // Debounce search input to avoid excessive filtering
      });
      
      // Initialize PostsList component - shows all posts with sortable table and action buttons
      this.components.posts = new PostsList({
        maxPosts: 5, // Changed to 5 posts as requested to match the stats count
        showActions: true,
        sortBy: 'date',
        sortOrder: 'desc'
      });
      
      // Initialize CommentsList component - displays recent comments with moderation capabilities
      this.components.comments = new CommentsList({
        maxComments: 5,
        showActions: true,
        showViewAll: true
      });
      
      // Initialize Footer component - provides site footer with links and company information
      this.components.footer = new Footer({
        companyName: 'BlogDash',
        showSocialLinks: true,
        showQuickLinks: true
      });
      
      // Render components and append to DOM - components render independently and emit events for coordination
      await this.renderComponents();
      
      console.log('✅ All components initialized successfully');
      
    } catch (error) {
      console.error('❌ Component initialization failed:', error);
      throw error;
    }
  }
  
  // Render all components and append to their containers
  async renderComponents() {
    // Header component
    const headerContainer = document.getElementById('header');
    if (headerContainer && this.components.header) {
      const headerElement = this.components.header.render();
      headerContainer.appendChild(headerElement);
    }
    
    // Stats section component
    const statsContainer = document.getElementById('stats-section');
    if (statsContainer && this.components.stats) {
      const statsElement = this.components.stats.render();
      statsContainer.appendChild(statsElement);
    }
    
    // Search bar component - renders search input for live filtering of posts and comments
    const searchContainer = document.getElementById('search-section');
    if (searchContainer && this.components.searchBar) {
      const searchElement = this.components.searchBar.render();
      searchContainer.appendChild(searchElement);
    }
    
    // Posts list component
    const postsContainer = document.getElementById('posts-section');
    if (postsContainer && this.components.posts) {
      const postsElement = this.components.posts.render();
      postsContainer.appendChild(postsElement);
    }
    
    // Comments list component
    const commentsContainer = document.getElementById('comments-section');
    if (commentsContainer && this.components.comments) {
      const commentsElement = this.components.comments.render();
      commentsContainer.appendChild(commentsElement);
    }
    
    // Footer component
    const footerContainer = document.getElementById('footer');
    if (footerContainer && this.components.footer) {
      const footerElement = this.components.footer.render();
      footerContainer.appendChild(footerElement);
    }
  }
  
  // Setup inter-component communication using custom events
  setupComponentCommunication() {
    console.log('🔗 Setting up component communication...');
    
    // Listen for header events
    if (this.components.header?.element) {
      this.components.header.element.addEventListener('header:menuItemClick', this.handleComponentEvents);
    }
    
    // Listen for stats events
    if (this.components.stats?.element) {
      this.components.stats.element.addEventListener('stats:loaded', this.handleComponentEvents);
    }
    
    // Listen for search events - handles live filtering of posts and comments
    if (this.components.searchBar?.element) {
      this.components.searchBar.element.addEventListener('search:query', this.handleSearchQuery);
    }
    
    // Listen for posts events
    if (this.components.posts?.element) {
      this.components.posts.element.addEventListener('posts:loaded', this.handleComponentEvents);
      this.components.posts.element.addEventListener('posts:updated', this.handleComponentEvents); // Listen for posts updates to keep stats in sync
      this.components.posts.element.addEventListener('posts:deleted', this.handleComponentEvents); // Listen for post deletions to update stats
      this.components.posts.element.addEventListener('posts:action', this.handleComponentEvents);
    }
    
    // Listen for comments events
    if (this.components.comments?.element) {
      this.components.comments.element.addEventListener('comments:loaded', this.handleComponentEvents);
      this.components.comments.element.addEventListener('comments:action', this.handleComponentEvents);
    }
    
    // Listen for footer events
    if (this.components.footer?.element) {
      this.components.footer.element.addEventListener('footer:linkClick', this.handleComponentEvents);
    }
  }
  
  // Handle events from components
  handleComponentEvents(event) {
    const [component, action] = event.type.split(':');
    console.log(`📡 Component event: ${component}:${action}`, event.detail);
    
    // Handle posts loaded event to update stats count
    if (component === 'posts' && action === 'loaded' && event.detail?.posts) {
      const postsCount = event.detail.posts.length; // Get actual count of loaded posts
      // Update the stats section with the actual posts count
      if (this.components.stats && typeof this.components.stats.updatePostsCount === 'function') {
        this.components.stats.updatePostsCount(postsCount); // Update stats to reflect actual posts count
      }
    }
    
    // Handle posts updated event to update stats count dynamically
    if (component === 'posts' && action === 'updated' && event.detail?.posts) {
      const postsCount = event.detail.posts.length; // Get displayed posts count after update
      // Update the stats section with the updated posts count
      if (this.components.stats && typeof this.components.stats.updatePostsCount === 'function') {
        this.components.stats.updatePostsCount(postsCount); // Update stats to reflect updated posts count
        console.log(`📊 Posts updated: Updated stats to show ${postsCount} posts`); // Log for confirmation
      }
    }
    
    // Handle posts deleted event to update stats count dynamically
    if (component === 'posts' && action === 'deleted' && event.detail) {
      const totalPosts = event.detail.totalPosts || 0; // Get updated total posts count after deletion
      // Update the stats section with the new posts count
      if (this.components.stats && typeof this.components.stats.updatePostsCount === 'function') {
        this.components.stats.updatePostsCount(totalPosts); // Update stats to reflect new posts count after deletion
        console.log(`📊 Post deleted: Updated stats to show ${totalPosts} posts`); // Log for confirmation
      }
    }
  }
  
  // Handle search query events from SearchBar component - coordinates filtering across posts and comments
  handleSearchQuery(event) {
    const query = event.detail?.query || '';
    console.log(`🔍 Search query: "${query}"`);
    
    // Apply search filter to posts component
    if (this.components.posts && typeof this.components.posts.filterByQuery === 'function') {
      this.components.posts.filterByQuery(query);
    }
    
    // Apply search filter to comments component
    if (this.components.comments && typeof this.components.comments.filterByQuery === 'function') {
      this.components.comments.filterByQuery(query);
    }
  }
  
  // Handle global keyboard navigation
  handleKeyboardNavigation(event) {
    // Skip key handling if user is typing in an input
    if (event.target.matches('input, textarea, [contenteditable]')) {
      return;
    }
    
    switch (event.key) {
      case 'Escape':
        // Close any open dropdowns/modals
        if (this.components.header?.state.dropdownOpen) {
          this.components.header.closeDropdown();
        }
        break;
    }
  }
  
  // Handle page visibility changes for performance optimization
  handleVisibilityChange() {
    if (document.hidden) {
      console.log('📱 Page hidden - could pause non-critical updates');
    } else {
      console.log('👁️ Page visible - resuming normal operation');
    }
  }
  
  // Handle retry button click
  handleRetry() {
    console.log('🔄 Retrying dashboard initialization...');
    this.hideError();
    this.showLoading();
    this.init();
  }
  
  // Show the dashboard (hide loading indicator)
  showDashboard() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = 'none';
    }
    this.hideError();
  }
  
  // Show loading indicator
  showLoading() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = 'flex';
    }
  }
  
  // Show error state
  showError(error) {
    if (this.elements.errorContainer) {
      const errorMessage = this.elements.errorContainer.querySelector('#error-message');
      if (errorMessage) {
        errorMessage.textContent = error.message || 'An unexpected error occurred';
      }
      this.elements.errorContainer.style.display = 'block';
    }
    this.hideLoading();
  }
  
  // Hide error state
  hideError() {
    if (this.elements.errorContainer) {
      this.elements.errorContainer.style.display = 'none';
    }
  }
  
  // Handle initialization errors
  handleInitializationError(error) {
    this.state.error = error;
    this.state.loading = false;
    this.showError(error);
  }
  
  // Cleanup method for proper resource management as required by modularity.rux
  destroy() {
    console.log('🧹 Cleaning up BlogDash application...');
    
    // Destroy all components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // Remove global event listeners
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    if (this.elements.retryButton) {
      this.elements.retryButton.removeEventListener('click', this.handleRetry);
    }
    
    // Clear references
    this.components = {};
    this.elements = {};
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM ready - starting BlogDash...');
  
  // Create and initialize the dashboard
  const dashboard = new BlogDashboard();
  dashboard.init();
  
  // Make dashboard available globally for debugging
  if (typeof window !== 'undefined') {
    window.blogDashboard = dashboard;
  }
});

// Export for potential module usage
export default BlogDashboard; 