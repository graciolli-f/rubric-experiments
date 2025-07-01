// Footer component - displays footer sections with links and company information
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* BlogDash section with description and social links */}
        <div className="footer-section">
          <div className="footer-title">BlogDash</div>
          <p>Your comprehensive blog management platform. Create, manage, and analyze your content with ease.</p>
          <div className="social-links">
            <a href="#" className="social-link" title="Twitter">🐦</a>
            <a href="#" className="social-link" title="Facebook">📘</a>
            <a href="#" className="social-link" title="LinkedIn">💼</a>
            <a href="#" className="social-link" title="Instagram">📷</a>
          </div>
        </div>
        
        {/* Quick Links section */}
        <div className="footer-section">
          <div className="footer-title">Quick Links</div>
          <div className="footer-links">
            <a href="#" className="footer-link">Dashboard</a>
            <a href="#" className="footer-link">All Posts</a>
            <a href="#" className="footer-link">Comments</a>
            <a href="#" className="footer-link">Analytics</a>
            <a href="#" className="footer-link">Settings</a>
          </div>
        </div>
        
        {/* Support section */}
        <div className="footer-section">
          <div className="footer-title">Support</div>
          <div className="footer-links">
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Report Bug</a>
            <a href="#" className="footer-link">Feature Request</a>
          </div>
        </div>
        
        {/* Account section */}
        <div className="footer-section">
          <div className="footer-title">Account</div>
          <div className="footer-links">
            <a href="#" className="footer-link">Profile Settings</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Billing</a>
            <a href="#" className="footer-link">Logout</a>
          </div>
        </div>
      </div>
      
      {/* Footer bottom with copyright */}
      <div className="footer-bottom">
        <p>&copy; 2024 BlogDash. All rights reserved. Made with ❤️ for bloggers everywhere.</p>
      </div>
    </footer>
  )
}

export default Footer 