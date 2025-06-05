// Product Card JavaScript - Following RUX compliance for security and accessibility
// RUX COMPLIANCE: No inline event handlers, proper event handling, accessibility support

(function() {
    'use strict';
    
    // RUX COMPLIANCE: Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initProductCard);
    
    function initProductCard() {
        // RUX COMPLIANCE: Use data-testid for element selection
        const card = document.querySelector('[data-testid="product-card"]');
        const addToCartBtn = document.querySelector('[data-testid="add-to-cart-btn"]');
        const quickViewBtn = document.querySelector('[data-testid="quick-view-btn"]');
        const wishlistBtn = document.querySelector('[data-testid="wishlist-btn"]');
        
        if (!card) {
            console.warn('Product card not found');
            return;
        }
        
        // Initialize button handlers
        if (addToCartBtn) {
            initAddToCartButton(addToCartBtn);
        }
        
        if (quickViewBtn) {
            initQuickViewButton(quickViewBtn);
        }
        
        if (wishlistBtn) {
            initWishlistButton(wishlistBtn);
        }
        
        // RUX COMPLIANCE: Keyboard navigation support
        initKeyboardNavigation(card);
        
        // RUX CREATIVE: Add entrance animation trigger
        triggerEntranceAnimation(card);
        
        console.log('Product card initialized successfully');
    }
    
    // RUX REQUIRED: Add to cart functionality with loading state
    function initAddToCartButton(button) {
        // RUX COMPLIANCE: Prevent multiple rapid clicks
        let isProcessing = false;
        
        button.addEventListener('click', async function(event) {
            event.preventDefault();
            
            if (isProcessing) {
                return; // RUX COMPLIANCE: Debounce rapid fire events
            }
            
            isProcessing = true;
            
            try {
                // RUX COMPLIANCE: Show loading state
                setButtonLoadingState(button, true);
                
                // RUX COMPLIANCE: Announce state change to screen readers
                announceToScreenReader('Adding item to cart...');
                
                // Simulate API call - replace with actual implementation
                await simulateAddToCart();
                
                // RUX COMPLIANCE: Success feedback
                showSuccessMessage('Item successfully added to cart!');
                announceToScreenReader('Item successfully added to cart');
                
                // RUX CREATIVE: Success animation
                animateSuccessState(button);
                
            } catch (error) {
                // RUX COMPLIANCE: Error state with clear messaging
                console.error('Failed to add item to cart:', error);
                showErrorMessage('Failed to add item to cart. Please try again.');
                announceToScreenReader('Failed to add item to cart. Please try again.');
                
            } finally {
                // RUX COMPLIANCE: Reset loading state
                setTimeout(() => {
                    setButtonLoadingState(button, false);
                    isProcessing = false;
                }, 1000);
            }
        });
        
        // RUX COMPLIANCE: Keyboard support (Enter and Space)
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                button.click();
            }
        });
    }
    
    // RUX OPTIONAL: Quick view functionality
    function initQuickViewButton(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // RUX COMPLIANCE: Announce action to screen readers
            announceToScreenReader('Opening quick view...');
            
            // Simulate quick view modal - replace with actual implementation
            showQuickViewModal();
        });
    }
    
    // RUX OPTIONAL: Wishlist toggle functionality
    function initWishlistButton(button) {
        // RUX COMPLIANCE: Get initial state from aria-pressed
        let isInWishlist = button.getAttribute('aria-pressed') === 'true';
        
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Toggle wishlist state
            isInWishlist = !isInWishlist;
            
            // RUX COMPLIANCE: Update aria-pressed for screen readers
            button.setAttribute('aria-pressed', isInWishlist.toString());
            
            // Update aria-label for context
            const action = isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';
            button.setAttribute('aria-label', action);
            
            // RUX COMPLIANCE: Announce state change
            const message = isInWishlist ? 'Added to wishlist' : 'Removed from wishlist';
            announceToScreenReader(message);
            
            // RUX CREATIVE: Animate wishlist toggle
            animateWishlistToggle(button, isInWishlist);
        });
    }
    
    // RUX COMPLIANCE: Keyboard navigation support
    function initKeyboardNavigation(card) {
        // Enable card to receive focus for keyboard users
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // RUX COMPLIANCE: Arrow key navigation between buttons
        const buttons = card.querySelectorAll('button');
        
        buttons.forEach((button, index) => {
            button.addEventListener('keydown', function(event) {
                let targetIndex;
                
                switch(event.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        event.preventDefault();
                        targetIndex = (index + 1) % buttons.length;
                        buttons[targetIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        event.preventDefault();
                        targetIndex = (index - 1 + buttons.length) % buttons.length;
                        buttons[targetIndex].focus();
                        break;
                }
            });
        });
    }
    
    // RUX CREATIVE: Trigger entrance animation
    function triggerEntranceAnimation(card) {
        // Add entrance animation class after a brief delay
        setTimeout(() => {
            card.classList.add('card--animated');
        }, 100);
    }
    
    // Helper function: Set button loading state
    function setButtonLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn--loading');
            button.setAttribute('aria-busy', 'true');
            button.disabled = true;
        } else {
            button.classList.remove('btn--loading');
            button.setAttribute('aria-busy', 'false');
            button.disabled = false;
        }
    }
    
    // Helper function: Announce to screen readers
    function announceToScreenReader(message) {
        // RUX COMPLIANCE: Create live region for screen reader announcements
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
        
        // RUX COMPLIANCE: Clear and set message for screen readers
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
    
    // Helper function: Show success message
    function showSuccessMessage(message) {
        // RUX ENHANCEMENT: Show temporary success notification
        showNotification(message, 'success');
    }
    
    // Helper function: Show error message  
    function showErrorMessage(message) {
        // RUX COMPLIANCE: Show error state with clear messaging
        showNotification(message, 'error');
    }
    
    // Helper function: Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '400px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // RUX CREATIVE: Success animation
    function animateSuccessState(button) {
        button.style.transform = 'scale(1.05)';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.backgroundColor = '';
        }, 200);
    }
    
    // RUX CREATIVE: Wishlist toggle animation
    function animateWishlistToggle(button, isActive) {
        button.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    // Mock function: Simulate add to cart API call
    async function simulateAddToCart() {
        // RUX COMPLIANCE: Simulate realistic API delay with error handling
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 10% chance of failure for demonstration
                if (Math.random() < 0.1) {
                    reject(new Error('Network error'));
                } else {
                    resolve({ success: true, message: 'Item added to cart' });
                }
            }, 2000); // 2 second delay to show loading state
        });
    }
    
    // Mock function: Show quick view modal
    function showQuickViewModal() {
        // RUX ENHANCEMENT: This would open a modal with detailed product view
        // For now, just show a notification
        showNotification('Quick view would open here', 'info');
    }
    
    // RUX COMPLIANCE: Error handling for uncaught errors
    window.addEventListener('error', function(event) {
        console.error('Product card error:', event.error);
        announceToScreenReader('An error occurred. Please refresh the page.');
    });
    
    // RUX COMPLIANCE: Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Product card promise rejection:', event.reason);
        event.preventDefault();
    });
    
})();

// RUX COMPLIANCE: Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initProductCard };
} 