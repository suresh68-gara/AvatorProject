
















// 
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeMenu, setActiveMenu] = useState('');
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setActiveMenu(location.pathname);
//   }, [location]);

//   const handleMouseEnter = (item) => {
//     setHoveredItem(item);
//   };

//   const handleMouseLeave = () => {
//     setHoveredItem(null);
//   };

//   // Navbar container style
//   const navStyle = {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     background: isScrolled 
//       ? 'rgba(102, 126, 234, 0.95)' 
//       : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     padding: isScrolled ? '10px 0' : '15px 0',
//     zIndex: 1000,
//     transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//     boxShadow: isScrolled 
//       ? '0 4px 30px rgba(0, 0, 0, 0.1)' 
//       : '0 4px 20px rgba(0, 0, 0, 0.1)',
//     backdropFilter: 'blur(10px)',
//     WebkitBackdropFilter: 'blur(10px)'
//   };

//   // Container style
//   const containerStyle = {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0 20px',
//     position: 'relative'
//   };

//   // Logo style
//   const logoStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     position: 'relative',
//     cursor: 'pointer'
//   };

//   // Logo text style
//   const logoTextStyle = {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: '1.5rem',
//     letterSpacing: '1px',
//     transition: 'all 0.3s ease',
//     position: 'relative',
//     zIndex: 2
//   };

//   // Logo dot style with animation
//   const logoDotStyle = {
//     width: '8px',
//     height: '8px',
//     background: '#ff6b6b',
//     borderRadius: '50%',
//     position: 'absolute',
//     right: '-10px',
//     top: '5px',
//     animation: 'pulse 2s infinite'
//   };

//   // Menu style
//   const menuStyle = {
//     display: 'flex',
//     gap: '25px'
//   };

//   // Link style
//   const linkStyle = (path) => ({
//     color: activeMenu === path ? '#ff6b6b' : 'white',
//     textDecoration: 'none',
//     fontWeight: activeMenu === path ? '600' : '500',
//     position: 'relative',
//     padding: '8px 5px',
//     transition: 'all 0.3s ease',
//     overflow: 'hidden'
//   });

//   // Link text style
//   const linkTextStyle = (path) => ({
//     position: 'relative',
//     zIndex: 2,
//     transition: 'all 0.3s ease',
//     transform: hoveredItem === path ? 'translateY(-2px)' : 'translateY(0)',
//     textShadow: hoveredItem === path ? '0 0 5px rgba(255, 255, 255, 0.5)' : 'none'
//   });

//   // Underline style
//   const underlineStyle = (path) => ({
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: '100%',
//     height: activeMenu === path ? '3px' : '2px',
//     background: activeMenu === path ? '#ff6b6b' : 'white',
//     transform: hoveredItem === path || activeMenu === path ? 'translateX(0)' : 'translateX(-100%)',
//     transition: 'transform 0.3s ease',
//     borderRadius: '2px'
//   });

//   // Highlight bar style with animation
//   const highlightStyle = {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     height: '3px',
//     background: 'linear-gradient(90deg, #ff6b6b, #667eea)',
//     width: '100px',
//     borderRadius: '3px',
//     animation: 'moveHighlight 10s linear infinite'
//   };

//   // CSS for animations (to be added to document head)
//   const animationStyles = `
//     @keyframes pulse {
//       0% {
//         transform: scale(0.95);
//         box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
//       }
//       70% {
//         transform: scale(1);
//         box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
//       }
//       100% {
//         transform: scale(0.95);
//         box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
//       }
//     }
    
//     @keyframes moveHighlight {
//       0% {
//         left: 0;
//         transform: translateX(0);
//       }
//       50% {
//         left: 100%;
//         transform: translateX(-100%);
//       }
//       100% {
//         left: 0;
//         transform: translateX(0);
//       }
//     }
//   `;

//   // Add animation styles to document head
//   React.useEffect(() => {
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = animationStyles;
//     document.head.appendChild(styleElement);
    
//     return () => {
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   return (
//     <>
//       <nav style={navStyle}>
//         <div style={containerStyle}>
//           <div style={logoStyle}>
//             <span style={logoTextStyle}>AI Apps</span>
//             <div style={logoDotStyle}></div>
//           </div>
          
//           <div style={menuStyle}>
//             <Link 
//               to="/chatbot" 
//               style={linkStyle('/chatbot')}
//               onMouseEnter={() => handleMouseEnter('/chatbot')}
//               onMouseLeave={handleMouseLeave}
//             >
//               <span style={linkTextStyle('/chatbot')}>Chatbot</span>
//               <div style={underlineStyle('/chatbot')}></div>
//             </Link>
            
//             <Link 
//               to="/faceexpression" 
//               style={linkStyle('/faceexpression')}
//               onMouseEnter={() => handleMouseEnter('/faceexpression')}
//               onMouseLeave={handleMouseLeave}
//             >
//               <span style={linkTextStyle('/faceexpression')}>FaceExpressions</span>
//               <div style={underlineStyle('/faceexpression')}></div>
//             </Link>
            
//             <Link 
//               to="/smartvideoplayer" 
//               style={linkStyle('/smartvideoplayer')}
//               onMouseEnter={() => handleMouseEnter('/smartvideoplayer')}
//               onMouseLeave={handleMouseLeave}
//             >
//               <span style={linkTextStyle('/smartvideoplayer')}>SmartVideoPlayer</span>
//               <div style={underlineStyle('/smartvideoplayer')}></div>
//             </Link>
            
//             <Link 
//               to="/speechtospeech" 
//               style={linkStyle('/speechtospeech')}
//               onMouseEnter={() => handleMouseEnter('/speechtospeech')}
//               onMouseLeave={handleMouseLeave}
//             >
//               <span style={linkTextStyle('/speechtospeech')}>SpeechToSpeech</span>
//               <div style={underlineStyle('/speechtospeech')}></div>
//             </Link>
            
//             <Link 
//               to="/speechtotext" 
//               style={linkStyle('/speechtotext')}
//               onMouseEnter={() => handleMouseEnter('/speechtotext')}
//               onMouseLeave={handleMouseLeave}
//             >
//               <span style={linkTextStyle('/speechtotext')}>SpeechToText</span>
//               <div style={underlineStyle('/speechtotext')}></div>
//             </Link>
            
//             <Link 
//               to="/texttospeech" 
//               style={linkStyle('/texttospeech')}
//               onMouseEnter={() => handleMouseEnter('/texttospeech')}
//               onMouseLeave={handleMouseLeave}
//             >
//               <span style={linkTextStyle('/texttospeech')}>TextToSpeech</span>
//               <div style={underlineStyle('/texttospeech')}></div>
//             </Link>
//           </div>
          
//           <div style={highlightStyle}></div>
//         </div>
//       </nav>
      
//       {/* Add some spacing to account for fixed navbar */}
//       <div style={{height: '70px'}}></div>
//     </>
//   );
// };

// export default Navbar;



















//  mobile responsiveness

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close mobile menu when switching to desktop
      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navbar container style
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: isScrolled 
      ? 'rgba(102, 126, 234, 0.95)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: isScrolled ? '10px 0' : '15px 0',
    zIndex: 1000,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: isScrolled 
      ? '0 4px 30px rgba(0, 0, 0, 0.1)' 
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  };

  // Container style
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    position: 'relative'
  };

  // Logo style
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
    zIndex: 1001 // Above mobile menu
  };

  // Logo text style
  const logoTextStyle = {
    color: 'white',
    fontWeight: '700',
    fontSize: '1.5rem',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 2
  };

  // Logo dot style with animation
  const logoDotStyle = {
    width: '8px',
    height: '8px',
    background: '#ff6b6b',
    borderRadius: '50%',
    position: 'absolute',
    right: '-10px',
    top: '5px',
    animation: 'pulse 2s infinite'
  };

  // Menu style - different for desktop and mobile
  const menuStyle = {
    display: isMobile ? (isMobileMenuOpen ? 'flex' : 'none') : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '15px' : '25px',
    position: isMobile ? 'fixed' : 'relative',
    top: isMobile ? '0' : 'auto',
    left: isMobile ? '0' : 'auto',
    width: isMobile ? '100%' : 'auto',
    height: isMobile ? '100vh' : 'auto',
    background: isMobile 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'transparent',
    alignItems: isMobile ? 'center' : 'center',
    justifyContent: isMobile ? 'center' : 'flex-end',
    transition: 'all 0.3s ease',
    zIndex: 1000
  };

  // Link style
  const linkStyle = (path) => ({
    color: activeMenu === path ? '#ff6b6b' : 'white',
    textDecoration: 'none',
    fontWeight: activeMenu === path ? '600' : '500',
    position: 'relative',
    padding: isMobile ? '12px 5px' : '8px 5px',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    fontSize: isMobile ? '1.2rem' : '1rem',
    textAlign: isMobile ? 'center' : 'left'
  });

  // Link text style
  const linkTextStyle = (path) => ({
    position: 'relative',
    zIndex: 2,
    transition: 'all 0.3s ease',
    transform: hoveredItem === path ? 'translateY(-2px)' : 'translateY(0)',
    textShadow: hoveredItem === path ? '0 0 5px rgba(255, 255, 255, 0.5)' : 'none'
  });

  // Underline style
  const underlineStyle = (path) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: activeMenu === path ? '3px' : '2px',
    background: activeMenu === path ? '#ff6b6b' : 'white',
    transform: hoveredItem === path || activeMenu === path ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    borderRadius: '2px'
  });

  // Highlight bar style with animation
  const highlightStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #ff6b6b, #667eea)',
    width: '100px',
    borderRadius: '3px',
    animation: 'moveHighlight 10s linear infinite',
    display: isMobile ? 'none' : 'block' // Hide on mobile
  };

  // Hamburger menu style
  const hamburgerStyle = {
    display: isMobile ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '30px',
    height: '25px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    zIndex: 1001,
    position: 'relative'
  };

  // Hamburger line style
  const lineStyle = {
    width: '100%',
    height: '3px',
    background: 'white',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    transformOrigin: 'left',
    opacity: 1
  };

  // Animated hamburger lines
  const line1Style = {
    ...lineStyle,
    transform: isMobileMenuOpen ? 'rotate(45deg)' : 'rotate(0)'
  };

  const line2Style = {
    ...lineStyle,
    opacity: isMobileMenuOpen ? 0 : 1
  };

  const line3Style = {
    ...lineStyle,
    transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'rotate(0)'
  };

  // CSS for animations (to be added to document head)
  const animationStyles = `
    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
      }
    }
    
    @keyframes moveHighlight {
      0% {
        left: 0;
        transform: translateX(0);
      }
      50% {
        left: 100%;
        transform: translateX(-100%);
      }
      100% {
        left: 0;
        transform: translateX(0);
      }
    }

    @media (max-width: 767px) {
      .menu-item {
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .menu-open .menu-item {
        opacity: 1;
        transform: translateY(0);
      }
      
      .menu-item:nth-child(1) { transition-delay: 0.1s; }
      .menu-item:nth-child(2) { transition-delay: 0.2s; }
      .menu-item:nth-child(3) { transition-delay: 0.3s; }
      .menu-item:nth-child(4) { transition-delay: 0.4s; }
      .menu-item:nth-child(5) { transition-delay: 0.5s; }
      .menu-item:nth-child(6) { transition-delay: 0.6s; }
    }
  `;

  // Add animation styles to document head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <nav style={navStyle}>
        <div style={containerStyle}>
          <div style={logoStyle}>
            <span style={logoTextStyle}>AI Apps</span>
            <div style={logoDotStyle}></div>
          </div>
          
          {/* Hamburger menu for mobile */}
          <button 
            style={hamburgerStyle} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <div style={line1Style}></div>
            <div style={line2Style}></div>
            <div style={line3Style}></div>
          </button>
          
          <div style={menuStyle} className={isMobileMenuOpen ? 'menu-open' : ''}>
            <Link 
              to="/chatbot" 
              style={linkStyle('/chatbot')}
              onMouseEnter={() => handleMouseEnter('/chatbot')}
              onMouseLeave={handleMouseLeave}
              className="menu-item"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <span style={linkTextStyle('/chatbot')}>Chatbot</span>
              <div style={underlineStyle('/chatbot')}></div>
            </Link>
            
            <Link 
              to="/faceexpression" 
              style={linkStyle('/faceexpression')}
              onMouseEnter={() => handleMouseEnter('/faceexpression')}
              onMouseLeave={handleMouseLeave}
              className="menu-item"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <span style={linkTextStyle('/faceexpression')}>FaceExpressions</span>
              <div style={underlineStyle('/faceexpression')}></div>
            </Link>
            
            <Link 
              to="/smartvideoplayer" 
              style={linkStyle('/smartvideoplayer')}
              onMouseEnter={() => handleMouseEnter('/smartvideoplayer')}
              onMouseLeave={handleMouseLeave}
              className="menu-item"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <span style={linkTextStyle('/smartvideoplayer')}>SmartVideoPlayer</span>
              <div style={underlineStyle('/smartvideoplayer')}></div>
            </Link>
            
            <Link 
              to="/speechtospeech" 
              style={linkStyle('/speechtospeech')}
              onMouseEnter={() => handleMouseEnter('/speechtospeech')}
              onMouseLeave={handleMouseLeave}
              className="menu-item"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <span style={linkTextStyle('/speechtospeech')}>SpeechToSpeech</span>
              <div style={underlineStyle('/speechtospeech')}></div>
            </Link>
            
            <Link 
              to="/speechtotext" 
              style={linkStyle('/speechtotext')}
              onMouseEnter={() => handleMouseEnter('/speechtotext')}
              onMouseLeave={handleMouseLeave}
              className="menu-item"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <span style={linkTextStyle('/speechtotext')}>SpeechToText</span>
              <div style={underlineStyle('/speechtotext')}></div>
            </Link>
            
            <Link 
              to="/texttospeech" 
              style={linkStyle('/texttospeech')}
              onMouseEnter={() => handleMouseEnter('/texttospeech')}
              onMouseLeave={handleMouseLeave}
              className="menu-item"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <span style={linkTextStyle('/texttospeech')}>TextToSpeech</span>
              <div style={underlineStyle('/texttospeech')}></div>
            </Link>
          </div>
          
          <div style={highlightStyle}></div>
        </div>
      </nav>
      
      {/* Add some spacing to account for fixed navbar */}
      <div style={{height: '70px'}}></div>
    </>
  );
};

export default Navbar;