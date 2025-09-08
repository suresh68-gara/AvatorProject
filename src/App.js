// import React from 'react';
// // import Chatbot from './components/Chatbot';
// // import FaceExpressions from './components/FaceExpression';
// import Navbar from './components/Navbar';
// // import TextToSpeech from './components/TextToSpeech';
// // import SpeechToText from './components/SpeechToText';
// // import SpeechToSpeech from './components/SpeechToSpeech';
// // import FaceDetection from './components/Facedetection';
// // import VideoPlayer from './components/VideoPlayer';
// // import SmartVideoPlayer from './components/SmartVideoPlayer';



// function App() {
//   return (
//     <div style={{ padding: 20, fontFamily: 'Arial' }}>
//       {/* <TextToSpeech /> */}
//       {/* <SpeechToText /> */}
//       {/* <SpeechToSpeech /> */}
//       {/* <FaceDetection /> */}
//       {/* <br></br> */}
//       {/* <VideoPlayer /> */}
//       {/* <SmartVideoPlayer /> */}
//       {/* <FaceExpressions /> */}
//       {/* <Chatbot /> */}
//       <Navbar />

//     </div>
//   );
// }

// export default App;


// import React from 'react';
// import Navbar from './components/Navbar';
// import  Chatbot from './components/Chatbot';
// import SmartVideoPlayer from './components/SmartVideoPlayer';
// import FaceExpression from './components/FaceExpression';
// import SpeechToSpeech from './components/SpeechToSpeech';
// import SpeechToText from './components/SpeechToText';
// import TextToSpeech from './components/TextToSpeech';

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//         <Routes>
//           <Route path="/chatbot" element={<Chatbot />} />
//           <Route path="/face-expression" element={<FaceExpression />} />
//           <Route path="/smartvideoplayer" element={<SmartVideoPlayer />} />
//           <Route path="/speechtospeech" element={<SpeechToSpeech />} />
//           <Route path="/speechtotext" element={<SpeechToText />} />
//           <Route path="/texttospeech" element={<TextToSpeech />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
// import Navbar from './components/Navbar';
// import Chatbot from './components/Chatbot';
// import SmartVideoPlayer from './components/SmartVideoPlayer';
// import FaceExpressions from './components/FaceExpressions';
// import SpeechToSpeech from './components/SpeechToSpeech';
// import SpeechToText from './components/SpeechToText';
// import TextToSpeech from './components/TextToSpeech';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//         <Routes>
//           <Route path="/chatbot" element={<Chatbot />} />
//           <Route path="/faceexpression" element={<FaceExpressions />} />
//           <Route path="/smartvideoplayer" element={<SmartVideoPlayer />} />
//           <Route path="/speechtospeech" element={<SpeechToSpeech />} />
//           <Route path="/speechtotext" element={<SpeechToText />} />
//           <Route path="/texttospeech" element={<TextToSpeech />} />
//           <Route path="/" element={<FaceExpressions />} /> Default route
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;















// 
import React from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import SmartVideoPlayer from './components/SmartVideoPlayer';
import FaceExpressions from './components/FaceExpressions';
import SpeechToSpeech from './components/SpeechToSpeech';
import SpeechToText from './components/SpeechToText';
import TextToSpeech from './components/TextToSpeech';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/faceexpression" element={<FaceExpressions />} />
          <Route path="/smartvideoplayer" element={<SmartVideoPlayer />} />
          <Route path="/speechtospeech" element={<SpeechToSpeech />} />
          <Route path="/speechtotext" element={<SpeechToText />} />
          <Route path="/texttospeech" element={<TextToSpeech />} />
          <Route path="/" element={<FaceExpressions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;