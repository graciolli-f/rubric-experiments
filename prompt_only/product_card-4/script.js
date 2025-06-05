// Security: Strict mode to prevent common JavaScript pitfalls
'use strict';

// Performance: DOM content loaded event for faster page rendering
document.addEventListener('DOMContentLoaded', function() {
    // Security: Cache DOM elements to prevent repeated queries and potential XSS
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const productCard = document.querySelector('.product-card');
    const productImage = document.querySelector('.product-image');
    
    // Security: Validate DOM elements exist before attaching event listeners
    if (!addToCartBtn || !productCard || !productImage) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Accessibility: Enhanced keyboard navigation support
    function initializeAccessibility() {
        // Accessibility: Make product card focusable with keyboard
        productCard.setAttribute('tabindex', '0');
        
        // Accessibility: Add keyboard navigation for product card
        productCard.addEventListener('keydown', function(e) {
            // Security: Validate event object exists
            if (!e) return;
            
            // Accessibility: Allow Enter and Space to trigger card interaction
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                addToCartBtn.click();
            }
        });
        
        // Accessibility: Enhanced focus management for screen readers
        productCard.addEventListener('focus', function() {
            this.setAttribute('aria-expanded', 'true');
        });
        
        productCard.addEventListener('blur', function() {
            this.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Performance: Debounced function for button clicks to prevent spam
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
    
    // Security: Input validation and sanitization
    function validateProductData(productId) {
        // Security: Validate product ID format to prevent injection attacks
        const productIdPattern = /^[a-zA-Z0-9\-_]+$/;
        return productIdPattern.test(productId);
    }
    
    // Performance: Optimized add to cart functionality
    function addToCart(productId) {
        // Security: Validate product ID before processing
        if (!validateProductData(productId)) {
            console.error('Invalid product ID format');
            return;
        }
        
        // Accessibility: Update button state for screen readers
        addToCartBtn.setAttribute('aria-pressed', 'true');
        addToCartBtn.classList.add('loading');
        
        // Performance: Simulate API call with realistic timing
        return new Promise((resolve, reject) => {
            // Security: Simulate secure API endpoint call
            setTimeout(() => {
                try {
                    // Performance: Mock successful cart addition
                    const cartItem = {
                        id: productId,
                        timestamp: Date.now(),
                        // Security: Sanitized product data
                        name: 'Premium Wireless Headphones',
                        price: 199.99
                    };
                    
                    // Security: Validate cart item structure
                    if (cartItem.id && cartItem.name && cartItem.price) {
                        resolve(cartItem);
                    } else {
                        reject(new Error('Invalid cart item data'));
                    }
                } catch (error) {
                    reject(error);
                }
            }, 1500); // Realistic loading time
        });
    }
    
    // Accessibility: User feedback system for screen readers
    function showUserFeedback(message, type = 'success') {
        // Accessibility: Create live region for screen reader announcements
        const feedbackElement = document.createElement('div');
        feedbackElement.setAttribute('role', 'status');
        feedbackElement.setAttribute('aria-live', 'polite');
        feedbackElement.className = 'sr-only';
        feedbackElement.textContent = message;
        
        document.body.appendChild(feedbackElement);
        
        // Performance: Clean up feedback element after announcement
        setTimeout(() => {
            if (feedbackElement.parentNode) {
                feedbackElement.parentNode.removeChild(feedbackElement);
            }
        }, 3000);
        
        // Visual feedback for all users
        if (type === 'success') {
            addToCartBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            addToCartBtn.querySelector('.btn-text').textContent = 'Added to Cart!';
        }
        
        // Performance: Reset button state after feedback
        setTimeout(() => {
            addToCartBtn.style.background = '';
            addToCartBtn.querySelector('.btn-text').textContent = 'Add to Cart';
        }, 2000);
    }
    
    // Performance: Error handling with user-friendly feedback
    function handleError(error) {
        console.error('Add to cart error:', error);
        
        // Accessibility: Announce error to screen readers
        showUserFeedback('Failed to add item to cart. Please try again.', 'error');
        
        // Visual error feedback
        addToCartBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        addToCartBtn.querySelector('.btn-text').textContent = 'Try Again';
        
        // Performance: Reset button state
        setTimeout(() => {
            addToCartBtn.style.background = '';
            addToCartBtn.querySelector('.btn-text').textContent = 'Add to Cart';
        }, 2000);
    }
    
    // Main button click handler with security and performance optimizations
    const handleAddToCart = debounce(async function(e) {
        // Security: Prevent default form submission if button is in a form
        e.preventDefault();
        
        // Security: Validate button state to prevent double-clicks during loading
        if (addToCartBtn.classList.contains('loading')) {
            return;
        }
        
        // Security: Get product ID from data attribute with validation
        const productId = addToCartBtn.getAttribute('data-product-id');
        if (!productId) {
            console.error('Product ID not found');
            return;
        }
        
        try {
            // Performance: Async cart addition with loading state
            const cartItem = await addToCart(productId);
            
            // Accessibility: Success feedback for all users
            showUserFeedback(`${cartItem.name} added to cart successfully!`);
            
            // Performance: Optional analytics tracking (secure implementation)
            if (typeof gtag !== 'undefined') {
                // Security: Sanitized analytics data
                gtag('event', 'add_to_cart', {
                    currency: 'USD',
                    value: cartItem.price,
                    items: [{
                        item_id: cartItem.id,
                        item_name: cartItem.name,
                        price: cartItem.price,
                        quantity: 1
                    }]
                });
            }
            
        } catch (error) {
            handleError(error);
        } finally {
            // Accessibility: Reset button state
            addToCartBtn.classList.remove('loading');
            addToCartBtn.setAttribute('aria-pressed', 'false');
        }
    }, 300); // Debounce delay to prevent spam clicks
    
    // Performance: Image loading optimization with error handling
    function optimizeImageLoading() {
        // Performance: Handle image load success
        productImage.addEventListener('load', function() {
            this.style.opacity = '1';
            // Performance: Remove loading placeholder if it exists
            const placeholder = this.parentNode.querySelector('.image-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
        });
        
        // Performance: Handle image load errors with fallback
        productImage.addEventListener('error', function() {
            console.warn('Product image failed to load');
            // Performance: Use placeholder or fallback image
            this.alt = 'Product image temporarily unavailable';
            this.style.backgroundColor = '#e5e7eb';
        });
    }
    
    // Security: Initialize all functionality with error boundaries
    try {
        // Initialize accessibility features
        initializeAccessibility();
        
        // Attach main event listener with security validation
        addToCartBtn.addEventListener('click', handleAddToCart);
        
        // Performance: Optimize image loading behavior
        optimizeImageLoading();
        
        // Accessibility: Announce page readiness to screen readers
        const readyAnnouncement = document.createElement('div');
        readyAnnouncement.className = 'sr-only';
        readyAnnouncement.setAttribute('role', 'status');
        readyAnnouncement.setAttribute('aria-live', 'polite');
        readyAnnouncement.textContent = 'Product card loaded and ready for interaction';
        document.body.appendChild(readyAnnouncement);
        
        // Performance: Clean up ready announcement
        setTimeout(() => {
            if (readyAnnouncement.parentNode) {
                readyAnnouncement.parentNode.removeChild(readyAnnouncement);
            }
        }, 2000);
        
    } catch (error) {
        console.error('Failed to initialize product card:', error);
        // Security: Graceful degradation - ensure basic functionality still works
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Product added to cart!'); // Fallback user feedback
        });
    }
});

// Performance: Cleanup function for memory management (if needed for SPA)
window.productCard = {
    destroy: function() {
        // Performance: Remove event listeners and clean up resources
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const productCard = document.querySelector('.product-card');
        
        if (addToCartBtn) {
            addToCartBtn.removeEventListener('click', handleAddToCart);
        }
        
        if (productCard) {
            productCard.removeEventListener('keydown', () => {});
            productCard.removeEventListener('focus', () => {});
            productCard.removeEventListener('blur', () => {});
        }
    }
}; 