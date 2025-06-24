/**
 * Product Card Interactive Functionality
 * Implements secure, accessible, and performant JavaScript for product interactions
 */

// Security: Use strict mode to prevent common JavaScript pitfalls
'use strict';

// Performance: Use DOMContentLoaded for faster initial execution
document.addEventListener('DOMContentLoaded', function() {
    initializeProductCard();
});

/**
 * Initialize product card functionality
 * Sets up event listeners and handles user interactions securely
 */
function initializeProductCard() {
    // Security: Get elements safely with null checks
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const cartStatus = document.getElementById('cart-status');
    
    // Security: Validate elements exist before adding listeners
    if (!addToCartBtn || !wishlistBtn || !cartStatus) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Add event listeners with proper error handling
    addToCartBtn.addEventListener('click', handleAddToCart);
    wishlistBtn.addEventListener('click', handleWishlistToggle);
    
    // Performance: Use passive listeners for better scroll performance
    document.addEventListener('scroll', debounce(handleScroll, 100), { passive: true });
    
    // Accessibility: Add keyboard navigation support
    addKeyboardSupport();
    
    // Security: Initialize with safe default state
    resetButtonStates();
}

/**
 * Handle add to cart functionality with security and UX best practices
 * @param {Event} event - Click event object
 */
async function handleAddToCart(event) {
    // Security: Prevent default behavior and event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const cartStatus = document.getElementById('cart-status');
    
    // Security: Validate button and required elements
    if (!button || !cartStatus) {
        console.error('Required elements not available');
        return;
    }
    
    // Security: Get product ID safely with validation
    const productId = sanitizeInput(button.dataset.productId);
    if (!productId) {
        console.error('Invalid product ID');
        announceToScreenReader(cartStatus, 'Error: Invalid product information');
        return;
    }
    
    // UX: Prevent double-clicks during processing
    if (button.disabled || button.classList.contains('loading')) {
        return;
    }
    
    try {
        // UX: Show loading state
        setButtonLoading(button, true);
        
        // Accessibility: Announce action to screen readers
        announceToScreenReader(cartStatus, 'Adding item to cart...');
        
        // Simulate API call with proper error handling
        const result = await simulateAddToCart(productId);
        
        if (result.success) {
            // Success state
            announceToScreenReader(cartStatus, 'Item successfully added to cart');
            showTemporarySuccess(button);
            
            // Performance: Update cart count if element exists
            updateCartCount(result.cartCount);
            
        } else {
            throw new Error(result.message || 'Failed to add item to cart');
        }
        
    } catch (error) {
        // Error handling with user feedback
        console.error('Add to cart failed:', error);
        announceToScreenReader(cartStatus, 'Error: Could not add item to cart. Please try again.');
        showTemporaryError(button);
        
    } finally {
        // UX: Always reset loading state
        setButtonLoading(button, false);
    }
}

/**
 * Handle wishlist toggle functionality
 * @param {Event} event - Click event object
 */
async function handleWishlistToggle(event) {
    // Security: Prevent default behavior
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const icon = button.querySelector('.btn-icon');
    
    // Security: Validate elements exist
    if (!button || !icon) {
        console.error('Wishlist button elements not found');
        return;
    }
    
    // Security: Get and validate product ID
    const productId = sanitizeInput(button.dataset.productId);
    if (!productId) {
        console.error('Invalid product ID for wishlist');
        return;
    }
    
    // UX: Prevent rapid clicking
    if (button.disabled) {
        return;
    }
    
    try {
        // UX: Disable button during processing
        button.disabled = true;
        
        // Simulate wishlist API call
        const isWishlisted = icon.textContent === '♥';
        const result = await simulateWishlistToggle(productId, !isWishlisted);
        
        if (result.success) {
            // Update UI based on wishlist state
            icon.textContent = result.isWishlisted ? '♥' : '♡';
            button.setAttribute('aria-label', 
                result.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            );
            
            // Accessibility: Announce state change
            const status = result.isWishlisted ? 'added to' : 'removed from';
            const statusElement = document.getElementById('cart-status');
            if (statusElement) {
                announceToScreenReader(statusElement, `Item ${status} wishlist`);
            }
            
        } else {
            throw new Error(result.message || 'Wishlist operation failed');
        }
        
    } catch (error) {
        console.error('Wishlist toggle failed:', error);
        // Show user-friendly error message
        showTemporaryMessage('Could not update wishlist. Please try again.');
        
    } finally {
        // Always re-enable button
        button.disabled = false;
    }
}

/**
 * Add keyboard navigation support for accessibility
 */
function addKeyboardSupport() {
    // Support Enter and Space keys for button activation
    document.addEventListener('keydown', function(event) {
        const target = event.target;
        
        // Only handle keyboard events for buttons
        if (!target.classList.contains('btn')) {
            return;
        }
        
        // Handle Enter and Space keys
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            target.click();
        }
    });
}

/**
 * Handle scroll events for performance optimization
 */
function handleScroll() {
    // Performance: Implement lazy loading or other scroll-based optimizations
    const productImage = document.querySelector('.product-image');
    if (productImage && !productImage.dataset.loaded) {
        // Check if image is in viewport
        const rect = productImage.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            productImage.dataset.loaded = 'true';
        }
    }
}

/**
 * Simulate add to cart API call with realistic delay and error handling
 * @param {string} productId - Product identifier
 * @returns {Promise<Object>} API response simulation
 */
async function simulateAddToCart(productId) {
    // Simulate network delay
    await delay(1500);
    
    // Security: Validate input
    if (!productId || typeof productId !== 'string') {
        throw new Error('Invalid product ID');
    }
    
    // Simulate occasional network errors for realistic UX
    if (Math.random() < 0.1) { // 10% chance of error
        throw new Error('Network error occurred');
    }
    
    // Simulate successful response
    return {
        success: true,
        message: 'Item added to cart',
        cartCount: Math.floor(Math.random() * 5) + 1
    };
}

/**
 * Simulate wishlist toggle API call
 * @param {string} productId - Product identifier
 * @param {boolean} addToWishlist - Whether to add or remove from wishlist
 * @returns {Promise<Object>} API response simulation
 */
async function simulateWishlistToggle(productId, addToWishlist) {
    // Simulate network delay
    await delay(800);
    
    // Security: Validate inputs
    if (!productId || typeof productId !== 'string' || typeof addToWishlist !== 'boolean') {
        throw new Error('Invalid parameters');
    }
    
    return {
        success: true,
        isWishlisted: addToWishlist,
        message: addToWishlist ? 'Added to wishlist' : 'Removed from wishlist'
    };
}

/* Utility Functions */

/**
 * Set button loading state with accessibility support
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.removeAttribute('aria-busy');
    }
}

/**
 * Show temporary success state on button
 * @param {HTMLElement} button - Button element
 */
function showTemporarySuccess(button) {
    if (!button) return;
    
    const originalText = button.querySelector('.btn-text').textContent;
    button.querySelector('.btn-text').textContent = 'Added!';
    button.classList.add('success');
    
    setTimeout(() => {
        button.querySelector('.btn-text').textContent = originalText;
        button.classList.remove('success');
    }, 2000);
}

/**
 * Show temporary error state on button
 * @param {HTMLElement} button - Button element
 */
function showTemporaryError(button) {
    if (!button) return;
    
    button.classList.add('error');
    setTimeout(() => {
        button.classList.remove('error');
    }, 3000);
}

/**
 * Update cart count display if element exists
 * @param {number} count - New cart count
 */
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement && typeof count === 'number') {
        cartCountElement.textContent = count;
        cartCountElement.setAttribute('aria-label', `${count} items in cart`);
    }
}

/**
 * Announce message to screen readers
 * @param {HTMLElement} element - Element for announcements
 * @param {string} message - Message to announce
 */
function announceToScreenReader(element, message) {
    if (!element || !message) return;
    
    // Security: Sanitize message before displaying
    const sanitizedMessage = sanitizeInput(message);
    element.textContent = sanitizedMessage;
    
    // Clear message after announcement
    setTimeout(() => {
        element.textContent = '';
    }, 3000);
}

/**
 * Show temporary message to user
 * @param {string} message - Message to display
 */
function showTemporaryMessage(message) {
    // Security: Sanitize message
    const sanitizedMessage = sanitizeInput(message);
    
    // Create temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = 'temp-message';
    messageEl.textContent = sanitizedMessage;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(messageEl);
    
    // Remove message after delay
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 4000);
}

/**
 * Reset all button states to default
 */
function resetButtonStates() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('loading', 'success', 'error');
        button.removeAttribute('aria-busy');
    });
}

/**
 * Security: Sanitize user input to prevent XSS attacks
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // Security: Remove potentially dangerous characters
    return input
        .replace(/[<>&"']/g, function(match) {
            const escapeChars = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#x27;'
            };
            return escapeChars[match];
        })
        .trim()
        .substring(0, 100); // Limit length for security
}

/**
 * Performance: Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
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
 * Utility: Create promise-based delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Security: Handle errors globally to prevent crashes
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    // Could send error reports to monitoring service in production
});

// Performance: Clean up event listeners when page is unloaded
window.addEventListener('beforeunload', function() {
    // Clean up any remaining timeouts or intervals
    // This helps prevent memory leaks
});

// Security: Prevent common attacks
window.addEventListener('beforeprint', function() {
    // Could implement print security measures if needed
});

// Accessibility: Announce page load completion to screen readers
window.addEventListener('load', function() {
    const statusElement = document.getElementById('cart-status');
    if (statusElement) {
        setTimeout(() => {
            announceToScreenReader(statusElement, 'Product page loaded and ready for interaction');
        }, 500);
    }
}); 