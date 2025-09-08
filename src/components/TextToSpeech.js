






import React, { useState } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!text.trim()) {
      alert('Please enter some text to speak.');
      return;
    }

    // Cancel any ongoing speech first
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: set voice, pitch, rate, etc.
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    // Add event listeners
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('SpeechSynthesisUtterance error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Text to Speech Converter</h2>
        <div style={styles.waveContainer}>
          <div style={isSpeaking ? {...styles.waveBar, ...styles.waveBar1Animation} : styles.waveBar}></div>
          <div style={isSpeaking ? {...styles.waveBar, ...styles.waveBar2Animation} : styles.waveBar}></div>
          <div style={isSpeaking ? {...styles.waveBar, ...styles.waveBar3Animation} : styles.waveBar}></div>
          <div style={isSpeaking ? {...styles.waveBar, ...styles.waveBar4Animation} : styles.waveBar}></div>
          <div style={isSpeaking ? {...styles.waveBar, ...styles.waveBar5Animation} : styles.waveBar}></div>
        </div>
        <textarea
          style={styles.textarea}
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak..."
        />
        <br />
        <button 
          style={isSpeaking ? {...styles.button, ...styles.stopButton} : styles.button}
          onClick={speak}
        >
          {isSpeaking ? 'Stop Speaking' : 'Speak Text'}
        </button>
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
    fontFamily: "'Poppins', sans-serif",
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '30px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06)',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  title: {
    color: '#333',
    marginBottom: '25px',
    fontSize: '28px',
    fontWeight: '700',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: '2px solid #ddd',
    fontSize: '16px',
    fontFamily: "'Poppins', sans-serif",
    marginBottom: '20px',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '150px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
    outline: 'none',
  },
  button: {
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(118, 75, 162, 0.4)',
    transform: 'translateY(0) scale(1)',
    letterSpacing: '1px',
  },
  stopButton: {
    background: 'linear-gradient(to right, #ff5e62, #ff9966)',
    boxShadow: '0 5px 15px rgba(255, 94, 98, 0.4)',
  },
  waveContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    marginBottom: '20px',
    gap: '3px',
  },
  waveBar: {
    width: '4px',
    height: '20px',
    backgroundColor: '#667eea',
    borderRadius: '3px',
    transition: 'height 0.3s ease',
  },
  waveBar1Animation: {
    animation: 'wave 1s infinite ease-in-out',
    animationDelay: '0s',
    height: '40px',
    backgroundColor: '#764ba2',
  },
  waveBar2Animation: {
    animation: 'wave 1s infinite ease-in-out',
    animationDelay: '0.1s',
    height: '35px',
    backgroundColor: '#667eea',
  },
  waveBar3Animation: {
    animation: 'wave 1s infinite ease-in-out',
    animationDelay: '0.2s',
    height: '30px',
    backgroundColor: '#5a67d8',
  },
  waveBar4Animation: {
    animation: 'wave 1s infinite ease-in-out',
    animationDelay: '0.3s',
    height: '35px',
    backgroundColor: '#667eea',
  },
  waveBar5Animation: {
    animation: 'wave 1s infinite ease-in-out',
    animationDelay: '0.4s',
    height: '40px',
    backgroundColor: '#764ba2',
  },
};

// Add keyframes for animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
}
`;

// Add the keyframes to the document
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default TextToSpeech;