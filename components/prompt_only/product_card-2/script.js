// Product Card JavaScript Module
// Implements accessibility, performance, and security best practices

(function() {
    'use strict'; // Enable strict mode for better error handling and security
    
    // Constants for configuration and selectors
    const SELECTORS = {
        addToCartBtn: '.add-to-cart-btn',
        wishlistBtn: '.wishlist-btn',
        notifications: '#notifications',
        productCard: '.product-card'
    };
    
    const MESSAGES = {
        addedToCart: 'Product added to cart successfully!',
        addedToWishlist: 'Product added to wishlist!',
        removedFromWishlist: 'Product removed from wishlist!',
        error: 'Something went wrong. Please try again.'
    };
    
    const ANIMATION_DURATION = 300;
    const NOTIFICATION_TIMEOUT = 5000;
    
    // State management for product interactions
    let isWishlisted = false;
    let isAddingToCart = false;
    
    // Initialize the product card functionality when DOM is ready
    function init() {
        // Wait for DOM to be fully loaded for performance
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupEventListeners);
        } else {
            setupEventListeners();
        }
    }
    
    // Set up all event listeners with proper error handling
    function setupEventListeners() {
        try {
            const addToCartBtn = document.querySelector(SELECTORS.addToCartBtn);
            const wishlistBtn = document.querySelector(SELECTORS.wishlistBtn);
            
            // Add to cart functionality with accessibility support
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', handleAddToCart);
                // Support keyboard interaction for accessibility
                addToCartBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAddToCart(e);
                    }
                });
            }
            
            // Wishlist functionality with toggle behavior
            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', handleWishlistToggle);
                // Support keyboard interaction for accessibility
                wishlistBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleWishlistToggle(e);
                    }
                });
            }
            
            // Add keyboard navigation support for the entire card
            const productCard = document.querySelector(SELECTORS.productCard);
            if (productCard) {
                // Make card focusable for screen readers
                productCard.setAttribute('tabindex', '0');
            }
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
            showNotification(MESSAGES.error, 'error');
        }
    }
    
    // Handle add to cart with loading state and accessibility announcements
    async function handleAddToCart(event) {
        const button = event.target;
        
        // Prevent multiple rapid clicks for performance and UX
        if (isAddingToCart) {
            return;
        }
        
        try {
            isAddingToCart = true;
            
            // Update button state for visual feedback
            setButtonLoading(button, true);
            
            // Simulate API call with proper error handling
            await simulateAddToCart();
            
            // Success feedback
            showNotification(MESSAGES.addedToCart, 'success');
            
            // Update button text temporarily for additional feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification(MESSAGES.error, 'error');
        } finally {
            setButtonLoading(button, false);
            isAddingToCart = false;
        }
    }
    
    // Handle wishlist toggle with proper state management
    function handleWishlistToggle(event) {
        const button = event.target;
        
        try {
            isWishlisted = !isWishlisted;
            
            // Update button appearance and accessibility attributes
            updateWishlistButton(button, isWishlisted);
            
            // Provide user feedback
            const message = isWishlisted ? MESSAGES.addedToWishlist : MESSAGES.removedFromWishlist;
            showNotification(message, 'success');
            
            // Save wishlist state to localStorage for persistence (with error handling)
            try {
                localStorage.setItem('product-wishlisted', JSON.stringify(isWishlisted));
            } catch (storageError) {
                console.warn('Could not save wishlist state:', storageError);
            }
            
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            showNotification(MESSAGES.error, 'error');
        }
    }
    
    // Update wishlist button state with accessibility considerations
    function updateWishlistButton(button, wishlisted) {
        if (wishlisted) {
            button.innerHTML = '♥ Wishlisted';
            button.setAttribute('aria-label', 'Remove from wishlist');
            button.style.color = '#dc2626'; // Red color for filled heart
        } else {
            button.innerHTML = '♡ Wishlist';
            button.setAttribute('aria-label', 'Add to wishlist');
            button.style.color = ''; // Reset to default color
        }
    }
    
    // Set button loading state with accessibility support
    function setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
        }
    }
    
    // Simulate API call for add to cart with realistic timing
    function simulateAddToCart() {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            const delay = Math.random() * 1000 + 500; // 500-1500ms
            
            setTimeout(() => {
                // Simulate 95% success rate for demo purposes
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, delay);
        });
    }
    
    // Show notifications with proper accessibility announcements
    function showNotification(message, type = 'success') {
        const notificationsContainer = document.querySelector(SELECTORS.notifications);
        
        if (!notificationsContainer) {
            console.warn('Notifications container not found');
            return;
        }
        
        // Create notification element with proper accessibility attributes
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        // Sanitize message content for security (prevent XSS)
        notification.textContent = message;
        
        // Add notification to container
        notificationsContainer.appendChild(notification);
        
        // Auto-remove notification after timeout
        setTimeout(() => {
            if (notification.parentNode) {
                // Smooth removal with animation
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, ANIMATION_DURATION);
            }
        }, NOTIFICATION_TIMEOUT);
    }
    
    // Load saved wishlist state from localStorage
    function loadWishlistState() {
        try {
            const saved = localStorage.getItem('product-wishlisted');
            if (saved !== null) {
                isWishlisted = JSON.parse(saved);
                
                // Update UI to reflect saved state
                const wishlistBtn = document.querySelector(SELECTORS.wishlistBtn);
                if (wishlistBtn) {
                    updateWishlistButton(wishlistBtn, isWishlisted);
                }
            }
        } catch (error) {
            console.warn('Could not load wishlist state:', error);
            // Continue with default state if localStorage fails
        }
    }
    
    // Performance optimization: Use requestAnimationFrame for smooth animations
    function animateCard() {
        const productCard = document.querySelector(SELECTORS.productCard);
        
        if (productCard && 'requestAnimationFrame' in window) {
            // Add subtle entrance animation
            productCard.style.opacity = '0';
            productCard.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                productCard.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                productCard.style.opacity = '1';
                productCard.style.transform = 'translateY(0)';
            });
        }
    }
    
    // Clean up function for memory management
    function cleanup() {
        // Remove event listeners if needed (in case of dynamic removal)
        const addToCartBtn = document.querySelector(SELECTORS.addToCartBtn);
        const wishlistBtn = document.querySelector(SELECTORS.wishlistBtn);
        
        if (addToCartBtn) {
            addToCartBtn.removeEventListener('click', handleAddToCart);
        }
        
        if (wishlistBtn) {
            wishlistBtn.removeEventListener('click', handleWishlistToggle);
        }
    }
    
    // Initialize the module
    init();
    
    // Load saved state after initialization
    document.addEventListener('DOMContentLoaded', () => {
        loadWishlistState();
        animateCard();
    });
    
    // Expose cleanup function for potential use
    window.ProductCard = {
        cleanup: cleanup
    };
    
    // Handle page visibility changes for performance optimization
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause any animations or timers if needed
            console.log('Product card: Page hidden, optimizing performance');
        } else {
            // Page is visible, resume normal operation
            console.log('Product card: Page visible, resuming normal operation');
        }
    });
    
})(); // IIFE to avoid global scope pollution and improve security 