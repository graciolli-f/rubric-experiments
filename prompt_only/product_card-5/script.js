/**
 * Product Card Interactive Functionality
 * Implements accessibility, performance, and security best practices
 */

// Security: Use strict mode to prevent common JavaScript pitfalls
'use strict';

// Performance: Cache DOM elements to avoid repeated queries
const ProductCard = {
    // DOM element cache
    elements: {},
    
    // Product data cache
    productData: {},
    
    // Initialize the product card functionality
    init() {
        // Performance: Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    },
    
    // Cache DOM elements and set up event listeners
    setupElements() {
        try {
            // Cache frequently accessed DOM elements for performance
            this.elements = {
                addToCartBtn: document.querySelector('.add-to-cart-btn'),
                wishlistBtn: document.querySelector('.wishlist-btn'),
                productImage: document.querySelector('.product-image'),
                successMessage: document.querySelector('#success-message'),
                successText: document.querySelector('.success-text'),
                imageLoading: document.querySelector('.image-loading')
            };
            
            // Validate that required elements exist
            if (!this.elements.addToCartBtn || !this.elements.wishlistBtn) {
                console.error('Required product card elements not found');
                return;
            }
            
            // Extract product data from button attributes for security
            this.extractProductData();
            
            // Set up event listeners with proper error handling
            this.setupEventListeners();
            
            // Set up image loading optimization
            this.setupImageLoading();
            
            // Performance: Set up intersection observer for animations
            this.setupIntersectionObserver();
            
        } catch (error) {
            console.error('Error setting up product card:', error);
        }
    },
    
    // Extract product data from HTML attributes securely
    extractProductData() {
        const addToCartBtn = this.elements.addToCartBtn;
        
        // Security: Sanitize and validate data from DOM attributes
        this.productData = {
            id: this.sanitizeString(addToCartBtn.dataset.productId),
            name: this.sanitizeString(addToCartBtn.dataset.productName),
            price: this.sanitizePrice(addToCartBtn.dataset.productPrice)
        };
        
        // Validate extracted data
        if (!this.productData.id || !this.productData.name || !this.productData.price) {
            console.warn('Incomplete product data extracted');
        }
    },
    
    // Security: Sanitize string inputs to prevent XSS
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>]/g, '').trim().substring(0, 100);
    },
    
    // Security: Sanitize and validate price data
    sanitizePrice(price) {
        const numPrice = parseFloat(price);
        return (isNaN(numPrice) || numPrice < 0) ? 0 : numPrice;
    },
    
    // Set up all event listeners with proper accessibility support
    setupEventListeners() {
        // Add to Cart button functionality
        this.elements.addToCartBtn.addEventListener('click', (event) => {
            this.handleAddToCart(event);
        });
        
        // Wishlist button functionality
        this.elements.wishlistBtn.addEventListener('click', (event) => {
            this.handleWishlist(event);
        });
        
        // Accessibility: Keyboard support for buttons
        this.elements.addToCartBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleAddToCart(event);
            }
        });
        
        this.elements.wishlistBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleWishlist(event);
            }
        });
        
        // Accessibility: Handle success message dismissal
        if (this.elements.successMessage) {
            this.elements.successMessage.addEventListener('click', () => {
                this.hideSuccessMessage();
            });
            
            // Auto-dismiss success message after 5 seconds
            this.elements.successMessage.addEventListener('transitionend', (event) => {
                if (event.propertyName === 'opacity' && 
                    this.elements.successMessage.classList.contains('show')) {
                    setTimeout(() => this.hideSuccessMessage(), 5000);
                }
            });
        }
        
        // Performance: Debounced resize handler for responsive updates
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 150);
        });
    },
    
    // Handle Add to Cart functionality
    handleAddToCart(event) {
        try {
            // Prevent default button behavior
            event.preventDefault();
            
            // Security: Validate product data before processing
            if (!this.validateProductData()) {
                this.showError('Invalid product data');
                return;
            }
            
            // Accessibility: Provide immediate feedback
            this.toggleButtonLoading(this.elements.addToCartBtn, true);
            
            // Simulate API call with proper error handling
            this.simulateAddToCart()
                .then(() => {
                    this.showSuccessMessage(`${this.productData.name} added to cart!`);
                    this.updateCartCount();
                })
                .catch((error) => {
                    console.error('Add to cart failed:', error);
                    this.showError('Failed to add item to cart. Please try again.');
                })
                .finally(() => {
                    this.toggleButtonLoading(this.elements.addToCartBtn, false);
                });
                
        } catch (error) {
            console.error('Error handling add to cart:', error);
            this.showError('An unexpected error occurred');
        }
    },
    
    // Handle Wishlist functionality
    handleWishlist(event) {
        try {
            event.preventDefault();
            
            if (!this.validateProductData()) {
                this.showError('Invalid product data');
                return;
            }
            
            // Toggle wishlist state with visual feedback
            const isWishlisted = this.elements.wishlistBtn.classList.contains('wishlisted');
            
            this.toggleButtonLoading(this.elements.wishlistBtn, true);
            
            this.simulateWishlistToggle(!isWishlisted)
                .then(() => {
                    this.toggleWishlistState(!isWishlisted);
                    const action = !isWishlisted ? 'added to' : 'removed from';
                    this.showSuccessMessage(`${this.productData.name} ${action} wishlist!`);
                })
                .catch((error) => {
                    console.error('Wishlist toggle failed:', error);
                    this.showError('Failed to update wishlist. Please try again.');
                })
                .finally(() => {
                    this.toggleButtonLoading(this.elements.wishlistBtn, false);
                });
                
        } catch (error) {
            console.error('Error handling wishlist:', error);
            this.showError('An unexpected error occurred');
        }
    },
    
    // Validate product data before processing
    validateProductData() {
        return this.productData.id && 
               this.productData.name && 
               this.productData.price > 0;
    },
    
    // Simulate async API call for adding to cart
    simulateAddToCart() {
        return new Promise((resolve, reject) => {
            // Simulate network delay and potential failure
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, productId: this.productData.id });
                } else {
                    reject(new Error('Network error occurred'));
                }
            }, 800);
        });
    },
    
    // Simulate async API call for wishlist toggle
    simulateWishlistToggle(add) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.05) { // 95% success rate
                    resolve({ success: true, added: add });
                } else {
                    reject(new Error('Network error occurred'));
                }
            }, 600);
        });
    },
    
    // Toggle button loading state with accessibility support
    toggleButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            button.classList.add('loading');
            // Store original text for restoration later
            const originalHtml = button.innerHTML;
            button.dataset.originalHtml = originalHtml;
            button.innerHTML = '<span class="btn-icon" aria-hidden="true">⏳</span>Loading...';
        } else {
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
            button.classList.remove('loading');
            // Restore original button content
            if (button.dataset.originalHtml) {
                button.innerHTML = button.dataset.originalHtml;
            }
        }
    },
    
    // Toggle wishlist visual state
    toggleWishlistState(isWishlisted) {
        const button = this.elements.wishlistBtn;
        const icon = button.querySelector('.btn-icon');
        
        if (isWishlisted) {
            button.classList.add('wishlisted');
            icon.textContent = '♥';
            button.setAttribute('aria-label', `Remove ${this.productData.name} from wishlist`);
        } else {
            button.classList.remove('wishlisted');
            icon.textContent = '♡';
            button.setAttribute('aria-label', `Add ${this.productData.name} to wishlist`);
        }
    },
    
    // Show success message with accessibility support
    showSuccessMessage(message) {
        if (!this.elements.successMessage || !this.elements.successText) return;
        
        this.elements.successText.textContent = message;
        this.elements.successMessage.setAttribute('aria-hidden', 'false');
        this.elements.successMessage.classList.add('show');
        
        // Accessibility: Announce to screen readers
        this.elements.successMessage.setAttribute('role', 'alert');
    },
    
    // Hide success message
    hideSuccessMessage() {
        if (!this.elements.successMessage) return;
        
        this.elements.successMessage.classList.remove('show');
        this.elements.successMessage.setAttribute('aria-hidden', 'true');
        
        // Clean up after animation
        setTimeout(() => {
            this.elements.successMessage.setAttribute('role', '');
        }, 300);
    },
    
    // Show error message
    showError(message) {
        console.error('Product Card Error:', message);
        // Use the success message system with error styling
        if (this.elements.successMessage) {
            const originalBackground = this.elements.successMessage.style.background;
            this.elements.successMessage.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
            this.showSuccessMessage(message);
            
            // Reset styling after hiding
            setTimeout(() => {
                this.elements.successMessage.style.background = originalBackground;
            }, 6000);
        }
    },
    
    // Update cart count (localStorage integration)
    updateCartCount() {
        try {
            const cartCount = localStorage.getItem('cartCount') || '0';
            const newCount = parseInt(cartCount) + 1;
            localStorage.setItem('cartCount', newCount.toString());
        } catch (error) {
            console.warn('Could not update cart count in localStorage:', error);
        }
    },
    
    // Set up image loading optimization
    setupImageLoading() {
        if (!this.elements.productImage || !this.elements.imageLoading) return;
        
        const img = this.elements.productImage;
        const loadingPlaceholder = this.elements.imageLoading;
        
        // Show loading placeholder while image loads
        if (!img.complete) {
            loadingPlaceholder.style.opacity = '1';
        }
        
        // Hide loading placeholder when image loads
        img.addEventListener('load', () => {
            loadingPlaceholder.style.opacity = '0';
        });
        
        // Handle image load errors
        img.addEventListener('error', () => {
            loadingPlaceholder.style.opacity = '0';
            console.warn('Product image failed to load');
        });
    },
    
    // Set up intersection observer for performance
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        const productCard = document.querySelector('.product-card');
        if (productCard) {
            observer.observe(productCard);
        }
    },
    
    // Handle responsive updates
    handleResize() {
        const width = window.innerWidth;
        
        if (width < 768 && !document.body.classList.contains('mobile')) {
            document.body.classList.add('mobile');
        } else if (width >= 768 && document.body.classList.contains('mobile')) {
            document.body.classList.remove('mobile');
        }
    }
};

// Initialize the product card when the script loads
ProductCard.init();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductCard;
} 