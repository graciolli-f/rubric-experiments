// PostsList component - displays recent posts with actions
// Follows modular architecture and handles CRUD operations

class PostsList {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      showActions: config.showActions !== false, // Default to true
      maxPosts: config.maxPosts || 10,
      sortBy: config.sortBy || 'date',
      sortOrder: config.sortOrder || 'desc',
      ...config
    };
    
    // Component state
    this.state = {
      loading: true,
      posts: null,
      error: null,
      sortBy: this.config.sortBy,
      sortOrder: this.config.sortOrder
    };
    
    // DOM references
    this.element = null;
    
    // Event handlers bound to this instance
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
    
    // Mock data for UI demonstration
    this.mockPosts = [
      {
        id: 1,
        title: 'Getting Started with Modern Web Development',
        date: '2024-01-15',
        views: 2834,
        comments: 45,
        status: 'published',
        author: 'John Doe'
      },
      {
        id: 2,
        title: 'Advanced CSS Grid Techniques for Responsive Design',
        date: '2024-01-12',
        views: 1923,
        comments: 32,
        status: 'published',
        author: 'Jane Smith'
      },
      {
        id: 3,
        title: 'JavaScript Performance Optimization Tips',
        date: '2024-01-10',
        views: 3156,
        comments: 67,
        status: 'published',
        author: 'Mike Johnson'
      },
      {
        id: 4,
        title: 'Building Accessible Web Applications',
        date: '2024-01-08',
        views: 1456,
        comments: 28,
        status: 'draft',
        author: 'Sarah Wilson'
      },
      {
        id: 5,
        title: 'The Future of Frontend Development',
        date: '2024-01-20',
        views: 0,
        comments: 0,
        status: 'scheduled',
        author: 'Alex Brown'
      }
    ];
  }
  
  // Render method returns DOM element as required by modularity.rux
  render() {
    this.element = document.createElement('div');
    this.element.className = 'posts-list';
    this.element.setAttribute('data-testid', 'posts-list');
    
    // Setup event delegation for action buttons
    this.element.addEventListener('click', this.handleActionClick);
    
    // Show loading state initially
    this.renderLoadingState();
    
    // Simulate API call with realistic delay
    this.loadPosts();
    
    return this.element;
  }
  
  // Render loading skeleton while data loads
  renderLoadingState() {
    this.element.innerHTML = `
      <div class="posts-list__header">
        <h3 class="posts-list__title">Recent Posts</h3>
      </div>
      <div class="posts-list--loading">
        <table class="posts-list__table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Views</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${Array(5).fill().map(() => `
              <tr>
                <td><div class="posts-list__skeleton posts-list__skeleton--title"></div></td>
                <td><div class="posts-list__skeleton posts-list__skeleton--date"></div></td>
                <td><div class="posts-list__skeleton posts-list__skeleton--stats"></div></td>
                <td><div class="posts-list__skeleton posts-list__skeleton--stats"></div></td>
                <td><div class="posts-list__skeleton posts-list__skeleton--stats"></div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Simulate loading posts data - in real app this would be an API call
  async loadPosts() {
    try {
      // Simulate network delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      this.state.posts = [...this.mockPosts];
      this.state.loading = false;
      this.sortPosts();
      this.renderPosts();
      
      // Emit loaded event for other components
      const event = new CustomEvent('posts:loaded', {
        detail: { posts: this.state.posts }
      });
      this.element.dispatchEvent(event);
      
    } catch (error) {
      this.state.error = error;
      this.state.loading = false;
      this.renderError();
    }
  }
  
  // Sort posts based on current sort settings
  sortPosts() {
    if (!this.state.posts) return;
    
    this.state.posts.sort((a, b) => {
      let aValue = a[this.state.sortBy];
      let bValue = b[this.state.sortBy];
      
      // Handle date sorting
      if (this.state.sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle numeric sorting
      if (typeof aValue === 'number') {
        return this.state.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string sorting
      if (typeof aValue === 'string') {
        return this.state.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle date sorting
      if (aValue instanceof Date) {
        return this.state.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }
  
  // Render the posts table after loading
  renderPosts() {
    if (!this.state.posts || this.state.posts.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    this.element.innerHTML = `
      <div class="posts-list__header">
        <h3 class="posts-list__title">Recent Posts</h3>
      </div>
      <table class="posts-list__table">
        <thead>
          <tr>
            <th>
              <button type="button" class="posts-list__sort-button" data-sort="title">
                Title
              </button>
            </th>
            <th>
              <button type="button" class="posts-list__sort-button" data-sort="date">
                Date
              </button>
            </th>
            <th>
              <button type="button" class="posts-list__sort-button" data-sort="views">
                Views
              </button>
            </th>
            <th>
              <button type="button" class="posts-list__sort-button" data-sort="comments">
                Comments
              </button>
            </th>
            ${this.config.showActions ? '<th>Actions</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${this.state.posts.slice(0, this.config.maxPosts).map(post => this.renderPostRow(post)).join('')}
        </tbody>
      </table>
    `;
    
    // Setup sort handlers
    this.setupSortHandlers();
  }
  
  // Render individual post row
  renderPostRow(post) {
    const formattedDate = this.formatDate(post.date);
    const formattedViews = this.formatNumber(post.views);
    const formattedComments = this.formatNumber(post.comments);
    
    return `
      <tr data-post-id="${post.id}">
        <td data-label="Title" class="posts-list__post-title">
          <a href="#post/${post.id}" data-testid="post-link-${post.id}">
            ${post.title}
          </a>
          <div class="posts-list__status posts-list__status--${post.status}">
            <div class="posts-list__status-dot"></div>
            ${post.status}
          </div>
        </td>
        <td data-label="Date" class="posts-list__date">
          <time datetime="${post.date}">${formattedDate}</time>
        </td>
        <td data-label="Views" class="posts-list__stats">
          ${formattedViews}
        </td>
        <td data-label="Comments" class="posts-list__stats">
          ${formattedComments}
        </td>
        ${this.config.showActions ? `
          <td data-label="Actions" class="posts-list__actions">
            <div class="posts-list__action-buttons">
              <button 
                type="button" 
                class="posts-list__action-button posts-list__action-button--view"
                data-action="view"
                data-post-id="${post.id}"
                title="View post"
                data-testid="view-post-${post.id}"
              >
                ${this.getActionIcon('view')}
              </button>
              <button 
                type="button" 
                class="posts-list__action-button posts-list__action-button--edit"
                data-action="edit"
                data-post-id="${post.id}"
                title="Edit post"
                data-testid="edit-post-${post.id}"
              >
                ${this.getActionIcon('edit')}
              </button>
              <button 
                type="button" 
                class="posts-list__action-button posts-list__action-button--delete"
                data-action="delete"
                data-post-id="${post.id}"
                title="Delete post"
                data-testid="delete-post-${post.id}"
              >
                ${this.getActionIcon('delete')}
              </button>
            </div>
          </td>
        ` : ''}
      </tr>
    `;
  }
  
  // Get SVG icon for actions
  getActionIcon(action) {
    const icons = {
      view: `
        <svg class="posts-list__action-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2C4.5 2 1.4 4.5 0 8c1.4 3.5 4.5 6 8 6s6.6-2.5 8-6c-1.4-3.5-4.5-6-8-6zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
        </svg>
      `,
      edit: `
        <svg class="posts-list__action-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L6.621 13.087a.5.5 0 0 1-.234.156l-4 1a.5.5 0 0 1-.625-.625l1-4a.5.5 0 0 1 .156-.234L12.146.146zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293L12.793 5.5z"/>
        </svg>
      `,
      delete: `
        <svg class="posts-list__action-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      `
    };
    
    return icons[action] || '';
  }
  
  // Setup sort button handlers
  setupSortHandlers() {
    const sortButtons = this.element.querySelectorAll('.posts-list__sort-button');
    sortButtons.forEach(button => {
      button.addEventListener('click', this.handleSort);
    });
  }
  
  // Handle sorting
  handleSort(e) {
    const sortBy = e.target.dataset.sort;
    
    // Toggle sort order if clicking same column
    if (this.state.sortBy === sortBy) {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortBy = sortBy;
      this.state.sortOrder = 'desc'; // Default to descending
    }
    
    this.sortPosts();
    this.renderPosts();
  }
  
  // Handle action button clicks using event delegation
  handleActionClick(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = button.dataset.action;
    const postId = parseInt(button.dataset.postId);
    const post = this.state.posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Emit custom event for component communication
    const event = new CustomEvent('posts:action', {
      detail: {
        action,
        post,
        element: button
      }
    });
    this.element.dispatchEvent(event);
    
    // Handle actions locally for demo purposes
    this.handlePostAction(action, post, button);
  }
  
  // Handle specific post actions
  handlePostAction(action, post, button) {
    switch (action) {
      case 'view':
        console.log('Viewing post:', post.title);
        // In real app: navigate to post view
        break;
        
      case 'edit':
        console.log('Editing post:', post.title);
        // In real app: navigate to edit form
        break;
        
      case 'delete':
        if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
          this.deletePost(post.id);
        }
        break;
    }
  }
  
  // Delete a post (local state only for demo)
  deletePost(postId) {
    this.state.posts = this.state.posts.filter(post => post.id !== postId);
    this.renderPosts();
    
    // Emit deletion event
    const event = new CustomEvent('posts:deleted', {
      detail: { postId, totalPosts: this.state.posts.length }
    });
    this.element.dispatchEvent(event);
  }
  
  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
  
  // Format numbers with appropriate separators
  formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }
  
  // Render empty state when no posts
  renderEmptyState() {
    this.element.innerHTML = `
      <div class="posts-list__header">
        <h3 class="posts-list__title">Recent Posts</h3>
      </div>
      <div class="posts-list__empty">
        <div class="posts-list__empty-icon">
          <svg viewBox="0 0 48 48" fill="currentColor">
            <path d="M8 4h32v40H8V4zm4 4v32h24V8H12zm4 4h16v2H16v-2zm0 4h16v2H16v-2zm0 4h12v2H16v-2z"/>
          </svg>
        </div>
        <h4 class="posts-list__empty-title">No posts found</h4>
        <p class="posts-list__empty-description">
          Start creating content to see your posts here.
        </p>
        <button type="button" class="button button--primary">
          Create New Post
        </button>
      </div>
    `;
  }
  
  // Render error state
  renderError() {
    this.element.innerHTML = `
      <div class="posts-list__header">
        <h3 class="posts-list__title">Recent Posts</h3>
      </div>
      <div class="posts-list__empty">
        <h4 class="posts-list__empty-title">Failed to load posts</h4>
        <p class="posts-list__empty-description">
          Please try again or contact support if the problem persists.
        </p>
        <button type="button" class="button button--primary" onclick="this.retry()">
          Retry
        </button>
      </div>
    `;
  }
  
  // Retry loading after error
  retry() {
    this.state.loading = true;
    this.state.error = null;
    this.renderLoadingState();
    this.loadPosts();
  }
  
  // Update method for dynamic content changes as required by modularity.rux
  update(newPosts) {
    if (newPosts) {
      this.state.posts = newPosts;
      this.sortPosts();
      this.renderPosts();
    }
  }
  
  // Get current posts data
  getPosts() {
    return this.state.posts;
  }
  
  // Cleanup method for proper resource management as required by modularity.rux
  destroy() {
    // Remove event listeners
    if (this.element) {
      this.element.removeEventListener('click', this.handleActionClick);
    }
    
    // Clear references
    this.element = null;
  }
}

// Export for ES6 module system
export default PostsList; 