// Product Card JavaScript - Following .rubric specifications
// Implements accessibility, security, and performance requirements

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize product card functionality
    initializeProductCard();
});

/**
 * Initialize product card interactions and accessibility features
 */
function initializeProductCard() {
    const productCard = document.querySelector('[data-testid="product-card"]');
    const addToCartButton = document.querySelector('[data-testid="add-to-cart-button"]');
    const wishlistButton = document.querySelector('[data-testid="wishlist-button"]');
    
    if (!productCard) {
        console.warn('Product card not found');
        return;
    }
    
    // Initialize button interactions
    initializeAddToCartButton(addToCartButton);
    initializeWishlistButton(wishlistButton);
    
    // Add keyboard navigation support for card
    initializeKeyboardNavigation(productCard);
    
    // Add loading state management
    initializeLoadingStates();
    
    console.log('Product card initialized successfully');
}

/**
 * Initialize add to cart button functionality
 * @param {HTMLElement} button - The add to cart button element
 */
function initializeAddToCartButton(button) {
    if (!button) return;
    
    // Add click handler with loading state and error handling
    button.addEventListener('click', async function(event) {
        event.preventDefault();
        
        // Prevent multiple clicks during loading
        if (button.classList.contains('card__button--loading')) {
            return;
        }
        
        try {
            // Set loading state
            setButtonLoadingState(button, true);
            
            // Simulate API call to add item to cart
            await simulateAddToCart();
            
            // Success feedback
            showSuccessMessage('Item added to cart successfully!');
            
            // Update button text temporarily to show success
            const originalText = button.textContent;
            button.textContent = 'Added!';
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
            
        } catch (error) {
            // Error handling with user feedback
            console.error('Failed to add item to cart:', error);
            showErrorMessage('Failed to add item to cart. Please try again.');
        } finally {
            // Always remove loading state
            setButtonLoadingState(button, false);
        }
    });
    
    // Add keyboard support (Enter and Space keys)
    button.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            button.click();
        }
    });
}

/**
 * Initialize wishlist button functionality
 * @param {HTMLElement} button - The wishlist button element
 */
function initializeWishlistButton(button) {
    if (!button) return;
    
    let isWishlisted = false;
    
    // Add click handler for wishlist toggle
    button.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Toggle wishlist state
        isWishlisted = !isWishlisted;
        
        // Update button appearance and aria-label
        if (isWishlisted) {
            button.textContent = '♥'; // Filled heart
            button.setAttribute('aria-label', 'Remove from wishlist');
            button.style.color = 'var(--color-error-500)';
            showSuccessMessage('Added to wishlist!');
        } else {
            button.textContent = '♡'; // Empty heart
            button.setAttribute('aria-label', 'Add to wishlist');
            button.style.color = 'var(--color-text-secondary)';
            showSuccessMessage('Removed from wishlist!');
        }
        
        // Announce state change to screen readers
        announceToScreenReader(isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    });
}

/**
 * Initialize keyboard navigation for the product card
 * @param {HTMLElement} card - The product card element
 */
function initializeKeyboardNavigation(card) {
    // Make card focusable for keyboard navigation
    card.setAttribute('tabindex', '0');
    
    // Add keyboard event listener for card-level interactions
    card.addEventListener('keydown', function(event) {
        // Allow Enter key to focus on primary action button
        if (event.key === 'Enter') {
            const primaryButton = card.querySelector('.card__button--primary');
            if (primaryButton) {
                primaryButton.focus();
            }
        }
    });
}

/**
 * Initialize loading states for async operations
 */
function initializeLoadingStates() {
    // Add loading state management for buttons
    const buttons = document.querySelectorAll('.card__button');
    
    buttons.forEach(button => {
        // Ensure buttons are properly marked as buttons for screen readers
        if (!button.getAttribute('role')) {
            button.setAttribute('role', 'button');
        }
    });
}

/**
 * Set loading state for a button
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Whether button should be in loading state
 */
function setButtonLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('card__button--loading');
        button.setAttribute('aria-busy', 'true');
        button.disabled = true;
        
        // Announce loading state to screen readers
        announceToScreenReader('Loading...');
    } else {
        button.classList.remove('card__button--loading');
        button.setAttribute('aria-busy', 'false');
        button.disabled = false;
    }
}

/**
 * Simulate adding item to cart with async operation
 * @returns {Promise} - Promise that resolves after simulated API call
 */
function simulateAddToCart() {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate occasional failure for demonstration
            if (Math.random() > 0.9) {
                reject(new Error('Network error'));
            } else {
                resolve();
            }
        }, 1500);
    });
}

/**
 * Show success message to user
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    // Create or update success message element
    let messageElement = document.getElementById('success-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'success-message';
        messageElement.setAttribute('role', 'status');
        messageElement.setAttribute('aria-live', 'polite');
        messageElement.style.cssText = `
            position: fixed;
            top: var(--space-lg);
            right: var(--space-lg);
            background-color: var(--color-success-500);
            color: var(--color-text-inverse);
            padding: var(--space-sm) var(--space-lg);
            border-radius: var(--border-radius-md);
            font-size: var(--font-size-sm);
            z-index: var(--z-notification);
            opacity: 0;
            transform: translateY(-20px);
            transition: var(--transition-base);
        `;
        document.body.appendChild(messageElement);
    }
    
    // Update message content using textContent for security
    messageElement.textContent = message;
    
    // Show message with animation
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-20px)';
    }, 3000);
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Create or update error message element
    let messageElement = document.getElementById('error-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'error-message';
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');
        messageElement.style.cssText = `
            position: fixed;
            top: var(--space-lg);
            right: var(--space-lg);
            background-color: var(--color-error-500);
            color: var(--color-text-inverse);
            padding: var(--space-sm) var(--space-lg);
            border-radius: var(--border-radius-md);
            font-size: var(--font-size-sm);
            z-index: var(--z-notification);
            opacity: 0;
            transform: translateY(-20px);
            transition: var(--transition-base);
        `;
        document.body.appendChild(messageElement);
    }
    
    // Update message content using textContent for security
    messageElement.textContent = message;
    
    // Show message with animation
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide message after 5 seconds (longer for errors)
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-20px)';
    }, 5000);
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    // Create temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    // Use textContent for security
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove element after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Debounce function to limit rapid fire events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
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

// Error handling for unhandled promises
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorMessage('An unexpected error occurred. Please try again.');
});

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeProductCard,
        setButtonLoadingState,
        showSuccessMessage,
        showErrorMessage,
        announceToScreenReader,
        debounce
    };
}