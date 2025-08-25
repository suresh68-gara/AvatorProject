// import React, { useState } from 'react';
// import './Navbar.css';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <a href="/" className="navbar-logo">AI Apps</a>
        
//         <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
//           <li className="navbar-item">
//             <a href="/Chatbot" className="navbar-link">Chatbot</a>
//           </li>
//           <li className="navbar-item">
//             <a href="/FaceExpression" className="navbar-link">FaceExpression</a>
//           </li>
//           <li className="navbar-item">
//             <a href="/SmartVideoPlayer" className="navbar-link">SmartVideoPlayer</a>
//           </li>
//           <li className="navbar-item">
//             <a href="/SpeechToSpeech" className="navbar-link">SpeechToSpeech</a>
//           </li>
//           <li className="navbar-item">
//             <a href="/SpeechToText" className="navbar-link">SpeechToText</a>
//           </li>
//           <li className="navbar-item">
//             <a href="/TextToSpeech" className="navbar-link">TextToSpeech</a>
//           </li>
//         </ul>
        
//         <div 
//           className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
//           onClick={toggleMenu}
//         >
//           <span className="navbar-toggle-icon"></span>
//           <span className="navbar-toggle-icon"></span>
//           <span className="navbar-toggle-icon"></span>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">AI Apps</a>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a href="/chatbot" className="navbar-link">Chatbot</a>
          </li>
          <li className="navbar-item">
            <a href="/faceexpressions" className="navbar-link">FaceExpressions</a>
          </li>
          <li className="navbar-item">
            <a href="/smartvideoplayer" className="navbar-link">SmartVideoPlayer</a>
          </li>
          <li className="navbar-item">
            <a href="/speechtospeech" className="navbar-link">SpeechToSpeech</a>
          </li>
          <li className="navbar-item">
            <a href="/speechtotext" className="navbar-link">SpeechToText</a>
          </li>
          <li className="navbar-item">
            <a href="/texttospeech" className="navbar-link">TextToSpeech</a>
          </li>
        </ul>
        
        <div 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;