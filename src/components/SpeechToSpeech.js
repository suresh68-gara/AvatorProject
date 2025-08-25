import React, { useState } from 'react';

function SpeechToSpeech() {
  const [isListening, setIsListening] = useState(false);
  let recognition;

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      speak(spokenText);
    };

    recognition.start();
  };

  return (
    <div>
      <h2>Speech to Speech</h2>
      <button onClick={handleSpeech}>
        {isListening ? 'Listening...' : 'Start Speaking'}
      </button>
    </div>
  );
}

export default SpeechToSpeech;
