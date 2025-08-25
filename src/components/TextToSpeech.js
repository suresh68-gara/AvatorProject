import React, { useState } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');

  const speak = () => {
    if (!text.trim()) {
      alert('Please enter some text to speak.');
      return;
    }

    // Cancel any ongoing speech first
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: set voice, pitch, rate, etc.
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    // Add error handling
    utterance.onerror = (e) => {
      console.error('SpeechSynthesisUtterance error:', e);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
      />
      <br />
      <button onClick={speak}>Speak</button>
    </div>
  );
}

export default TextToSpeech;
