import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const path      = location.pathname;

  return (
    <nav>
      <div className="nav-container">

        {/* ── Logo ── */}
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="4" r="2" fill="#adf822" />
              <circle cx="3" cy="10" r="1.5" fill="#adf822" opacity="0.6" />
              <circle cx="11" cy="10" r="1.5" fill="#adf822" opacity="0.6" />
              <line x1="7" y1="6" x2="3" y2="8.5"  stroke="#adf822" strokeWidth="0.8" opacity="0.5" />
              <line x1="7" y1="6" x2="11" y2="8.5" stroke="#adf822" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>
          <span className="nav-logo-text">
            COMMIT <span>DNA</span>
          </span>
        </div>

        {/* ── Center Nav Links ── */}
        <div className="navbar-links">

          <Link to="/" className={path === '/' ? 'active' : ''}>
            <span className="link-dot" />
            Home
          </Link>

          <Link to="/dashboard" className={path === '/dashboard' || path === '/result' ? 'active' : ''}>
            <span className="link-dot" />
            Dashboard
          </Link>

          <Link to="/about" className={path === '/about' ? 'active' : ''}>
            <span className="link-dot" />
            About Us
          </Link>

        </div>

        {/* ── Right Side ── */}
        <div className="nav-right">
          <div className="nav-status">
            <span className="nav-status-dot" />
            LIVE
          </div>

          <Link to="/" className="nav-analyze-btn">
            Analyze →
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;