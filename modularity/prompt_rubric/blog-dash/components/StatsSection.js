// StatsSection component - displays dashboard statistics
// Follows modular architecture and handles loading states

class StatsSection {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      showChanges: config.showChanges !== false, // Default to true
      showPeriod: config.showPeriod !== false,  // Default to true
      animateCounters: config.animateCounters !== false, // Default to true
      ...config
    };
    
    // Component state
    this.state = {
      loading: true,
      stats: null,
      error: null
    };
    
    // DOM references
    this.element = null;
    
    // Mock data for UI demonstration
    this.mockStats = [
      {
        id: 'posts',
        title: 'Total Posts',
        value: 1247,
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
      }
    ];
  }
  
  // Render method returns DOM element as required by modularity.rux
  render() {
    this.element = document.createElement('div');
    this.element.className = 'stats-section';
    this.element.setAttribute('data-testid', 'stats-section');
    
    // Show loading state initially
    this.renderLoadingState();
    
    // Simulate API call with realistic delay
    this.loadStats();
    
    return this.element;
  }
  
  // Render loading skeleton while data loads
  renderLoadingState() {
    this.element.innerHTML = this.mockStats.map(() => `
      <div class="stats-card stats-card--loading" data-testid="stats-card-loading">
        <div class="stats-card__header">
          <h3 class="stats-card__title">Loading...</h3>
          <div class="stats-card__icon stats-card__icon--posts" aria-hidden="true">
            <span>?</span>
          </div>
        </div>
        <div class="stats-card__value stats-card__value--loading">0000</div>
        <div class="stats-card__change stats-card__change--loading"></div>
        <div class="stats-card__period">Loading...</div>
      </div>
    `).join('');
  }
  
  // Simulate loading stats data - in real app this would be an API call
  async loadStats() {
    try {
      // Simulate network delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      this.state.stats = this.mockStats;
      this.state.loading = false;
      this.renderStats();
      
      // Emit loaded event for other components
      const event = new CustomEvent('stats:loaded', {
        detail: { stats: this.state.stats }
      });
      this.element.dispatchEvent(event);
      
    } catch (error) {
      this.state.error = error;
      this.state.loading = false;
      this.renderError();
    }
  }
  
  // Render the actual stats after loading
  renderStats() {
    this.element.innerHTML = this.state.stats.map(stat => this.renderStatCard(stat)).join('');
    
    // Animate counters if enabled - enhances user experience
    if (this.config.animateCounters) {
      this.animateCounters();
    }
  }
  
  // Render individual stat card
  renderStatCard(stat) {
    const changeClass = this.getChangeClass(stat.change);
    const changeIcon = this.getChangeIcon(stat.change);
    const formattedValue = this.formatNumber(stat.value);
    const formattedChange = this.formatChange(stat.change);
    
    return `
      <div class="stats-card" data-testid="stats-card-${stat.id}">
        <!-- Card header with title and icon -->
        <div class="stats-card__header">
          <h3 class="stats-card__title">${stat.title}</h3>
          <div class="stats-card__icon stats-card__icon--${stat.id}" aria-hidden="true">
            ${this.getIconSVG(stat.icon)}
          </div>
        </div>
        
        <!-- Main value with animation support -->
        <div class="stats-card__value" data-value="${stat.value}">${formattedValue}</div>
        
        <!-- Change indicator if enabled -->
        ${this.config.showChanges ? `
          <div class="stats-card__change stats-card__change--${changeClass}">
            ${changeIcon}
            <span>${formattedChange}</span>
          </div>
        ` : ''}
        
        <!-- Period indicator if enabled -->
        ${this.config.showPeriod ? `
          <div class="stats-card__period">${stat.period}</div>
        ` : ''}
      </div>
    `;
  }
  
  // Get CSS class for change indicator based on value
  getChangeClass(change) {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }
  
  // Get icon for change direction
  getChangeIcon(change) {
    if (change > 0) {
      return `
        <svg class="stats-card__change-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" transform="rotate(180 8 8)" clip-rule="evenodd" />
        </svg>
      `;
    } else if (change < 0) {
      return `
        <svg class="stats-card__change-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" clip-rule="evenodd" />
        </svg>
      `;
    }
    return '';
  }
  
  // Get SVG icon for each stat type
  getIconSVG(iconType) {
    const icons = {
      document: `
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path fill-rule="evenodd" d="M4 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5L9.5 1H4zM9 4.5V2L12 4.5H9z" clip-rule="evenodd" />
        </svg>
      `,
      eye: `
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M8 2C4.5 2 1.4 4.5 0 8c1.4 3.5 4.5 6 8 6s6.6-2.5 8-6c-1.4-3.5-4.5-6-8-6zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
        </svg>
      `,
      chat: `
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894z"/>
        </svg>
      `
    };
    
    return icons[iconType] || icons.document;
  }
  
  // Format numbers with appropriate separators
  formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }
  
  // Format change percentage
  formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }
  
  // Animate counters from 0 to target value
  animateCounters() {
    const valueElements = this.element.querySelectorAll('.stats-card__value');
    
    valueElements.forEach(element => {
      const targetValue = parseInt(element.dataset.value);
      const duration = 1500; // Animation duration in ms
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(targetValue * easeOutCubic);
        
        element.textContent = this.formatNumber(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = this.formatNumber(targetValue);
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
  
  // Render error state if data loading fails
  renderError() {
    this.element.innerHTML = `
      <div class="stats-section__error" data-testid="stats-error">
        <h3>Unable to load statistics</h3>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
        <button type="button" class="button button--primary" onclick="this.retry()">
          Retry
        </button>
      </div>
    `;
  }
  
  // Retry loading stats after error
  retry() {
    this.state.loading = true;
    this.state.error = null;
    this.renderLoadingState();
    this.loadStats();
  }
  
  // Update method for dynamic content changes as required by modularity.rux
  update(newStats) {
    if (newStats) {
      this.state.stats = newStats;
      this.renderStats();
    }
  }
  
  // Get current stats data
  getStats() {
    return this.state.stats;
  }
  
  // Cleanup method for proper resource management as required by modularity.rux
  destroy() {
    // Clear any ongoing animations
    if (this.element) {
      const valueElements = this.element.querySelectorAll('.stats-card__value');
      valueElements.forEach(element => {
        element.textContent = this.formatNumber(element.dataset.value);
      });
    }
    
    // Clear references
    this.element = null;
  }
}

// Export for ES6 module system
export default StatsSection; 