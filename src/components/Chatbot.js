


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaMicrophone, FaStop, FaVolumeUp, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Gemini API Configuration
  const GEMINI_API_KEY = "AIzaSyAseQNB9hMgd8tZC4H16O7iaPDTR_bGfuE";
  const MODEL_NAME = "models/gemini-1.5-flash";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

  // Auto-scroll to newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini API
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: input }]
            }
          ]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Process response
      const botText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
                     "Sorry, I couldn't generate a response.";
      
      const botMessage = { text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      speakText(botText);

    } catch (err) {
      console.error("API error", err);
      const errMsg = err.response?.data?.error?.message || "An error occurred. Please try again.";
      setMessages(prev => [...prev, { text: errMsg, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Speak specific message
  const handleSpeakMessage = (text) => speakText(text);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerText}>CHATBOT</h2>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
            {msg.text}
            {msg.sender === 'bot' && (
              <button 
                style={styles.speakButton} 
                onClick={() => handleSpeakMessage(msg.text)} 
                title="Speak this message"
              >
                <FaVolumeUp />
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={styles.botMessage}>
            <div style={styles.typingIndicator}>
              <span style={styles.typingDot}></span>
              <span style={styles.typingDot}></span>
              <span style={styles.typingDot}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.textInput}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          style={{
            ...styles.voiceButton,
            ...(isListening ? styles.listeningButton : {})
          }}
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          {isListening ? <FaStop /> : <FaMicrophone />}
        </button>
        <button 
          type="submit" 
          disabled={!input.trim()} 
          style={styles.submitButton}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

// CSS styles using JavaScript objects
const styles = {
  container: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#6200ee',
    color: 'white',
    padding: '15px',
    textAlign: 'center'
  },
  headerText: {
    margin: 0,
    fontSize: '1.2rem'
  },
  messagesContainer: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200ee',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '18px',
    borderBottomRightRadius: '5px',
    maxWidth: '80%',
    lineHeight: '1.4',
    position: 'relative'
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    color: '#333',
    padding: '10px 15px',
    borderRadius: '18px',
    borderBottomLeftRadius: '5px',
    maxWidth: '80%',
    lineHeight: '1.4',
    position: 'relative'
  },
  speakButton: {
    position: 'absolute',
    right: '-25px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#6200ee',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  typingIndicator: {
    display: 'flex',
    padding: '10px'
  },
  typingDot: {
    width: '8px',
    height: '8px',
    margin: '0 2px',
    backgroundColor: '#666',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out both'
  },
  inputForm: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
    backgroundColor: 'white'
  },
  textInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none',
    fontSize: '1rem'
  },
  voiceButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 10px',
    color: '#6200ee',
    fontSize: '1.2rem'
  },
  listeningButton: {
    color: 'red',
    animation: 'pulse 1.5s infinite'
  },
  submitButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 10px',
    color: '#6200ee',
    fontSize: '1.2rem'
  },
  // Keyframes as CSS-in-JS (would need to be added to a global stylesheet for full effect)
  '@keyframes bounce': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' }
  },
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 }
  }
};

export default Chatbot;









// mobile rsponsive 

