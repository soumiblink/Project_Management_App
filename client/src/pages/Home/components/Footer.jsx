import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  const footerContainerStyle = {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    alignItems: 'center',
    padding: '3rem 1rem 2rem 1rem',
    color: '#e0e0e0',
    borderTop: '1px solid rgba(160, 26, 230, 0.2)',
    animation: 'fadeIn 0.8s ease-out',
  }

  const logoStyle = {
    fontWeight: 700,
    fontSize: '28px',
    background: 'linear-gradient(135deg, #801AE6 0%, #A21AE6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '2px',
  }

  const navStyle = {
    width: '100%',
    maxWidth: '800px',
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const navLinkStyle = {
    color: '#e0e0e0',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    cursor: 'pointer',
  }

  const socialMediaIconsStyle = {
    display: 'flex',
    marginTop: '1.5rem',
    gap: '1.5rem',
    justifyContent: 'center',
    animation: 'fadeIn 0.8s ease-out 0.2s both',
  }

  const socialMediaIconStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    color: '#e0e0e0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(160, 26, 230, 0.1)',
  }

  const copyrightStyle = {
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(160, 26, 230, 0.1)',
  }

  const handleNavLinkHover = (e) => {
    e.target.style.color = '#A21AE6'
    e.target.style.transform = 'translateY(-2px)'
  }

  const handleNavLinkHoverLeave = (e) => {
    e.target.style.color = '#e0e0e0'
    e.target.style.transform = 'translateY(0)'
  }

  const handleSocialHover = (e) => {
    e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #801AE6 0%, #A21AE6 100%)'
    e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(160, 26, 230, 0.4)'
  }

  const handleSocialHoverLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(160, 26, 230, 0.1)'
    e.currentTarget.style.transform = 'translateY(0) scale(1)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 2rem 1rem !important;
          }

          .footer-nav {
            flex-wrap: wrap !important;
            gap: 1rem !important;
            justify-content: center !important;
            text-align: center !important;
          }

          .footer-nav-link {
            font-size: 1rem !important;
          }

          .footer-social {
            gap: 1rem !important;
            margin-top: 1rem !important;
          }

          .footer-logo {
            font-size: 24px !important;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            padding: 1.5rem 1rem !important;
          }

          .footer-nav-link {
            font-size: 0.9rem !important;
          }

          .footer-logo {
            font-size: 20px !important;
          }

          .footer-social-icon {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>

      <footer style={footerContainerStyle} className="footer-container">
        <h1 style={logoStyle} className="footer-logo">PRO</h1>

        <nav style={navStyle} className="footer-nav">
          <a
            href="#home"
            style={navLinkStyle}
            className="footer-nav-link"
            onMouseEnter={handleNavLinkHover}
            onMouseLeave={handleNavLinkHoverLeave}
          >
            Home
          </a>
          <a
            href="#features"
            style={navLinkStyle}
            className="footer-nav-link"
            onMouseEnter={handleNavLinkHover}
            onMouseLeave={handleNavLinkHoverLeave}
          >
            Features
          </a>
          <a
            href="#benefits"
            style={navLinkStyle}
            className="footer-nav-link"
            onMouseEnter={handleNavLinkHover}
            onMouseLeave={handleNavLinkHoverLeave}
          >
            Benefits
          </a>
        </nav>

        <div style={socialMediaIconsStyle} className="footer-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialMediaIconStyle}
            className="footer-social-icon"
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialHoverLeave}
          >
            <FacebookIcon sx={{ fontSize: '1.5rem' }} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialMediaIconStyle}
            className="footer-social-icon"
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialHoverLeave}
          >
            <TwitterIcon sx={{ fontSize: '1.5rem' }} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialMediaIconStyle}
            className="footer-social-icon"
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialHoverLeave}
          >
            <LinkedInIcon sx={{ fontSize: '1.5rem' }} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialMediaIconStyle}
            className="footer-social-icon"
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialHoverLeave}
          >
            <InstagramIcon sx={{ fontSize: '1.5rem' }} />
          </a>
        </div>

        <p style={copyrightStyle}>
          &copy; 2025 PRO. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Footer;