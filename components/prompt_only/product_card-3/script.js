/**
 * Product Card Interactive Features
 * Implements accessibility, performance, and security best practices
 */

// Security: Use strict mode to prevent common JavaScript pitfalls
'use strict';

// Performance: Cache DOM elements to avoid repeated queries
const productCard = document.querySelector('.product-card');
const addToCartBtn = document.querySelector('.add-to-cart-btn');
const wishlistBtn = document.querySelector('.wishlist-btn');
const productImage = document.querySelector('.product-image');
const imageLoader = document.querySelector('.image-loading');

// Security: Input validation and sanitization utilities
const SecurityUtils = {
    /**
     * Sanitizes HTML to prevent XSS attacks
     * @param {string} input - The input string to sanitize
     * @returns {string} - Sanitized string
     */
    sanitizeHTML: function(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Validates product ID format to prevent injection attacks
     * @param {string} productId - The product ID to validate
     * @returns {boolean} - Whether the product ID is valid
     */
    validateProductId: function(productId) {
        // Only allow alphanumeric characters, hyphens, and underscores
        const validPattern = /^[a-zA-Z0-9\-_]+$/;
        return validPattern.test(productId) && productId.length <= 50;
    }
};

// Performance: Debounce utility to prevent excessive API calls
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Accessibility: Announce changes to screen readers
const announceToScreenReader = (message) => {
    // Create a live region for screen reader announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after a short delay to keep DOM clean
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

// Image loading and error handling with security considerations
const ImageManager = {
    /**
     * Handles image loading with performance and security considerations
     */
    init: function() {
        if (!productImage || !imageLoader) return;

        // Performance: Show loading indicator while image loads
        this.showLoadingIndicator();

        // Security: Validate image source before loading
        const imageSrc = productImage.src;
        if (!this.isValidImageSource(imageSrc)) {
            console.warn('Invalid image source detected');
            this.handleImageError();
            return;
        }

        // Add load and error event listeners
        productImage.addEventListener('load', this.handleImageLoad.bind(this));
        productImage.addEventListener('error', this.handleImageError.bind(this));
        
        // Performance: Use Intersection Observer for lazy loading optimization
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }
    },

    /**
     * Validates image source URL for security
     * @param {string} src - Image source URL
     * @returns {boolean} - Whether the source is valid
     */
    isValidImageSource: function(src) {
        try {
            const url = new URL(src);
            // Only allow HTTPS URLs or data URLs for security
            return url.protocol === 'https:' || url.protocol === 'data:';
        } catch (e) {
            return false;
        }
    },

    showLoadingIndicator: function() {
        if (imageLoader) {
            imageLoader.style.opacity = '1';
        }
    },

    hideLoadingIndicator: function() {
        if (imageLoader) {
            imageLoader.style.opacity = '0';
        }
    },

    handleImageLoad: function() {
        this.hideLoadingIndicator();
        // Accessibility: Update alt text dynamically if needed
        if (productImage && !productImage.alt) {
            productImage.alt = 'Product image loaded successfully';
        }
    },

    handleImageError: function() {
        this.hideLoadingIndicator();
        if (productImage) {
            // Accessibility: Provide meaningful alt text for failed images
            productImage.alt = 'Product image failed to load';
            // Performance: Replace with a lightweight placeholder
            productImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIHVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
        }
        announceToScreenReader('Product image failed to load');
    },

    setupLazyLoading: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Image is in viewport, start loading
                    entry.target.loading = 'eager';
                    observer.unobserve(entry.target);
                }
            });
        });

        if (productImage) {
            observer.observe(productImage);
        }
    }
};

// Add to Cart functionality with security and accessibility
const CartManager = {
    /**
     * Initializes cart functionality with proper event handling
     */
    init: function() {
        if (!addToCartBtn) return;

        // Add click event listener with proper error handling
        addToCartBtn.addEventListener('click', this.handleAddToCart.bind(this));
        
        // Accessibility: Add keyboard support
        addToCartBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleAddToCart();
            }
        });
    },

    /**
     * Handles add to cart action with validation and feedback
     */
    handleAddToCart: function() {
        // Security: Validate product ID before processing
        const productId = addToCartBtn.dataset.productId;
        if (!SecurityUtils.validateProductId(productId)) {
            console.error('Invalid product ID');
            announceToScreenReader('Error: Invalid product');
            return;
        }

        // UI: Show loading state
        this.setLoadingState(true);
        
        // Simulate API call with proper error handling
        this.addToCartAPI(productId)
            .then(result => {
                this.handleAddToCartSuccess(result);
            })
            .catch(error => {
                this.handleAddToCartError(error);
            })
            .finally(() => {
                this.setLoadingState(false);
            });
    },

    /**
     * Simulates API call to add product to cart
     * @param {string} productId - The product ID to add
     * @returns {Promise} - Promise that resolves with cart data
     */
    addToCartAPI: function(productId) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate 90% success rate for demo purposes
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        productId: productId,
                        message: 'Product added to cart successfully'
                    });
                } else {
                    reject(new Error('Network error: Unable to add product to cart'));
                }
            }, 1500);
        });
    },

    /**
     * Sets loading state for the add to cart button
     * @param {boolean} isLoading - Whether button should show loading state
     */
    setLoadingState: function(isLoading) {
        if (!addToCartBtn) return;

        if (isLoading) {
            addToCartBtn.classList.add('loading');
            addToCartBtn.disabled = true;
            // Accessibility: Update button text for screen readers
            addToCartBtn.setAttribute('aria-label', 'Adding product to cart, please wait');
        } else {
            addToCartBtn.classList.remove('loading');
            addToCartBtn.disabled = false;
            addToCartBtn.setAttribute('aria-label', 'Add to cart');
        }
    },

    handleAddToCartSuccess: function(result) {
        // Accessibility: Announce success to screen readers
        announceToScreenReader(result.message);
        
        // Visual feedback: Temporary success state
        if (addToCartBtn) {
            const originalText = addToCartBtn.querySelector('.btn-text').textContent;
            addToCartBtn.querySelector('.btn-text').textContent = 'Added!';
            addToCartBtn.classList.add('success');
            
            setTimeout(() => {
                addToCartBtn.querySelector('.btn-text').textContent = originalText;
                addToCartBtn.classList.remove('success');
            }, 2000);
        }
    },

    handleAddToCartError: function(error) {
        console.error('Add to cart failed:', error);
        announceToScreenReader('Failed to add product to cart. Please try again.');
        
        // Visual feedback: Show error state briefly
        if (addToCartBtn) {
            addToCartBtn.classList.add('error');
            setTimeout(() => {
                addToCartBtn.classList.remove('error');
            }, 3000);
        }
    }
};

// Wishlist functionality with persistence and accessibility
const WishlistManager = {
    /**
     * Initializes wishlist functionality
     */
    init: function() {
        if (!wishlistBtn) return;

        // Load saved wishlist state from localStorage
        this.loadWishlistState();

        // Add event listeners
        wishlistBtn.addEventListener('click', this.toggleWishlist.bind(this));
        
        // Accessibility: Keyboard support
        wishlistBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleWishlist();
            }
        });
    },

    /**
     * Toggles product in/out of wishlist
     */
    toggleWishlist: debounce(function() {
        const productId = wishlistBtn.dataset.productId;
        
        // Security: Validate product ID
        if (!SecurityUtils.validateProductId(productId)) {
            console.error('Invalid product ID for wishlist');
            return;
        }

        const isCurrentlyInWishlist = wishlistBtn.classList.contains('active');
        const newState = !isCurrentlyInWishlist;
        
        // Update UI immediately for better UX
        this.updateWishlistUI(newState);
        
        // Save to localStorage with error handling
        try {
            this.saveWishlistState(productId, newState);
            
            // Accessibility: Announce change to screen readers
            const message = newState ? 
                'Product added to wishlist' : 
                'Product removed from wishlist';
            announceToScreenReader(message);
            
        } catch (error) {
            console.error('Failed to save wishlist state:', error);
            // Revert UI change if save failed
            this.updateWishlistUI(isCurrentlyInWishlist);
            announceToScreenReader('Failed to update wishlist');
        }
    }, 300),

    /**
     * Updates wishlist button UI
     * @param {boolean} isInWishlist - Whether product is in wishlist
     */
    updateWishlistUI: function(isInWishlist) {
        if (!wishlistBtn) return;

        if (isInWishlist) {
            wishlistBtn.classList.add('active');
            wishlistBtn.setAttribute('aria-label', 'Remove from wishlist');
            wishlistBtn.querySelector('.heart-icon').textContent = '♥';
        } else {
            wishlistBtn.classList.remove('active');
            wishlistBtn.setAttribute('aria-label', 'Add to wishlist');
            wishlistBtn.querySelector('.heart-icon').textContent = '♡';
        }
    },

    /**
     * Loads wishlist state from localStorage
     */
    loadWishlistState: function() {
        try {
            const productId = wishlistBtn.dataset.productId;
            if (!SecurityUtils.validateProductId(productId)) return;

            const wishlistData = localStorage.getItem('productWishlist');
            if (wishlistData) {
                const wishlist = JSON.parse(wishlistData);
                const isInWishlist = wishlist.includes(productId);
                this.updateWishlistUI(isInWishlist);
            }
        } catch (error) {
            console.error('Failed to load wishlist state:', error);
        }
    },

    /**
     * Saves wishlist state to localStorage
     * @param {string} productId - Product ID to save
     * @param {boolean} isInWishlist - Whether product is in wishlist
     */
    saveWishlistState: function(productId, isInWishlist) {
        let wishlist = [];
        
        try {
            const existing = localStorage.getItem('productWishlist');
            if (existing) {
                wishlist = JSON.parse(existing);
            }
        } catch (error) {
            console.error('Failed to parse existing wishlist:', error);
            wishlist = [];
        }

        if (isInWishlist) {
            if (!wishlist.includes(productId)) {
                wishlist.push(productId);
            }
        } else {
            wishlist = wishlist.filter(id => id !== productId);
        }

        localStorage.setItem('productWishlist', JSON.stringify(wishlist));
    }
};

// Performance: Initialize only when DOM is ready
const initializeProductCard = () => {
    // Check if required elements exist before initializing
    if (!productCard) {
        console.warn('Product card element not found');
        return;
    }

    // Initialize all managers
    ImageManager.init();
    CartManager.init();
    WishlistManager.init();

    // Accessibility: Set up focus management
    setupFocusManagement();
    
    console.log('Product card initialized successfully');
};

// Accessibility: Focus management for keyboard navigation
const setupFocusManagement = () => {
    // Ensure the product card is focusable for keyboard users
    if (productCard && !productCard.hasAttribute('tabindex')) {
        productCard.setAttribute('tabindex', '0');
    }

    // Add focus styles when navigating with keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Remove focus styles when using mouse
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
};

// Performance: Use different initialization strategies based on browser capabilities
if (document.readyState === 'loading') {
    // Document is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeProductCard);
} else {
    // Document is already loaded, initialize immediately
    initializeProductCard();
}

// Security: Add global error handler to prevent information leakage
window.addEventListener('error', (e) => {
    // Log errors for debugging but don't expose sensitive information
    console.error('Application error occurred');
    // In production, you would send this to your error tracking service
});

// Performance: Clean up resources when page unloads
window.addEventListener('beforeunload', () => {
    // Clean up any ongoing operations or timers if necessary
    // This helps prevent memory leaks in single-page applications
});

// Export for potential module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SecurityUtils,
        ImageManager,
        CartManager,
        WishlistManager
    };
} 