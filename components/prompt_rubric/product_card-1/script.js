/**
 * Product Card Interactive Functionality
 * Following base.rux security and accessibility requirements
 * No eval() or Function() with user input as required
 * CSP compliant implementation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize product card functionality
  initializeProductCard();
});

/**
 * Main initialization function for product card
 * Sets up event listeners and interactive features
 */
function initializeProductCard() {
  // Get card element
  const card = document.querySelector('[data-testid="product-card"]');
  
  if (!card) {
    console.warn('Product card not found'); // Safe logging without user input
    return;
  }

  // Initialize button functionality
  initializeButtons(card);
  
  // Initialize accessibility features
  initializeAccessibility(card);
  
  // Initialize visual enhancements
  initializeVisualEffects(card);
  
  // Add loading state management
  initializeLoadingStates(card);
}

/**
 * Initialize button event handlers
 * Following accessibility guidelines with proper focus management
 */
function initializeButtons(card) {
  // Add to Cart button functionality
  const addToCartBtn = card.querySelector('[data-testid="add-to-cart-btn"]');
  if (addToCartBtn) {
    // Add click handler with debouncing to prevent rapid fire events
    addToCartBtn.addEventListener('click', debounce(handleAddToCart, 300));
    
    // Add keyboard support (Enter and Space) as required by accessibility
    addToCartBtn.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent default space scrolling
        handleAddToCart.call(this, event);
      }
    });
  }

  // Wishlist button functionality
  const wishlistBtn = card.querySelector('[data-testid="wishlist-btn"]');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', debounce(handleWishlistToggle, 200));
    
    // Keyboard support
    wishlistBtn.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleWishlistToggle.call(this, event);
      }
    });
  }

  // Quick view button functionality
  const quickViewBtn = card.querySelector('[data-testid="quick-view-btn"]');
  if (quickViewBtn) {
    quickViewBtn.addEventListener('click', debounce(handleQuickView, 200));
    
    // Keyboard support
    quickViewBtn.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleQuickView.call(this, event);
      }
    });
  }
}

/**
 * Handle Add to Cart functionality
 * Sanitizes user data as required by security guidelines
 */
function handleAddToCart(event) {
  const button = event.currentTarget;
  const productId = sanitizeString(button.dataset.productId);
  const productName = sanitizeString(button.dataset.productName);
  const productPrice = sanitizeString(button.dataset.productPrice);
  
  // Validate required data exists
  if (!productId || !productName || !productPrice) {
    showErrorMessage('Invalid product data');
    return;
  }
  
  // Show loading state
  setButtonLoadingState(button, true);
  
  // Simulate API call (replace with actual implementation)
  setTimeout(() => {
    try {
      // In a real application, this would be an API call
      console.log('Adding to cart:', { productId, productName, productPrice });
      
      // Show success feedback
      showSuccessMessage(`${productName} added to cart!`);
      
      // Update button state temporarily
      const originalText = button.querySelector('.btn__text').textContent;
      button.querySelector('.btn__text').textContent = 'Added!';
      
      // Reset button after delay
      setTimeout(() => {
        button.querySelector('.btn__text').textContent = originalText;
        setButtonLoadingState(button, false);
      }, 1500);
      
      // Announce to screen readers as required by accessibility
      announceToScreenReader(`${productName} has been added to your cart`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showErrorMessage('Failed to add item to cart. Please try again.');
      setButtonLoadingState(button, false);
    }
  }, 800); // Simulate network delay
}

/**
 * Handle wishlist toggle functionality
 * Maintains state and provides feedback
 */
function handleWishlistToggle(event) {
  const button = event.currentTarget;
  const productId = sanitizeString(button.dataset.productId);
  
  if (!productId) {
    showErrorMessage('Invalid product data');
    return;
  }
  
  // Toggle active state
  const isActive = button.classList.contains('btn--active');
  button.classList.toggle('btn--active');
  
  // Update aria-pressed for accessibility
  button.setAttribute('aria-pressed', (!isActive).toString());
  
  // Update button icon
  const icon = button.querySelector('.btn__icon');
  if (icon) {
    icon.textContent = isActive ? '♡' : '♥';
  }
  
  // Announce action to screen readers
  const action = isActive ? 'removed from' : 'added to';
  announceToScreenReader(`Product ${action} wishlist`);
  
  // Show feedback message
  const message = isActive ? 'Removed from wishlist' : 'Added to wishlist';
  showSuccessMessage(message);
  
  // In a real application, sync with backend
  console.log(`Wishlist ${action} for product:`, productId);
}

/**
 * Handle quick view functionality
 * Would typically open a modal or navigate to detailed view
 */
function handleQuickView(event) {
  const button = event.currentTarget;
  const productId = sanitizeString(button.dataset.productId);
  
  if (!productId) {
    showErrorMessage('Invalid product data');
    return;
  }
  
  // Show loading state briefly
  setButtonLoadingState(button, true);
  
  // Simulate quick view action
  setTimeout(() => {
    console.log('Opening quick view for product:', productId);
    showSuccessMessage('Quick view feature coming soon!');
    setButtonLoadingState(button, false);
    
    // In a real application, this would open a modal or navigate
    // For now, just announce to screen readers
    announceToScreenReader('Quick view opened for product details');
  }, 300);
}

/**
 * Initialize accessibility features
 * Ensures keyboard navigation and screen reader support
 */
function initializeAccessibility(card) {
  // Set up keyboard navigation within card
  const focusableElements = card.querySelectorAll('button, [tabindex="0"]');
  
  // Ensure all interactive elements have proper focus indicators
  focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
      this.setAttribute('data-focused', 'true');
    });
    
    element.addEventListener('blur', function() {
      this.removeAttribute('data-focused');
    });
  });
  
  // Add aria-live region for dynamic announcements if not exists
  if (!document.querySelector('[aria-live="polite"]')) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Screen reader only
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);
  }
}

/**
 * Initialize visual effects and animations
 * Respects user preferences for reduced motion
 */
function initializeVisualEffects(card) {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    // Add subtle entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // Animate in after a short delay
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
  
  // Add hover effects for interactive elements
  const buttons = card.querySelectorAll('.btn');
  buttons.forEach(button => {
    if (!prefersReducedMotion) {
      // Add ripple effect on click
      button.addEventListener('click', function(event) {
        createRippleEffect(this, event);
      });
    }
  });
}

/**
 * Initialize loading states management
 * Provides visual feedback during async operations
 */
function initializeLoadingStates(card) {
  // Add loading skeleton capability
  const image = card.querySelector('.card__image');
  
  if (image) {
    // Handle image loading states
    image.addEventListener('load', function() {
      this.classList.add('loaded');
    });
    
    image.addEventListener('error', function() {
      this.classList.add('error');
      // Provide fallback image or placeholder
      this.alt = 'Product image unavailable';
    });
  }
}

/**
 * Utility function to sanitize strings and prevent XSS
 * Following security requirements from base.rux
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  // Basic sanitization - in production, use a proper sanitization library
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
    .slice(0, 100); // Limit length to prevent abuse
}

/**
 * Debounce function to prevent rapid fire events
 * Performance optimization as suggested in base.rux
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Set button loading state with accessibility considerations
 */
function setButtonLoadingState(button, isLoading) {
  if (isLoading) {
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    button.classList.add('btn--loading');
    
    // Store original content
    const textElement = button.querySelector('.btn__text');
    if (textElement) {
      button.dataset.originalText = textElement.textContent;
      textElement.textContent = 'Loading...';
    }
  } else {
    button.setAttribute('aria-busy', 'false');
    button.disabled = false;
    button.classList.remove('btn--loading');
    
    // Restore original content
    const textElement = button.querySelector('.btn__text');
    if (textElement && button.dataset.originalText) {
      textElement.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
}

/**
 * Show success message to user
 * Accessible feedback mechanism
 */
function showSuccessMessage(message) {
  showNotification(message, 'success');
}

/**
 * Show error message to user
 * Accessible error feedback
 */
function showErrorMessage(message) {
  showNotification(message, 'error');
}

/**
 * Generic notification system
 * Creates temporary, accessible notifications
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = sanitizeString(message); // Sanitize message content
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
    z-index: 1000;
    max-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease-out;
    background-color: ${type === 'error' ? '#fee2e2' : '#dcfce7'};
    border: ${type === 'error' ? '1px solid #fca5a5' : '1px solid #86efac'};
    color: ${type === 'error' ? '#991b1b' : '#14532d'};
  `;
  
  // Add to DOM
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
  }, 3000);
}

/**
 * Announce message to screen readers
 * Accessibility helper function
 */
function announceToScreenReader(message) {
  const liveRegion = document.querySelector('[aria-live="polite"]');
  if (liveRegion) {
    liveRegion.textContent = sanitizeString(message);
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
}

/**
 * Create ripple effect for button interactions
 * Visual enhancement respecting motion preferences
 */
function createRippleEffect(button, event) {
  // Check if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;
  
  // Add ripple styles if not already added
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  button.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Export functions for potential testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizeString,
    debounce,
    showNotification,
    announceToScreenReader
  };
} 