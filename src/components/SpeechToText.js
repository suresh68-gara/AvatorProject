




import React, { useState } from 'react';

function SpeechToText() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  let recognition;

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
    };

    recognition.start();
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      maxWidth: '600px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '20px',
      background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
      boxShadow: '0 20px 35px rgba(0, 0, 0, 0.3)',
      color: '#fff',
      textAlign: 'center',
      transform: 'translateZ(10px)',
      transition: 'transform 0.3s ease'
    }}>
      <h2 style={{
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '700',
        background: 'linear-gradient(45deg, #4cc9f0, #4361ee)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 5px 15px rgba(76, 201, 240, 0.3)'
      }}>Speech to Text Converter</h2>
      
      <div style={{
        position: 'relative',
        marginBottom: '30px'
      }}>
        <button 
          onClick={startListening}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            background: isListening 
              ? 'linear-gradient(45deg, #f72585, #b5179e)' 
              : 'linear-gradient(45deg, #4361ee, #4cc9f0)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: isListening 
              ? '0 0 25px rgba(247, 37, 133, 0.6), 0 10px 25px rgba(0, 0, 0, 0.2)' 
              : '0 10px 20px rgba(0, 0, 0, 0.2)',
            transform: isListening ? 'scale(1.05) translateZ(20px)' : 'scale(1) translateZ(10px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={e => {
            if (!isListening) {
              e.target.style.transform = 'scale(1.05) translateZ(15px)';
              e.target.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
            }
          }}
          onMouseOut={e => {
            if (!isListening) {
              e.target.style.transform = 'scale(1) translateZ(10px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }
          }}
        >
          {isListening ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                marginRight: '10px',
                animation: 'pulse 1.5s infinite'
              }}></span>
              Listening...
            </>
          ) : 'Start Listening'}
        </button>
        
        {isListening && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(247, 37, 133, 0.2)',
            animation: 'ripple 1.5s infinite',
            zIndex: '-1'
          }}></div>
        )}
      </div>
      
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '15px',
        minHeight: '100px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'inset 0 5px 15px rgba(0, 0, 0, 0.2)',
        transform: 'translateZ(5px)',
        transition: 'transform 0.3s ease'
      }}>
        <p style={{ margin: '0', fontSize: '16px' }}>
          <strong style={{
            background: 'linear-gradient(45deg, #4cc9f0, #4361ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Recognized:</strong> 
          <span style={{ 
            display: 'block', 
            marginTop: '10px',
            color: '#f1f1f1',
            lineHeight: '1.5'
          }}>{text || 'Speech will appear here...'}</span>
        </p>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          @keyframes ripple {
            0% {
              width: 80px;
              height: 80px;
              opacity: 0.8;
            }
            100% {
              width: 120px;
              height: 120px;
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default SpeechToText;


