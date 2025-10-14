import React, { useState } from 'react'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Navbar = ({ setSignInOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const containerStyle = {
    width: '90%',
    maxWidth: '1320px',
    height: '60px',
    margin: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 100,
  }

  const logoStyle = {
    fontWeight: 700,
    fontSize: '24px',
    background: 'linear-gradient(135deg, #801AE6 0%, #A21AE6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  }

  const menuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  }

  const menuItemStyle = {
    fontSize: '16px',
    textDecoration: 'none',
    fontWeight: 500,
    color: '#e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
  }

  const buttonStyle = {
    padding: '10px 20px',
    background: 'transparent',
    border: '2px solid #A21AE6',
    color: '#A21AE6',
    borderRadius: '100px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  const mobileMenuButtonStyle = {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#e0e0e0',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
  }

  const handleMenuItemHover = (e) => {
    e.target.style.color = '#A21AE6'
    e.target.style.transform = 'translateY(-2px)'
  }

  const handleMenuItemHoverLeave = (e) => {
    e.target.style.color = '#e0e0e0'
    e.target.style.transform = 'translateY(0)'
  }

  const handleButtonHover = (e) => {
    e.currentTarget.style.background = 'linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%)'
    e.currentTarget.style.color = '#ffffff'
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(160, 26, 230, 0.4)'
    e.currentTarget.style.transform = 'translateY(-2px)'
  }

  const handleButtonHoverLeave = (e) => {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color = '#A21AE6'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.transform = 'translateY(0)'
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar-container {
          animation: slideDown 0.6s ease-out;
          border-bottom: 1px solid rgba(160, 26, 230, 0.1);
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0px 20px !important;
            flex-wrap: wrap;
            height: auto;
            padding-bottom: 12px !important;
          }

          .navbar-menu {
            display: none !important;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            flex-direction: column !important;
            gap: 0 !important;
            background: rgba(15, 15, 15, 0.98);
            padding: 20px !important;
            border-bottom: 1px solid rgba(160, 26, 230, 0.2);
            width: 100%;
            animation: slideDown 0.3s ease-out;
          }

          .navbar-menu.active {
            display: flex !important;
          }

          .navbar-menu-item {
            padding: 12px 0 !important;
            border-bottom: 1px solid rgba(160, 26, 230, 0.1);
          }

          .navbar-menu-item:last-child {
            border-bottom: none !important;
          }

          .navbar-mobile-menu-button {
            display: flex !important;
          }

          .navbar-button {
            width: 100% !important;
            margin-top: 12px !important;
            justify-content: center !important;
          }

          .navbar-logo {
            font-size: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            height: auto;
            margin: 8px 10px;
          }

          .navbar-logo {
            font-size: 18px !important;
          }

          .navbar-menu {
            top: 50px !important;
          }

          .navbar-button {
            font-size: 14px !important;
            padding: 10px 16px !important;
          }
        }
      `}</style>

      <div style={containerStyle} className="navbar-container">
        <h1 style={logoStyle} className="navbar-logo">PRO</h1>

        <ul style={menuStyle} className="navbar-menu">
          <li className="navbar-menu-item">
            <a
              href="#home"
              style={menuItemStyle}
              onMouseEnter={handleMenuItemHover}
              onMouseLeave={handleMenuItemHoverLeave}
            >
              Home
            </a>
          </li>
          <li className="navbar-menu-item">
            <a
              href="#features"
              style={menuItemStyle}
              onMouseEnter={handleMenuItemHover}
              onMouseLeave={handleMenuItemHoverLeave}
            >
              Features
            </a>
          </li>
          <li className="navbar-menu-item">
            <a
              href="#benefits"
              style={menuItemStyle}
              onMouseEnter={handleMenuItemHover}
              onMouseLeave={handleMenuItemHoverLeave}
            >
              Benefits
            </a>
          </li>
        </ul>

        <button
          style={buttonStyle}
          className="navbar-button"
          onClick={() => setSignInOpen(true)}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonHoverLeave}
        >
          <AccountCircleOutlinedIcon sx={{ fontSize: '1.3rem' }} />
          Sign In
        </button>

        <button
          style={mobileMenuButtonStyle}
          className="navbar-mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <ul style={{ ...menuStyle, flexDirection: 'column', position: 'absolute', top: '60px', left: 0, right: 0, background: 'rgba(15, 15, 15, 0.98)', padding: '20px', width: '100%', borderBottom: '1px solid rgba(160, 26, 230, 0.2)' }} className="navbar-menu active">
          <li style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(160, 26, 230, 0.1)' }}>
            <a
              href="#home"
              style={menuItemStyle}
              onMouseEnter={handleMenuItemHover}
              onMouseLeave={handleMenuItemHoverLeave}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
          </li>
          <li style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(160, 26, 230, 0.1)' }}>
            <a
              href="#features"
              style={menuItemStyle}
              onMouseEnter={handleMenuItemHover}
              onMouseLeave={handleMenuItemHoverLeave}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
          </li>
          <li style={{ paddingBottom: '12px' }}>
            <a
              href="#benefits"
              style={menuItemStyle}
              onMouseEnter={handleMenuItemHover}
              onMouseLeave={handleMenuItemHoverLeave}
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </a>
          </li>
        </ul>
      )}
    </>
  )
}

export default Navbar