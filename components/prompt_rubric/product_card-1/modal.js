/**
 * Modal Component JavaScript
 * Following modal.rux and base.rux requirements
 * Implements full accessibility, focus management, and keyboard navigation
 */

// Modal manager class to handle all modal functionality
class ModalManager {
  constructor() {
    this.activeModal = null; // Currently open modal
    this.previousFocus = null; // Element that had focus before modal opened
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'; // Focusable selector
    this.mediaImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop&crop=center'
    ]; // Sample images for media modal
    this.currentImageIndex = 0; // Current image in media modal
    
    this.init();
  }

  /**
   * Initialize modal system
   * Set up event listeners and prepare modals
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
    } else {
      this.setupEventListeners();
    }
  }

  /**
   * Set up all event listeners for modal functionality
   * Following accessibility requirements from modal.rux
   */
  setupEventListeners() {
    // Modal trigger buttons
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => this.handleTriggerClick(e));
      
      // Keyboard support for triggers (Enter and Space)
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleTriggerClick(e);
        }
      });
    });

    // Modal close elements (backdrop, close buttons, etc.)
    document.querySelectorAll('[data-modal-close]').forEach(closeElement => {
      closeElement.addEventListener('click', (e) => this.handleCloseClick(e));
    });

    // Global keyboard event listener for modal navigation
    document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));

    // Prevent default dialog behavior and handle custom modal behavior
    document.querySelectorAll('.modal__dialog').forEach(dialog => {
      if (dialog.tagName === 'DIALOG') {
        dialog.addEventListener('cancel', (e) => {
          e.preventDefault(); // Prevent default ESC behavior
          this.closeModal();
        });
      }
    });

    // Set up form submission handling
    this.setupFormHandling();
    
    // Set up media modal navigation
    this.setupMediaNavigation();
    
    // Set up confirmation modal
    this.setupConfirmationModal();
    
    // Initialize any modals that should start open (for debugging)
    this.initializeModals();
  }

  /**
   * Handle trigger button clicks
   * Opens the specified modal with proper focus management
   */
  handleTriggerClick(event) {
    const trigger = event.currentTarget;
    const modalId = trigger.dataset.modalTrigger;
    const modal = document.getElementById(modalId);
    
    if (!modal) {
      console.error(`Modal with ID "${modalId}" not found`);
      return;
    }

    // Store the trigger element for focus return
    this.previousFocus = trigger;
    
    // Open the modal
    this.openModal(modal);
  }

  /**
   * Handle close button clicks
   * Closes the currently active modal
   */
  handleCloseClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Only close if clicking on backdrop or close button
    if (event.currentTarget.hasAttribute('data-modal-close')) {
      this.closeModal();
    }
  }

  /**
   * Handle global keyboard events
   * Implements Escape key closing and Tab trapping as required by modal.rux
   */
  handleGlobalKeydown(event) {
    if (!this.activeModal) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeModal();
        break;
        
      case 'Tab':
        this.handleTabTrapping(event);
        break;
    }
  }

  /**
   * Open a modal with proper accessibility setup
   * Following modal.rux opening behavior requirements
   */
  openModal(modal) {
    if (this.activeModal) {
      this.closeModal(); // Close any existing modal first
    }

    this.activeModal = modal;
    
    // Prevent body scroll as required
    document.body.classList.add('modal-open');
    
    // Show modal with aria-hidden="false"
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management - move to first focusable element or modal itself
    requestAnimationFrame(() => {
      this.setInitialFocus(modal);
    });
    
    // Announce modal opening to screen readers as required
    this.announceToScreenReader(`${this.getModalTitle(modal)} dialog opened`);
    
    // Add modal-specific setup
    this.setupModalSpecificBehavior(modal);
  }

  /**
   * Close the currently active modal
   * Following modal.rux closing behavior requirements
   */
  closeModal() {
    if (!this.activeModal) return;

    const modal = this.activeModal;
    
    // Hide modal
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.classList.remove('modal-open');
    
    // Return focus to trigger element as required
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }
    
    // Announce closure to screen readers
    this.announceToScreenReader(`${this.getModalTitle(modal)} dialog closed`);
    
    // Clean up modal-specific behavior
    this.cleanupModalSpecificBehavior(modal);
    
    this.activeModal = null;
  }

  /**
   * Set initial focus in modal
   * Following modal.rux focus management requirements
   */
  setInitialFocus(modal) {
    // Find first focusable element
    const focusableElements = modal.querySelectorAll(this.focusableElements);
    const firstFocusable = Array.from(focusableElements).find(el => 
      !el.disabled && el.offsetParent !== null
    );
    
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      // Fallback to modal dialog itself
      const dialog = modal.querySelector('.modal__dialog');
      if (dialog && dialog.tabIndex === -1) {
        dialog.tabIndex = -1;
      }
      dialog?.focus();
    }
  }

  /**
   * Handle Tab key trapping within modal
   * Implements focus trap as required by accessibility
   */
  handleTabTrapping(event) {
    if (!this.activeModal) return;

    const focusableElements = Array.from(this.activeModal.querySelectorAll(this.focusableElements))
      .filter(el => !el.disabled && el.offsetParent !== null);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Get modal title for announcements
   * Uses aria-labelledby or falls back to modal title element
   */
  getModalTitle(modal) {
    const dialog = modal.querySelector('.modal__dialog');
    const labelledBy = dialog?.getAttribute('aria-labelledby');
    
    if (labelledBy) {
      const titleElement = document.getElementById(labelledBy);
      return titleElement?.textContent || 'Modal';
    }
    
    return modal.querySelector('.modal__title')?.textContent || 'Modal';
  }

  /**
   * Setup modal-specific behavior based on modal type
   * Handles different modal variants from modal.rux
   */
  setupModalSpecificBehavior(modal) {
    if (modal.classList.contains('modal--form')) {
      this.setupFormModal(modal);
    } else if (modal.classList.contains('modal--media')) {
      this.setupMediaModal(modal);
    } else if (modal.classList.contains('modal--confirmation')) {
      this.setupConfirmationModalBehavior(modal);
    }
  }

  /**
   * Cleanup modal-specific behavior
   */
  cleanupModalSpecificBehavior(modal) {
    // Remove any modal-specific event listeners or state
    if (modal.classList.contains('modal--form')) {
      this.cleanupFormModal(modal);
    }
  }

  /**
   * Setup form modal behavior
   * Implements FormModal variant requirements
   */
  setupFormModal(modal) {
    const form = modal.querySelector('.modal__form');
    if (!form) return;

    // Auto-focus first input field
    const firstInput = form.querySelector('input, textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Track form changes for unsaved changes warning
    this.trackFormChanges(form);
  }

  /**
   * Setup media modal behavior
   * Implements MediaModal variant requirements
   */
  setupMediaModal(modal) {
    this.currentImageIndex = 0;
    this.updateMediaContent(modal);
  }

  /**
   * Update media modal content
   * Handles image navigation in media modal
   */
  updateMediaContent(modal) {
    const image = modal.querySelector('.media__image');
    const counter = modal.querySelector('.media__counter');
    const title = modal.querySelector('.media__title');
    
    if (image && this.mediaImages[this.currentImageIndex]) {
      image.src = this.mediaImages[this.currentImageIndex];
      image.alt = `Landscape image ${this.currentImageIndex + 1} of ${this.mediaImages.length}`;
    }
    
    if (counter) {
      counter.textContent = `${this.currentImageIndex + 1} of ${this.mediaImages.length}`;
    }
    
    if (title) {
      title.textContent = `Landscape ${this.currentImageIndex + 1}`;
    }
  }

  /**
   * Setup media navigation buttons
   */
  setupMediaNavigation() {
    // Previous image button
    document.querySelector('[data-testid="prev-image-btn"]')?.addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.mediaImages.length) % this.mediaImages.length;
      if (this.activeModal?.classList.contains('modal--media')) {
        this.updateMediaContent(this.activeModal);
        this.announceToScreenReader(`Showing image ${this.currentImageIndex + 1} of ${this.mediaImages.length}`);
      }
    });

    // Next image button
    document.querySelector('[data-testid="next-image-btn"]')?.addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.mediaImages.length;
      if (this.activeModal?.classList.contains('modal--media')) {
        this.updateMediaContent(this.activeModal);
        this.announceToScreenReader(`Showing image ${this.currentImageIndex + 1} of ${this.mediaImages.length}`);
      }
    });

    // Fullscreen toggle
    document.querySelector('[data-testid="fullscreen-btn"]')?.addEventListener('click', () => {
      this.toggleFullscreen();
    });
  }

  /**
   * Setup confirmation modal behavior
   */
  setupConfirmationModal() {
    const confirmBtn = document.querySelector('[data-testid="confirm-delete-btn"]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.handleAccountDeletion());
    }
  }

  /**
   * Setup form handling for all forms
   */
  setupFormHandling() {
    const profileForm = document.querySelector('[data-testid="profile-form"]');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
    }
  }

  /**
   * Handle profile form submission
   * Demonstrates form validation and submission in modal
   */
  handleProfileSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!data.name || !data.email) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate API call
    this.showLoadingState(event.target);
    
    setTimeout(() => {
      this.hideLoadingState(event.target);
      this.showNotification('Profile updated successfully!', 'success');
      this.closeModal();
    }, 1500);
  }

  /**
   * Handle account deletion confirmation
   * Demonstrates destructive action with confirmation
   */
  handleAccountDeletion() {
    const confirmBtn = document.querySelector('[data-testid="confirm-delete-btn"]');
    
    // Show loading state
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Deleting...';
    }
    
    // Simulate deletion process
    setTimeout(() => {
      this.showNotification('Account deletion would be processed', 'warning');
      this.closeModal();
      
      // Reset button state
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Delete Account';
      }
    }, 2000);
  }

  /**
   * Track form changes for unsaved changes warning
   */
  trackFormChanges(form) {
    let hasChanges = false;
    
    form.addEventListener('input', () => {
      hasChanges = true;
    });
    
    // Warn before closing if there are unsaved changes
    const originalClose = this.closeModal.bind(this);
    this.closeModal = () => {
      if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
      originalClose();
    };
  }

  /**
   * Cleanup form modal specific behavior
   */
  cleanupFormModal(modal) {
    // Reset the close method
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   * Toggle fullscreen mode for media modal
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      this.announceToScreenReader('Entered fullscreen mode');
    } else {
      document.exitFullscreen?.();
      this.announceToScreenReader('Exited fullscreen mode');
    }
  }

  /**
   * Show loading state for elements
   */
  showLoadingState(element) {
    if (element.tagName === 'FORM') {
      const submitBtn = element.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
      }
    }
  }

  /**
   * Hide loading state for elements
   */
  hideLoadingState(element) {
    if (element.tagName === 'FORM') {
      const submitBtn = element.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.setAttribute('aria-busy', 'false');
        if (submitBtn.dataset.originalText) {
          submitBtn.textContent = submitBtn.dataset.originalText;
          delete submitBtn.dataset.originalText;
        }
      }
    }
  }

  /**
   * Show notification to user
   * Accessible notification system
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = this.sanitizeString(message);
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    // Style notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--z-notification')) || 1000};
      max-width: 300px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease-out;
      background-color: ${type === 'error' ? '#fee2e2' : type === 'warning' ? '#fef3c7' : '#dcfce7'};
      border: 1px solid ${type === 'error' ? '#fca5a5' : type === 'warning' ? '#fcd34d' : '#86efac'};
      color: ${type === 'error' ? '#991b1b' : type === 'warning' ? '#92400e' : '#14532d'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  /**
   * Announce message to screen readers
   * Uses aria-live region for announcements
   */
  announceToScreenReader(message) {
    const announcer = document.getElementById('modal-announcements');
    if (announcer) {
      announcer.textContent = this.sanitizeString(message);
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  /**
   * Sanitize strings to prevent XSS
   * Following security requirements from base.rux
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    
    return str
      .replace(/[<>'"&]/g, function(match) {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match];
      })
      .trim()
      .slice(0, 200); // Limit length
  }

  /**
   * Initialize any modals that should start open
   * Useful for development and testing
   */
  initializeModals() {
    // Check URL hash for modal to open (useful for direct linking)
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      const modal = document.getElementById(hash);
      if (modal && modal.classList.contains('modal')) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => this.openModal(modal), 100);
      }
    }
  }

  /**
   * Setup confirmation modal specific behavior
   */
  setupConfirmationModalBehavior(modal) {
    // Focus the cancel button by default for safety
    const cancelBtn = modal.querySelector('.btn--secondary');
    if (cancelBtn) {
      setTimeout(() => cancelBtn.focus(), 100);
    }
  }
}

// Initialize modal manager when DOM is ready
let modalManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    modalManager = new ModalManager();
  });
} else {
  modalManager = new ModalManager();
}

// Export for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModalManager };
} 