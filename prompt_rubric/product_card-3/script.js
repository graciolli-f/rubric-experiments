/**
 * Product Card JavaScript - Following base.rux and card.rux specifications
 * Required by: base.rux > Security > no eval() or Function() with user input
 * Required by: base.rux > Security > CSP compliant implementation
 * Required by: base.rux > Security > no inline event handlers
 */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Get references to key elements
    // Required by: base.rux > CodeStyle > data-testid for test targeting
    const addToCartButton = document.querySelector('[data-testid="add-to-cart-button"]');
    const quickViewButton = document.querySelector('[data-testid="quick-view-button"]');
    const productCard = document.querySelector('.card');
    
    // Initialize product card functionality
    if (productCard && addToCartButton) {
        initializeProductCard();
    }
    
    /**
     * Initialize all product card functionality
     * Required by: card.rux > ProductCard > add to cart action
     */
    function initializeProductCard() {
        // Add event listeners for button interactions
        // Required by: base.rux > Accessibility > keyboard navigable
        addToCartButton.addEventListener('click', handleAddToCart);
        addToCartButton.addEventListener('keydown', handleKeyboardInteraction);
        
        if (quickViewButton) {
            quickViewButton.addEventListener('click', handleQuickView);
            quickViewButton.addEventListener('keydown', handleKeyboardInteraction);
        }
        
        // Initialize keyboard navigation for the entire card
        productCard.addEventListener('keydown', handleCardKeyboardNavigation);
        
        // Add focus management for better accessibility
        // Required by: base.rux > Accessibility > visible focus indicators
        enhanceAccessibility();
        
        // Initialize loading state management
        // Required by: base.rux > StateManagement > loading states for async operations
        initializeLoadingStates();
        
        console.log('Product card initialized successfully');
    }
    
    /**
     * Handle Add to Cart button click
     * Required by: card.rux > ProductCard > add to cart action
     */
    async function handleAddToCart(event) {
        event.preventDefault();
        
        // Get product data from button attributes
        // Required by: base.rux > Security > sanitize all user input
        const productId = sanitizeInput(addToCartButton.dataset.productId);
        const productName = sanitizeInput(addToCartButton.dataset.productName);
        const productPrice = parseFloat(addToCartButton.dataset.productPrice) || 0;
        
        // Validate product data
        if (!productId || !productName || productPrice <= 0) {
            console.error('Invalid product data');
            showError('Invalid product information. Please try again.');
            return;
        }
        
        // Show loading state
        // Required by: base.rux > StateManagement > loading states for async operations
        setButtonLoading(addToCartButton, true);
        
        try {
            // Simulate API call to add product to cart
            // Required by: base.rux > Performance > provide immediate feedback
            await simulateAddToCart({
                id: productId,
                name: productName,
                price: productPrice
            });
            
            // Show success feedback
            // Required by: base.rux > StateManagement > announce state changes to screen readers
            showSuccess(`${productName} added to cart successfully!`);
            
            // Optional: Update button text temporarily
            const originalText = addToCartButton.querySelector('.card__button-text').textContent;
            addToCartButton.querySelector('.card__button-text').textContent = 'Added!';
            
            setTimeout(() => {
                addToCartButton.querySelector('.card__button-text').textContent = originalText;
            }, 2000);
            
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            // Required by: base.rux > StateManagement > error states with recovery options
            showError('Failed to add product to cart. Please try again.');
        } finally {
            // Always remove loading state
            setButtonLoading(addToCartButton, false);
        }
    }
    
    /**
     * Handle Quick View button click
     * Enhancement following card.rux recommendations
     */
    function handleQuickView(event) {
        event.preventDefault();
        
        // Get product information
        const productName = sanitizeInput(addToCartButton.dataset.productName);
        
        // Show quick view modal or drawer (simplified implementation)
        // Required by: base.rux > StateManagement > announce state changes to screen readers
        showQuickViewInfo(productName);
    }
    
    /**
     * Handle keyboard interactions for buttons
     * Required by: base.rux > Accessibility > keyboard navigable
     */
    function handleKeyboardInteraction(event) {
        // Handle Enter and Space key presses
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.target.click();
        }
    }
    
    /**
     * Handle keyboard navigation within the card
     * Required by: base.rux > Accessibility > keyboard navigable
     * Required by: base.rux > Accessibility > no keyboard traps
     */
    function handleCardKeyboardNavigation(event) {
        const focusableElements = productCard.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const focusableArray = Array.from(focusableElements);
        const currentIndex = focusableArray.indexOf(event.target);
        
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % focusableArray.length;
                focusableArray[nextIndex].focus();
                break;
                
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault();
                const prevIndex = currentIndex === 0 ? focusableArray.length - 1 : currentIndex - 1;
                focusableArray[prevIndex].focus();
                break;
        }
    }
    
    /**
     * Enhance accessibility features
     * Required by: base.rux > Accessibility
     */
    function enhanceAccessibility() {
        // Add role attributes for better screen reader support
        // Required by: base.rux > Accessibility > announce state changes to screen readers
        const priceElement = document.querySelector('.card__price');
        if (priceElement) {
            priceElement.setAttribute('role', 'text');
        }
        
        // Ensure all interactive elements have proper ARIA labels
        const buttons = productCard.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
                console.warn('Button without proper ARIA label detected:', button);
            }
        });
    }
    
    /**
     * Initialize loading state management
     * Required by: base.rux > StateManagement > loading states for async operations
     */
    function initializeLoadingStates() {
        // Set up loading state CSS classes and ARIA attributes
        const buttons = productCard.querySelectorAll('.card__button');
        buttons.forEach(button => {
            // Add aria-busy attribute for screen readers
            button.setAttribute('aria-busy', 'false');
        });
    }
    
    /**
     * Set button loading state
     * Required by: base.rux > StateManagement > loading states for async operations
     */
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('card__button--loading');
            button.setAttribute('aria-busy', 'true');
            button.disabled = true;
        } else {
            button.classList.remove('card__button--loading');
            button.setAttribute('aria-busy', 'false');
            button.disabled = false;
        }
    }
    
    /**
     * Simulate adding product to cart (async operation)
     * In real implementation, this would make an API call
     */
    async function simulateAddToCart(product) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate occasional failures for demonstration
        if (Math.random() < 0.1) {
            throw new Error('Network error');
        }
        
        // Log the product addition (in real app, this would be sent to analytics)
        console.log('Product added to cart:', product);
        
        return { success: true, cartItemId: Date.now() };
    }
    
    /**
     * Show success message to user
     * Required by: base.rux > StateManagement > announce state changes to screen readers
     */
    function showSuccess(message) {
        announceToScreenReader(message, 'polite');
        
        // Visual feedback could be added here (toast notification, etc.)
        console.log('Success:', message);
    }
    
    /**
     * Show error message to user
     * Required by: base.rux > StateManagement > error states with recovery options
     */
    function showError(message) {
        announceToScreenReader(message, 'assertive');
        
        // Visual feedback could be added here (error toast, etc.)
        console.error('Error:', message);
    }
    
    /**
     * Show quick view information
     * Enhancement following card.rux recommendations
     */
    function showQuickViewInfo(productName) {
        const message = `Quick view for ${productName} - detailed product information would be displayed here.`;
        announceToScreenReader(message, 'polite');
        
        // In a real implementation, this would open a modal or drawer
        console.log('Quick view:', message);
    }
    
    /**
     * Announce messages to screen readers
     * Required by: base.rux > Accessibility > announce state changes to screen readers
     */
    function announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        
        document.body.appendChild(announcement);
        
        // Add message after a brief delay to ensure screen readers notice
        setTimeout(() => {
            announcement.textContent = message;
        }, 100);
        
        // Remove announcement after screen readers have had time to read it
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 5000);
    }
    
    /**
     * Sanitize input to prevent security issues
     * Required by: base.rux > Security > sanitize all user input
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        // Basic sanitization - in production, use a proper sanitization library
        return input.replace(/[<>'"]/g, '').trim();
    }
    
    // Handle reduced motion preferences
    // Required by: base.rux > StateManagement > reduced motion for prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('Reduced motion preference detected - animations will be minimal');
    }
    
    // Handle high contrast preferences
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        console.log('High contrast preference detected - enhanced contrast applied');
    }
}); 