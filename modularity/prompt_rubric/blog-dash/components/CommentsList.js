// CommentsList component - displays recent comments
// Follows modular architecture and handles comment moderation

class CommentsList {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      showActions: config.showActions !== false, // Default to true
      maxComments: config.maxComments || 5,
      showViewAll: config.showViewAll !== false, // Default to true
      ...config
    };
    
    // Component state
    this.state = {
      loading: true,
      comments: null,
      filteredComments: null, // Filtered comments for search functionality - only set when search is active
      searchQuery: '', // Current search query for filtering comments by content and author
      error: null
    };
    
    // DOM references
    this.element = null;
    
    // Event handlers bound to this instance
    this.handleActionClick = this.handleActionClick.bind(this);
    
    // Mock data for UI demonstration
    this.mockComments = [
      {
        id: 1,
        author: 'Alice Johnson',
        authorInitials: 'AJ',
        content: 'This article really helped me understand the concepts better. The examples are clear and practical. Thank you for sharing!',
        postTitle: 'Getting Started with Modern Web Development',
        postId: 1,
        time: '2024-01-15T10:30:00Z',
        status: 'approved'
      },
      {
        id: 2,
        author: 'Bob Smith',
        authorInitials: 'BS',
        content: 'Great tutorial! I was struggling with CSS Grid for weeks and this finally made it click for me.',
        postTitle: 'Advanced CSS Grid Techniques',
        postId: 2,
        time: '2024-01-15T09:45:00Z',
        status: 'approved'
      },
      {
        id: 3,
        author: 'Carol Williams',
        authorInitials: 'CW',
        content: 'Could you provide more examples for the performance optimization section? I\'d love to see more real-world use cases.',
        postTitle: 'JavaScript Performance Optimization Tips',
        postId: 3,
        time: '2024-01-15T08:20:00Z',
        status: 'pending'
      },
      {
        id: 4,
        author: 'David Brown',
        authorInitials: 'DB',
        content: 'Accessibility is so important and often overlooked. Thanks for highlighting these key points!',
        postTitle: 'Building Accessible Web Applications',
        postId: 4,
        time: '2024-01-14T16:15:00Z',
        status: 'approved'
      },
      {
        id: 5,
        author: 'Eve Davis',
        authorInitials: 'ED',
        content: 'Looking forward to the future of frontend! Do you think WebAssembly will become more mainstream?',
        postTitle: 'The Future of Frontend Development',
        postId: 5,
        time: '2024-01-14T14:30:00Z',
        status: 'approved'
      },
      {
        id: 6,
        author: 'Frank Miller',
        authorInitials: 'FM',
        content: 'This is spam content trying to promote something irrelevant to the post topic.',
        postTitle: 'Getting Started with Modern Web Development',
        postId: 1,
        time: '2024-01-14T12:00:00Z',
        status: 'spam'
      }
    ];
  }
  
  // Render method returns DOM element as required by modularity.rux
  render() {
    this.element = document.createElement('div');
    this.element.className = 'comments-list';
    this.element.setAttribute('data-testid', 'comments-list');
    
    // Setup event delegation for action buttons
    this.element.addEventListener('click', this.handleActionClick);
    
    // Show loading state initially
    this.renderLoadingState();
    
    // Simulate API call with realistic delay
    this.loadComments();
    
    return this.element;
  }
  
  // Render loading skeleton while data loads
  renderLoadingState() {
    this.element.innerHTML = `
      <div class="comments-list__header">
        <h3 class="comments-list__title">Recent Comments</h3>
      </div>
      <div class="comments-list--loading">
        <div class="comments-list__items">
          ${Array(3).fill().map(() => `
            <div class="comments-list__item">
              <div class="comments-list__item-header">
                <div class="comments-list__skeleton comments-list__skeleton--author"></div>
                <div class="comments-list__skeleton comments-list__skeleton--meta"></div>
              </div>
              <div class="comments-list__skeleton comments-list__skeleton--content"></div>
              <div class="comments-list__skeleton comments-list__skeleton--content"></div>
              <div class="comments-list__skeleton comments-list__skeleton--meta"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Simulate loading comments data - in real app this would be an API call
  async loadComments() {
    try {
      // Simulate network delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Filter out spam comments for main display (but keep for moderation)
      this.state.comments = this.mockComments.filter(comment => comment.status !== 'spam');
      this.state.loading = false;
      this.renderComments();
      
      // Emit loaded event for other components
      const event = new CustomEvent('comments:loaded', {
        detail: { 
          comments: this.state.comments,
          totalComments: this.mockComments.length,
          pendingComments: this.mockComments.filter(c => c.status === 'pending').length
        }
      });
      this.element.dispatchEvent(event);
      
    } catch (error) {
      this.state.error = error;
      this.state.loading = false;
      this.renderError();
    }
  }
  
  // Render the comments list after loading
  renderComments() {
    // Get comments to display - use filtered comments if search is active, otherwise use all comments
    const commentsToDisplay = this.state.filteredComments !== null ? this.state.filteredComments : this.state.comments;
    
    if (!this.state.comments || this.state.comments.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    // Show "No results found" when search returns no results but we have comments
    if (this.state.searchQuery && (!commentsToDisplay || commentsToDisplay.length === 0)) {
      this.renderNoSearchResults();
      return;
    }
    
    const commentsToShow = commentsToDisplay.slice(0, this.config.maxComments);
    
    this.element.innerHTML = `
      <div class="comments-list__header">
        <h3 class="comments-list__title">Recent Comments</h3>
      </div>
      <div class="comments-list__items">
        ${commentsToShow.map(comment => this.renderCommentItem(comment)).join('')}
      </div>
      ${this.config.showViewAll ? `
        <div class="comments-list__view-all">
          <a href="#comments" class="comments-list__view-all-link" data-testid="view-all-comments">
            View All Comments
          </a>
        </div>
      ` : ''}
    `;
  }
  
  // Render individual comment item
  renderCommentItem(comment) {
    const timeAgo = this.getTimeAgo(comment.time);
    
    return `
      <div class="comments-list__item" data-comment-id="${comment.id}" data-testid="comment-item-${comment.id}">
        <div class="comments-list__item-header">
          <div class="comments-list__author">
            <span class="comments-list__author-avatar" aria-hidden="true">
              ${comment.authorInitials}
            </span>
            ${comment.author}
            <div class="comments-list__status comments-list__status--${comment.status}">
              <div class="comments-list__status-dot"></div>
              ${comment.status}
            </div>
          </div>
          <time class="comments-list__time" datetime="${comment.time}" title="${this.formatFullDate(comment.time)}">
            ${timeAgo}
          </time>
        </div>
        
        <div class="comments-list__content">
          ${comment.content}
        </div>
        
        <div class="comments-list__meta">
          <div class="comments-list__post-title">
            <a href="#post/${comment.postId}" data-testid="comment-post-link-${comment.id}">
              on "${comment.postTitle}"
            </a>
          </div>
          
          ${this.config.showActions ? `
            <div class="comments-list__actions">
              ${comment.status === 'pending' ? `
                <button 
                  type="button" 
                  class="comments-list__action-button comments-list__action-button--approve"
                  data-action="approve"
                  data-comment-id="${comment.id}"
                  title="Approve comment"
                  data-testid="approve-comment-${comment.id}"
                >
                  ${this.getActionIcon('approve')}
                </button>
              ` : ''}
              <button 
                type="button" 
                class="comments-list__action-button comments-list__action-button--delete"
                data-action="delete"
                data-comment-id="${comment.id}"
                title="Delete comment"
                data-testid="delete-comment-${comment.id}"
              >
                ${this.getActionIcon('delete')}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  // Get SVG icon for actions
  getActionIcon(action) {
    const icons = {
      approve: `
        <svg class="comments-list__action-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
      `,
      delete: `
        <svg class="comments-list__action-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      `
    };
    
    return icons[action] || '';
  }
  
  // Handle action button clicks using event delegation
  handleActionClick(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = button.dataset.action;
    const commentId = parseInt(button.dataset.commentId);
    const comment = this.state.comments.find(c => c.id === commentId);
    
    if (!comment) return;
    
    // Emit custom event for component communication
    const event = new CustomEvent('comments:action', {
      detail: {
        action,
        comment,
        element: button
      }
    });
    this.element.dispatchEvent(event);
    
    // Handle actions locally for demo purposes
    this.handleCommentAction(action, comment, button);
  }
  
  // Handle specific comment actions
  handleCommentAction(action, comment, button) {
    switch (action) {
      case 'approve':
        console.log('Approving comment:', comment.content.substring(0, 50) + '...');
        this.approveComment(comment.id);
        break;
        
      case 'delete':
        if (confirm(`Are you sure you want to delete this comment from ${comment.author}?`)) {
          this.deleteComment(comment.id);
        }
        break;
    }
  }
  
  // Approve a comment (update local state for demo)
  approveComment(commentId) {
    const comment = this.state.comments.find(c => c.id === commentId);
    if (comment) {
      comment.status = 'approved';
      this.renderComments();
      
      // Emit approval event
      const event = new CustomEvent('comments:approved', {
        detail: { 
          commentId, 
          comment,
          totalApproved: this.state.comments.filter(c => c.status === 'approved').length
        }
      });
      this.element.dispatchEvent(event);
    }
  }
  
  // Delete a comment (local state only for demo)
  deleteComment(commentId) {
    this.state.comments = this.state.comments.filter(comment => comment.id !== commentId);
    this.renderComments();
    
    // Emit deletion event
    const event = new CustomEvent('comments:deleted', {
      detail: { commentId, totalComments: this.state.comments.length }
    });
    this.element.dispatchEvent(event);
  }
  
  // Calculate time ago from timestamp
  getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo ago`;
    }
  }
  
  // Format full date for title attribute
  formatFullDate(timestamp) {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }
  
  // Render empty state when no comments
  renderEmptyState() {
    this.element.innerHTML = `
      <div class="comments-list__header">
        <h3 class="comments-list__title">Recent Comments</h3>
      </div>
      <div class="comments-list__empty">
        <div class="comments-list__empty-icon">
          <svg viewBox="0 0 48 48" fill="currentColor">
            <path d="M40 8H8a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h6l4 8 4-8h18a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4zM12 20h24v2H12v-2zm0-4h24v2H12v-2zm16 8H12v-2h16v2z"/>
          </svg>
        </div>
        <h4 class="comments-list__empty-title">No comments yet</h4>
        <p class="comments-list__empty-description">
          Comments will appear here as readers engage with your content.
        </p>
      </div>
    `;
  }
  
  // Render error state
  renderError() {
    this.element.innerHTML = `
      <div class="comments-list__header">
        <h3 class="comments-list__title">Recent Comments</h3>
      </div>
      <div class="comments-list__empty">
        <h4 class="comments-list__empty-title">Failed to load comments</h4>
        <p class="comments-list__empty-description">
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
    this.loadComments();
  }
  
  // Update method for dynamic content changes as required by modularity.rux
  update(newComments) {
    if (newComments) {
      this.state.comments = newComments;
      this.renderComments();
    }
  }
  
  // Get current comments data
  getComments() {
    return this.state.comments;
  }
  
  // Get pending comments count
  getPendingCount() {
    if (!this.state.comments) return 0;
    return this.state.comments.filter(comment => comment.status === 'pending').length;
  }
  
  // Filter comments by search query - searches in comment content and author name
  filterByQuery(query) {
    this.state.searchQuery = query.trim().toLowerCase();
    
    if (!this.state.searchQuery) {
      // Clear filter when search is empty
      this.state.filteredComments = null;
    } else {
      // Filter comments by content and author name
      this.state.filteredComments = this.state.comments.filter(comment => {
        const contentMatch = comment.content.toLowerCase().includes(this.state.searchQuery);
        const authorMatch = comment.author.toLowerCase().includes(this.state.searchQuery);
        return contentMatch || authorMatch;
      });
    }
    
    // Re-render to show filtered results
    this.renderComments();
  }
  
  // Render "No results found" state when search returns no matches
  renderNoSearchResults() {
    this.element.innerHTML = `
      <div class="comments-list__header">
        <h3 class="comments-list__title">Recent Comments</h3>
      </div>
      <div class="comments-list__no-results">
        <div class="comments-list__no-results-icon">
          <svg viewBox="0 0 48 48" fill="currentColor">
            <path d="M31 28h-1.59l-.55-.55C30.82 25.18 32 22.23 32 19c0-7.18-5.82-13-13-13S6 11.82 6 19s5.82 13 13 13c3.23 0 6.18-1.18 8.45-3.13l.55.55V31l10 9.98L40.98 38 31 28zm-12 0c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"/>
            <path d="M0 0h48v48H0z" fill="none"/>
          </svg>
        </div>
        <h4 class="comments-list__no-results-title">No results found</h4>
        <p class="comments-list__no-results-description">
          No comments match your search for "${this.state.searchQuery}". Try different keywords or browse all comments.
        </p>
      </div>
      ${this.config.showViewAll ? `
        <div class="comments-list__view-all">
          <a href="#comments" class="comments-list__view-all-link" data-testid="view-all-comments">
            View All Comments
          </a>
        </div>
      ` : ''}
    `;
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
export default CommentsList; 