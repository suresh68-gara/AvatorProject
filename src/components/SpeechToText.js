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
    <div>
      <h2>Speech to Text</h2>
      <button onClick={startListening}>
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>
      <p><strong>Recognized:</strong> {text}</p>
    </div>
  );
}

export default SpeechToText;
