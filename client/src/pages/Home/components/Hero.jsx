import React, { useState } from 'react'
import DemoImage from "../../../Images/AddProject.gif"
import HeaderImage from "../../../Images/Header.png"

const Hero = ({ setSignInOpen }) => {
  const [imageHovered, setImageHovered] = useState(false)

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '60px',
    padding: '60px 40px',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
  }

  const leftStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    zIndex: 2,
  }

  const titleStyle = {
    fontSize: '72px',
    fontWeight: 500,
    lineHeight: 1.1,
    margin: 0,
    background: 'linear-gradient(135deg, #801AE6 0%, #A21AE6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'fadeInUp 0.8s ease-out',
  }

  const descriptionStyle = {
    fontSize: '18px',
    fontWeight: 300,
    lineHeight: 1.7,
    margin: 0,
    marginBottom: '32px',
    color: 'rgba(255, 255, 255, 0.7)',
    animation: 'fadeInUp 0.8s ease-out 0.2s both',
  }

  const buttonContainerStyle = {
    display: 'flex',
    gap: '16px',
    animation: 'fadeInUp 0.8s ease-out 0.4s both',
    flexWrap: 'wrap',
  }

  const buttonStyle = {
    padding: '18px 40px',
    fontSize: '16px',
    fontWeight: 500,
    background: 'linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-block',
    width: 'fit-content',
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#A21AE6',
    border: '2px solid #A21AE6',
  }

  const statsStyle = {
    display: 'flex',
    gap: '40px',
    marginTop: '32px',
    animation: 'fadeInUp 0.8s ease-out 0.5s both',
  }

  const statStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const statNumberStyle = {
    fontSize: '28px',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #801AE6 0%, #A21AE6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  const statLabelStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 500,
  }

  const imageContainerStyle = {
    flex: 0.8,
    display: 'flex',
    objectFit: 'scale-down',
    borderRadius: '10px',
    position: 'relative',
    zIndex: 1,
  }

  const imageStyle = {
    width: '500px',
    height: '500px',
    flex: 0.8,
    display: 'flex',
    objectFit: 'scale-down',
    borderRadius: '10px',
    filter: imageHovered ? 'drop-shadow(0 20px 40px rgba(160, 26, 230, 0.4))' : 'drop-shadow(0 20px 40px rgba(160, 26, 230, 0.3))',
    animation: 'float 6s ease-in-out infinite, fadeInUp 0.8s ease-out 0.3s both',
    transition: 'filter 0.3s ease',
  }

  const handleButtonHover = (e, isSecondary) => {
    if (isSecondary) {
      e.target.style.background = 'rgba(162, 26, 230, 0.1)'
      e.target.style.boxShadow = '0 8px 24px rgba(162, 26, 230, 0.2)'
    } else {
      e.target.style.background = 'linear-gradient(76.35deg, #7015d8 15.89%, #9415d8 89.75%)'
      e.target.style.boxShadow = '0 12px 32px rgba(160, 26, 230, 0.4)'
    }
    e.target.style.transform = 'translateY(-2px)'
  }

  const handleButtonHoverLeave = (e, isSecondary) => {
    e.target.style.background = isSecondary ? 'transparent' : 'linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%)'
    e.target.style.boxShadow = 'none'
    e.target.style.transform = 'translateY(0)'
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column !important;
            gap: 40px !important;
            padding: 40px 20px !important;
            min-height: auto !important;
          }

          .hero-title {
            font-size: 48px !important;
          }

          .hero-description {
            font-size: 16px !important;
          }

          .hero-stats {
            gap: 20px !important;
            margin-top: 20px !important;
          }

          .hero-image {
            display: none !important;
          }

          .hero-button-container {
            flex-direction: column !important;
          }

          .hero-button {
            width: 100% !important;
            padding: 16px 24px !important;
            font-size: 15px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 36px !important;
          }
        }
      `}</style>

      <div style={containerStyle} className="hero-container" id="home">
        <div style={leftStyle}>
          <div style={titleStyle} className="hero-title">
            <b>Power Your Projects with Our App.</b>
          </div>

          <p style={descriptionStyle} className="hero-description">
            Take control of your projects and stay on top of your goals with our intuitive project management app. Say goodbye to chaos and hello to streamlined efficiency. Try it now and experience the difference.
          </p>

          <div style={buttonContainerStyle} className="hero-button-container">
            <button
              style={buttonStyle}
              className="hero-button"
              onClick={() => setSignInOpen(true)}
              onMouseEnter={(e) => handleButtonHover(e, false)}
              onMouseLeave={(e) => handleButtonHoverLeave(e, false)}
            >
              Manage a New Project
            </button>
          </div>

          <div style={statsStyle} className="hero-stats">
            <div style={statStyle}>
              <div style={statNumberStyle}>10K+</div>
              <div style={statLabelStyle}>Active Users</div>
            </div>
            <div style={statStyle}>
              <div style={statNumberStyle}>500+</div>
              <div style={statLabelStyle}>Projects Managed</div>
            </div>
            <div style={statStyle}>
              <div style={statNumberStyle}>99.9%</div>
              <div style={statLabelStyle}>Uptime</div>
            </div>
          </div>
        </div>

        <img
          src={HeaderImage}
          alt="Project Management"
          style={imageStyle}
          className="hero-image"
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        />
      </div>
    </>
  )
}

export default Hero