// Footer component - follows modular architecture from modularity.rux
// Provides site footer with links, copyright, and social media icons

class Footer {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      companyName: config.companyName || 'BlogDash',
      currentYear: config.currentYear || new Date().getFullYear(),
      showSocialLinks: config.showSocialLinks !== false, // Default to true
      showQuickLinks: config.showQuickLinks !== false, // Default to true
      ...config
    };
    
    // Component state
    this.state = {
      initialized: false
    };
    
    // DOM references
    this.element = null;
    
    // Event handlers bound to this instance
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }
  
  // Render method returns DOM element as required by modularity.rux
  render() {
    this.element = document.createElement('div');
    this.element.className = 'footer';
    this.element.innerHTML = this.getTemplate();
    
    // Setup event listeners after DOM creation
    this.setupEventListeners();
    
    this.state.initialized = true;
    
    return this.element;
  }
  
  // Template method for clean separation of concerns
  getTemplate() {
    return `
      <!-- Footer container with proper landmark role -->
      <div class="footer__container">
        <!-- Footer content sections -->
        <div class="footer__content">
          <!-- Brand section with logo and description -->
          <div class="footer__brand">
            <div class="footer__logo" aria-hidden="true">B</div>
            <h3 class="footer__brand-name">${this.config.companyName}</h3>
            <p class="footer__description">
              Streamline your content management with our powerful blog dashboard.
            </p>
          </div>
          
          ${this.config.showQuickLinks ? this.getQuickLinksSection() : ''}
          ${this.config.showSocialLinks ? this.getSocialLinksSection() : ''}
        </div>
        
        <!-- Footer bottom with copyright and legal links -->
        <div class="footer__bottom">
          <div class="footer__copyright">
            © ${this.config.currentYear} ${this.config.companyName}. All rights reserved.
          </div>
          <nav class="footer__legal" aria-label="Legal navigation">
            <a href="#privacy" class="footer__legal-link">Privacy Policy</a>
            <a href="#terms" class="footer__legal-link">Terms of Service</a>
            <a href="#cookies" class="footer__legal-link">Cookie Policy</a>
          </nav>
        </div>
      </div>
    `;
  }
  
  // Quick links section for footer navigation
  getQuickLinksSection() {
    return `
      <div class="footer__section">
        <h4 class="footer__section-title">Quick Links</h4>
        <nav class="footer__links" aria-label="Footer navigation">
          <a href="#dashboard" class="footer__link">Dashboard</a>
          <a href="#posts" class="footer__link">Posts</a>
          <a href="#comments" class="footer__link">Comments</a>
          <a href="#analytics" class="footer__link">Analytics</a>
          <a href="#settings" class="footer__link">Settings</a>
          <a href="#help" class="footer__link">Help Center</a>
        </nav>
      </div>
    `;
  }
  
  // Social media links section
  getSocialLinksSection() {
    return `
      <div class="footer__section">
        <h4 class="footer__section-title">Follow Us</h4>
        <div class="footer__social" role="group" aria-label="Social media links">
          <a href="#twitter" class="footer__social-link" aria-label="Follow us on Twitter">
            <svg class="footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#github" class="footer__social-link" aria-label="View our GitHub">
            <svg class="footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="#linkedin" class="footer__social-link" aria-label="Connect on LinkedIn">
            <svg class="footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    `;
  }
  
  // Setup event listeners for footer interactions
  setupEventListeners() {
    // Add click handlers for all footer links
    const links = this.element.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', this.handleLinkClick);
    });
  }
  
  // Handle footer link clicks and emit custom events for component communication
  handleLinkClick(e) {
    e.preventDefault(); // Prevent default anchor behavior for demo
    
    const href = e.target.closest('a').getAttribute('href');
    const action = href.substring(1); // Remove the # from href
    
    // Custom event for component communication as required by modularity.rux
    const event = new CustomEvent('footer:linkClick', {
      detail: {
        action: action,
        element: e.target.closest('a'),
        href: href
      }
    });
    this.element.dispatchEvent(event);
  }
  
  // Update footer configuration
  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Re-render if the component has been initialized
    if (this.state.initialized && this.element) {
      this.element.innerHTML = this.getTemplate();
      this.setupEventListeners();
    }
  }
  
  // Get current footer configuration
  getConfig() {
    return { ...this.config };
  }
  
  // Cleanup method for proper component lifecycle management
  destroy() {
    if (this.element) {
      // Remove event listeners
      const links = this.element.querySelectorAll('a[href^="#"]');
      links.forEach(link => {
        link.removeEventListener('click', this.handleLinkClick);
      });
      
      // Remove element from DOM if it has a parent
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
    
    // Clear references
    this.element = null;
    this.state.initialized = false;
  }
}

// Export the component for modular usage
export default Footer; 