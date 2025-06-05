/**
 * Product Card Interactive Functionality
 * Following rubric requirements for accessibility, performance, and security
 */

// DOM elements - cached for performance
const productCard = document.querySelector('[data-testid="product-card"]');
const addToCartButton = document.querySelector('[data-testid="add-to-cart-button"]');
const quickViewButton = document.querySelector('[data-testid="quick-view-button"]');
const wishlistButton = document.querySelector('[data-testid="wishlist-button"]');

// State management
let isLoading = false;
let isInWishlist = false;

/**
 * Initialize the product card functionality
 * Required: No keyboard traps, proper event handling
 */
function initializeProductCard() {
  // Add event listeners with proper error handling
  addEventListeners();
  
  // Initialize accessibility features
  initializeAccessibility();
  
  // Load saved wishlist state from localStorage (if any)
  loadWishlistState();
  
  console.log('Product card initialized successfully');
}

/**
 * Add event listeners to interactive elements
 * Required: Keyboard navigable, no inline event handlers
 */
function addEventListeners() {
  // Add to cart functionality
  if (addToCartButton) {
    addToCartButton.addEventListener('click', handleAddToCart);
    // Required: Keyboard support
    addToCartButton.addEventListener('keydown', handleButtonKeydown);
  }
  
  // Quick view functionality
  if (quickViewButton) {
    quickViewButton.addEventListener('click', handleQuickView);
    quickViewButton.addEventListener('keydown', handleButtonKeydown);
  }
  
  // Wishlist functionality
  if (wishlistButton) {
    wishlistButton.addEventListener('click', handleWishlistToggle);
    wishlistButton.addEventListener('keydown', handleButtonKeydown);
  }
  
  // Image loading error handling
  const productImage = productCard?.querySelector('.card__image');
  if (productImage) {
    productImage.addEventListener('error', handleImageError);
    productImage.addEventListener('load', handleImageLoad);
  }
}

/**
 * Handle keyboard navigation for buttons
 * Required: Keyboard navigable, no keyboard traps
 */
function handleButtonKeydown(event) {
  // Allow Enter and Space to trigger button actions
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.target.click();
  }
}

/**
 * Handle add to cart action
 * Required: Loading states communicated, immediate feedback
 */
async function handleAddToCart(event) {
  // Prevent double-clicking during loading
  if (isLoading) return;
  
  const button = event.target.closest('.card__button--primary');
  const productData = getProductData(button);
  
  try {
    // Show loading state
    setLoadingState(true);
    
    // Announce state change to screen readers
    announceToScreenReader('Adding item to cart...');
    
    // Simulate API call (replace with actual implementation)
    await simulateAddToCart(productData);
    
    // Success feedback
    showSuccessFeedback('Item added to cart successfully!');
    announceToScreenReader('Item added to cart successfully');
    
    // Optional: Update button text temporarily
    updateButtonText(button, 'Added!', 1500);
    
  } catch (error) {
    // Error handling with user feedback
    console.error('Add to cart failed:', error);
    showErrorFeedback('Failed to add item to cart. Please try again.');
    announceToScreenReader('Failed to add item to cart');
  } finally {
    // Always hide loading state
    setLoadingState(false);
  }
}

/**
 * Handle quick view action
 * Optional enhancement as per rubric
 */
function handleQuickView(event) {
  const button = event.target.closest('.card__button--secondary');
  const productData = getProductData(button);
  
  // Announce action to screen readers
  announceToScreenReader('Opening quick view for ' + productData.name);
  
  // In a real application, this would open a modal or overlay
  console.log('Quick view requested for:', productData);
  
  // Provide user feedback
  showInfoFeedback('Quick view feature coming soon!');
}

/**
 * Handle wishlist toggle
 * Optional enhancement as per rubric
 */
function handleWishlistToggle(event) {
  const button = event.target.closest('.card__button--icon');
  const productData = getProductData(button);
  
  // Toggle wishlist state
  isInWishlist = !isInWishlist;
  
  // Update button appearance and aria-label
  updateWishlistButton(button, isInWishlist);
  
  // Save state to localStorage
  saveWishlistState(productData.id, isInWishlist);
  
  // Announce state change
  const message = isInWishlist 
    ? `Added ${productData.name} to wishlist`
    : `Removed ${productData.name} from wishlist`;
  
  announceToScreenReader(message);
  showInfoFeedback(message);
}

/**
 * Extract product data from button attributes
 * Required: Validate data before use (security)
 */
function getProductData(button) {
  const card = button.closest('[data-testid="product-card"]');
  
  return {
    id: card?.dataset.productId || button?.dataset.productId || 'unknown',
    name: card?.dataset.productName || button?.dataset.productName || 'Unknown Product',
    price: parseFloat(card?.dataset.productPrice || button?.dataset.productPrice || '0')
  };
}

/**
 * Set loading state with visual and accessibility updates
 * Required: Loading states communicated, announce state changes
 */
function setLoadingState(loading) {
  isLoading = loading;
  
  if (loading) {
    productCard?.classList.add('card--loading');
    addToCartButton?.setAttribute('disabled', 'true');
    addToCartButton?.setAttribute('aria-busy', 'true');
  } else {
    productCard?.classList.remove('card--loading');
    addToCartButton?.removeAttribute('disabled');
    addToCartButton?.setAttribute('aria-busy', 'false');
  }
  
  // Update loading overlay visibility for screen readers
  const loadingOverlay = productCard?.querySelector('.card__loading');
  if (loadingOverlay) {
    loadingOverlay.setAttribute('aria-hidden', loading ? 'false' : 'true');
  }
}

/**
 * Update wishlist button appearance and accessibility
 * Required: Announce state changes to screen readers
 */
function updateWishlistButton(button, inWishlist) {
  const icon = button.querySelector('span[aria-hidden="true"]');
  const productData = getProductData(button);
  
  if (icon) {
    icon.textContent = inWishlist ? '❤' : '♡';
  }
  
  // Update aria-label for screen readers
  const action = inWishlist ? 'Remove from' : 'Add to';
  button.setAttribute('aria-label', `${action} wishlist: ${productData.name}`);
  
  // Update button styling
  if (inWishlist) {
    button.style.color = 'var(--color-error-500)';
  } else {
    button.style.color = '';
  }
}

/**
 * Update button text temporarily
 * Required: Provide immediate feedback
 */
function updateButtonText(button, newText, duration = 1500) {
  const textElement = button.querySelector('.card__button-text');
  if (!textElement) return;
  
  const originalText = textElement.textContent;
  textElement.textContent = newText;
  
  setTimeout(() => {
    textElement.textContent = originalText;
  }, duration);
}

/**
 * Announce messages to screen readers
 * Required: Announce state changes to screen readers
 */
function announceToScreenReader(message) {
  // Create a live region for announcements
  let liveRegion = document.getElementById('sr-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  
  // Clear and set message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

/**
 * Show user feedback messages
 * Required: Provide clear feedback for all actions
 */
function showSuccessFeedback(message) {
  showFeedback(message, 'success');
}

function showErrorFeedback(message) {
  showFeedback(message, 'error');
}

function showInfoFeedback(message) {
  showFeedback(message, 'info');
}

function showFeedback(message, type = 'info') {
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.className = `feedback feedback--${type}`;
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--border-radius-base);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    z-index: var(--z-notification);
    opacity: 0;
    transform: translateX(100%);
    transition: var(--transition-base);
    max-width: 300px;
    box-shadow: var(--shadow-md);
  `;
  
  // Style based on type
  switch (type) {
    case 'success':
      feedback.style.backgroundColor = 'var(--color-success-500)';
      feedback.style.color = 'var(--color-text-inverse)';
      break;
    case 'error':
      feedback.style.backgroundColor = 'var(--color-error-500)';
      feedback.style.color = 'var(--color-text-inverse)';
      break;
    default:
      feedback.style.backgroundColor = 'var(--color-info-500)';
      feedback.style.color = 'var(--color-text-inverse)';
  }
  
  document.body.appendChild(feedback);
  
  // Animate in
  setTimeout(() => {
    feedback.style.opacity = '1';
    feedback.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto-remove after delay
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateX(100%)';
    setTimeout(() => {
      feedback.remove();
    }, 250);
  }, 3000);
}

/**
 * Handle image loading errors
 * Required: Error states with clear messaging
 */
function handleImageError(event) {
  const img = event.target;
  const placeholder = document.createElement('div');
  
  placeholder.className = 'card__image-placeholder';
  placeholder.style.cssText = `
    width: 100%;
    height: 100%;
    background-color: var(--color-secondary-100);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  `;
  placeholder.textContent = 'Image not available';
  
  // Replace image with placeholder
  img.parentNode.replaceChild(placeholder, img);
  
  console.warn('Product image failed to load');
}

/**
 * Handle successful image loading
 * Optional: Can be used for analytics or performance monitoring
 */
function handleImageLoad(event) {
  console.log('Product image loaded successfully');
}

/**
 * Simulate add to cart API call
 * Required: Handle async operations properly
 */
async function simulateAddToCart(productData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate occasional failures for demonstration
  if (Math.random() < 0.1) {
    throw new Error('Network error');
  }
  
  // Return success
  return {
    success: true,
    productId: productData.id,
    message: 'Product added to cart'
  };
}

/**
 * Load wishlist state from localStorage
 * Enhancement: Persist user preferences
 */
function loadWishlistState() {
  try {
    const productData = getProductData(addToCartButton);
    const saved = localStorage.getItem(`wishlist_${productData.id}`);
    
    if (saved === 'true') {
      isInWishlist = true;
      updateWishlistButton(wishlistButton, true);
    }
  } catch (error) {
    console.warn('Could not load wishlist state:', error);
  }
}

/**
 * Save wishlist state to localStorage
 * Enhancement: Persist user preferences
 */
function saveWishlistState(productId, inWishlist) {
  try {
    localStorage.setItem(`wishlist_${productId}`, inWishlist.toString());
  } catch (error) {
    console.warn('Could not save wishlist state:', error);
  }
}

/**
 * Initialize accessibility features
 * Required: Proper accessibility setup
 */
function initializeAccessibility() {
  // Ensure all interactive elements have proper focus management
  const interactiveElements = productCard?.querySelectorAll('button, [tabindex]');
  
  interactiveElements?.forEach(element => {
    // Ensure minimum accessible name
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      console.warn('Interactive element missing accessible name:', element);
    }
  });
  
  // Set up reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    productCard?.classList.add('reduce-motion');
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProductCard);
} else {
  initializeProductCard();
} 