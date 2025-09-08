



import React, { useState, useEffect, useRef } from 'react';

function SpeechToSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');
  const buttonRef = useRef(null);
  let recognition;

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
      speechSynthesis.cancel();
    };
  }, []);

  const speak = (text) => {
    setLastSpokenText(text);
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Reset button animation after speaking completes
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'translateZ(0px)';
      }
    };
    
    speechSynthesis.speak(utterance);
  };

  const handleSpeech = () => {
    if (isListening) {
      recognition.stop();
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      // Add 3D effect to button when listening
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'translateZ(20px)';
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      // Reset button animation when not listening
      if (buttonRef.current && !isSpeaking) {
        buttonRef.current.style.transform = 'translateZ(0px)';
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'translateZ(0px)';
      }
    };
    
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      speak(spokenText);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Recognition start failed:', error);
    }
  };

  const getButtonText = () => {
    if (isListening) return 'Listening...';
    if (isSpeaking) return 'Speaking...';
    return 'Start Speaking';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Speech to Speech</h2>
        <p style={styles.subtitle}>Speak and hear your words echoed back</p>
        
        <div style={styles.buttonContainer}>
          <button 
            ref={buttonRef}
            onClick={handleSpeech}
            style={{
              ...styles.button,
              ...(isListening ? styles.listening : {}),
              ...(isSpeaking ? styles.speaking : {})
            }}
            className="speech-button"
          >
            <span style={styles.buttonText}>{getButtonText()}</span>
            <div style={styles.wave}></div>
          </button>
        </div>
        
        {lastSpokenText && (
          <div style={styles.textContainer}>
            <p style={styles.textLabel}>Last spoken text:</p>
            <p style={styles.text}>{lastSpokenText}</p>
          </div>
        )}
        
        <div style={styles.animationContainer}>
          <div 
            style={{
              ...styles.voiceWave,
              animationPlayState: isListening || isSpeaking ? 'running' : 'paused'
            }} 
          >
            <div style={styles.waveBar}></div>
            <div style={styles.waveBar}></div>
            <div style={styles.waveBar}></div>
            <div style={styles.waveBar}></div>
            <div style={styles.waveBar}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    boxSizing: 'border-box'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    transformStyle: 'preserve-3d',
    perspective: '1000px'
  },
  title: {
    color: '#333',
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    margin: '0 0 30px 0'
  },
  buttonContainer: {
    margin: '30px 0',
    perspective: '1000px'
  },
  button: {
    position: 'relative',
    padding: '18px 40px',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    zIndex: 1
  },
  listening: {
    background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
    boxShadow: '0 0 20px rgba(78, 205, 196, 0.5)'
  },
  speaking: {
    background: 'linear-gradient(45deg, #56ab2f, #a8e063)',
    boxShadow: '0 0 20px rgba(86, 171, 47, 0.5)'
  },
  buttonText: {
    position: 'relative',
    zIndex: 2
  },
  wave: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s ease, height 0.3s ease',
    zIndex: 0
  },
  textContainer: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
  },
  textLabel: {
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0'
  },
  text: {
    color: '#666',
    margin: '0',
    fontStyle: 'italic',
    lineHeight: '1.5'
  },
  animationContainer: {
    height: '60px',
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voiceWave: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60px',
    height: '40px'
  },
  waveBar: {
    width: '4px',
    height: '20px',
    backgroundColor: '#667eea',
    borderRadius: '10px',
    animation: 'wave 1.2s infinite ease-in-out',
    transformOrigin: 'center',
    
    ':nth-child(1)': {
      animationDelay: '0s'
    },
    ':nth-child(2)': {
      animationDelay: '0.1s'
    },
    ':nth-child(3)': {
      animationDelay: '0.2s'
    },
    ':nth-child(4)': {
      animationDelay: '0.3s'
    },
    ':nth-child(5)': {
      animationDelay: '0.4s'
    }
  }
};

// Add global styles for animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes wave {
    0%, 40%, 100% {
      transform: scaleY(0.5);
    }
    20% {
      transform: scaleY(1.5);
    }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .speech-button:hover {
    transform: translateZ(10px) !important;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .speech-button:hover .wave {
    width: 300px;
    height: 300px;
  }
`, styleSheet.cssRules.length);

// Add styles for the wave bars
for (let i = 1; i <= 5; i++) {
  styleSheet.insertRule(`
    .voice-wave div:nth-child(${i}) {
      animation-delay: ${(i-1)*0.1}s;
    }
  `, styleSheet.cssRules.length);
}

export default SpeechToSpeech;
