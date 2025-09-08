



// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "@vladmandic/face-api";

// function SmartVideoPlayer() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const videoPlayerRef = useRef(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [detectionActive, setDetectionActive] = useState(true);

//   // Helper functions
//   const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
//   const center = (pts) => {
//     const s = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
//       x: 0,
//       y: 0,
//     });
//     return { x: s.x / pts.length, y: s.y / pts.length };
//   };
//   const ear = (eye) => {
//     const [p1, p2, p3, p4, p5, p6] = eye;
//     const v1 = dist(p2, p6);
//     const v2 = dist(p3, p5);
//     const h = dist(p1, p4);
//     return (v1 + v2) / (2.0 * h);
//   };

//   // Load models + webcam
//   useEffect(() => {
//     const load = async () => {
//       const MODEL_URL = process.env.PUBLIC_URL + "/models";
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
//       setModelsLoaded(true);

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (webcamRef.current) {
//           webcamRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Webcam error:", err);
//       }
//     };
//     load();
//   }, []);

//   // Detection loop
//   useEffect(() => {
//     if (!modelsLoaded || !detectionActive) return;
//     let rafId = null;
//     const EAR_THRESHOLD = 0.20;
//     const YAW_THRESHOLD = 0.45; // slightly relaxed for better detection
//     let lastState = null;

//     const run = async () => {
//       const v = webcamRef.current;
//       const c = canvasRef.current;
//       const player = videoPlayerRef.current;
//       if (!v || !c || v.readyState < 2) {
//         rafId = requestAnimationFrame(run);
//         return;
//       }

//       const ctx = c.getContext("2d");
//       const opts = new faceapi.TinyFaceDetectorOptions({
//         inputSize: 256,
//         scoreThreshold: 0.5,
//       });

//       let shouldPlay = false;

//       try {
//         const det = await faceapi
//           .detectSingleFace(v, opts)
//           .withFaceLandmarks(true);

//         ctx.clearRect(0, 0, c.width, c.height);

//         if (det) {
//           const resized = faceapi.resizeResults(det, {
//             width: c.width,
//             height: c.height,
//           });
//           faceapi.draw.drawDetections(c, resized);
//           faceapi.draw.drawFaceLandmarks(c, resized);

//           const lm = resized.landmarks;
//           const leftEye = lm.getLeftEye();
//           const rightEye = lm.getRightEye();
//           const nose = lm.getNose();

//           if (leftEye.length === 6 && rightEye.length === 6 && nose.length > 3) {
//             const leftEAR = ear(leftEye);
//             const rightEAR = ear(rightEye);

//             const leftCenter = center(leftEye);
//             const rightCenter = center(rightEye);
//             const eyesCenter = {
//               x: (leftCenter.x + rightCenter.x) / 2,
//               y: (leftCenter.y + rightCenter.y) / 2,
//             };
//             const interEye = dist(leftCenter, rightCenter);
//             const noseTip = nose[3];
//             const yawMetric =
//               Math.abs(noseTip.x - eyesCenter.x) / Math.max(interEye, 1);

//             const eyesOpen = leftEAR > EAR_THRESHOLD && rightEAR > EAR_THRESHOLD;
//             const facingForward = yawMetric < YAW_THRESHOLD;

//             shouldPlay = eyesOpen && facingForward;
//           }
//         }
//       } catch (e) {
//         console.error(e);
//       }

//       if (player) {
//         if (shouldPlay && lastState !== true) {
//           try {
//             await player.play();
//             setIsPlaying(true);
//           } catch (err) {
//             console.warn("Autoplay blocked, user must click play once:", err);
//           }
//           lastState = true;
//         } else if (!shouldPlay && lastState !== false) {
//           player.pause();
//           setIsPlaying(false);
//           lastState = false;
//         }
//       }

//       rafId = requestAnimationFrame(run);
//     };

//     rafId = requestAnimationFrame(run);
//     return () => {
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, [modelsLoaded, detectionActive]);

//   const toggleDetection = () => {
//     setDetectionActive(!detectionActive);
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       padding: '20px',
//       fontFamily: "'Poppins', sans-serif",
//       color: 'white',
//       overflow: 'hidden'
//     }}>
//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto',
//         background: 'rgba(255, 255, 255, 0.08)',
//         backdropFilter: 'blur(12px)',
//         borderRadius: '24px',
//         padding: '40px 30px',
//         boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
//         border: '1px solid rgba(255, 255, 255, 0.15)',
//         overflow: 'hidden'
//       }}>
//         <div style={{
//           textAlign: 'center',
//           marginBottom: '40px',
//           animation: 'fadeIn 0.8s ease-out'
//         }}>
//           <h1 style={{
//             fontSize: '2.8rem',
//             fontWeight: '800',
//             marginBottom: '12px',
//             background: 'linear-gradient(45deg, #fff, #c3cfe2)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             textShadow: '0 4px 8px rgba(0,0,0,0.1)'
//           }}>
//             Smart Video Player
//           </h1>

//         </div>

//         <div style={{
//           display: 'flex',
//           justifyContent: 'center',
//           gap: '40px',
//           alignItems: 'flex-start',
//           flexWrap: 'wrap'
//         }}>
//           {/* Video Player Section */}
//           <div style={{
//             flex: '1',
//             minWidth: '400px',
//             maxWidth: '500px',
//             position: 'relative',
//             borderRadius: '20px',
//             overflow: 'hidden',
//             boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
//             transform: 'perspective(1000px)',
//             transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//             height: '380px'
//           }} className="media-container">
//             <video
//               ref={videoPlayerRef}
//               width="100%"
//               height="100%"
//               controls
//               muted
//               style={{
//                 display: 'block',
//                 objectFit: 'cover',
//                 borderRadius: '20px',
//                 backgroundColor: '#000'
//               }}
//             >
//               <source src="/ramayanam.mp4" type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
            
//             {/* Status indicator */}
//             <div style={{
//               position: 'absolute',
//               top: '15px',
//               right: '15px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               background: 'rgba(0, 0, 0, 0.5)',
//               padding: '8px 16px',
//               borderRadius: '20px',
//               backdropFilter: 'blur(5px)',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               animation: 'slideInRight 0.5s ease-out'
//             }}>
//               <div style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 background: detectionActive ? 
//                   (isPlaying ? '#4ade80' : '#f87171') : '#94a3b8',
//                 boxShadow: detectionActive ? 
//                   (isPlaying ? '0 0 10px #4ade80' : '0 0 10px #f87171') : 'none',
//                 animation: detectionActive ? 'pulse 2s infinite' : 'none'
//               }}></div>
//               <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
//                 {detectionActive ? (isPlaying ? 'Playing' : 'Paused') : 'Detection Off'}
//               </span>
//             </div>
//           </div>

//           {/* Webcam Section */}
//           <div style={{
//             flex: '1',
//             minWidth: '400px',
//             maxWidth: '400px',
//             position: 'relative',
//             borderRadius: '20px',
//             overflow: 'hidden',
//             boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
//             transform: 'perspective(1000px)',
//             transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//             background: 'rgba(0, 0, 0, 0.2)',
//             padding: '20px',
//             border: '1px solid rgba(255, 255, 255, 0.1)'
//           }}>
//             <div style={{
//               position: 'relative',
//               width: '100%',
//               height: '280px',
//               borderRadius: '16px',
//               overflow: 'hidden',
//               boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
//             }}>
//               <video
//                 ref={webcamRef}
//                 autoPlay
//                 muted
//                 playsInline
//                 width="100%"
//                 height="100%"
//                 style={{
//                   position: 'absolute',
//                   objectFit: 'cover',
//                   borderRadius: '16px'
//                 }}
//               />
//               <canvas
//                 ref={canvasRef}
//                 width="400"
//                 height="280"
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   zIndex: 1,
//                   borderRadius: '16px'
//                 }}
//               />
//             </div>
            
//             {/* Detection toggle button */}
//             <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               marginTop: '25px'
//             }}>
//               <button
//                 onClick={toggleDetection}
//                 style={{
//                   background: detectionActive ? 
//                     'linear-gradient(45deg, #ef4444, #dc2626)' : 
//                     'linear-gradient(45deg, #10b981, #059669)',
//                   border: 'none',
//                   borderRadius: '50px',
//                   padding: '12px 30px',
//                   color: 'white',
//                   fontWeight: '600',
//                   cursor: 'pointer',
//                   boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
//                   transition: 'all 0.3s ease',
//                   zIndex: 2,
//                   fontSize: '1rem',
//                   letterSpacing: '0.5px',
//                   position: 'relative',
//                   overflow: 'hidden'
//                 }}
//                 onMouseOver={(e) => {
//                   e.target.style.transform = 'translateY(-2px)';
//                   e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
//                 }}
//                 onMouseOut={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
//                 }}
//               >
//                 {detectionActive ? 'Pause Detection' : 'Resume Detection'}
//                 <span style={{
//                   position: 'absolute',
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   borderRadius: '50%',
//                   transform: 'scale(0)',
//                   animation: 'ripple 0.6s linear',
//                   pointerEvents: 'none'
//                 }}></span>
//               </button>
//             </div>

//             {/* Status indicators for webcam */}
//             <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               marginTop: '20px',
//               gap: '15px'
//             }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 background: 'rgba(255, 255, 255, 0.1)',
//                 padding: '8px 15px',
//                 borderRadius: '20px',
//                 backdropFilter: 'blur(5px)',
//                 border: '1px solid rgba(255, 255, 255, 0.05)'
//               }}>
//                 <div style={{
//                   width: '12px',
//                   height: '12px',
//                   borderRadius: '50%',
//                   background: modelsLoaded ? '#10b981' : '#f59e0b',
//                   boxShadow: modelsLoaded ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
//                   animation: modelsLoaded ? 'pulse 2s infinite' : 'none'
//                 }}></div>
//                 <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
//                   {modelsLoaded ? 'Model Loaded' : 'Loading Model'}
//                 </span>
//               </div>
              
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 background: 'rgba(255, 255, 255, 0.1)',
//                 padding: '8px 15px',
//                 borderRadius: '20px',
//                 backdropFilter: 'blur(5px)',
//                 border: '1px solid rgba(255, 255, 255, 0.05)'
//               }}>
//                 <div style={{
//                   width: '12px',
//                   height: '12px',
//                   borderRadius: '50%',
//                   background: detectionActive ? '#10b981' : '#94a3b8',
//                   boxShadow: detectionActive ? '0 0 8px #10b981' : 'none'
//                 }}></div>
//                 <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
//                   {detectionActive ? 'Detection On' : 'Detection Off'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status cards */}
//         <div style={{
//           display: 'flex',
//           gap: '20px',
//           flexWrap: 'wrap',
//           justifyContent: 'center',
//           marginTop: '50px'
//         }}>
//           <div style={{
//             background: 'rgba(255, 255, 255, 0.08)',
//             padding: '20px',
//             borderRadius: '16px',
//             minWidth: '200px',
//             textAlign: 'center',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             transition: 'all 0.3s ease',
//             animation: 'fadeInUp 0.6s 0.2s both'
//           }} onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'translateY(-5px)';
//             e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
//           }} onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'translateY(0)';
//             e.currentTarget.style.boxShadow = 'none';
//           }}>
//             <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600' }}>Face Detection</h3>
//             <div style={{
//               width: '100%',
//               height: '8px',
//               background: 'rgba(255, 255, 255, 0.15)',
//               borderRadius: '4px',
//               overflow: 'hidden',
//               marginBottom: '12px'
//             }}>
//               <div style={{
//                 width: modelsLoaded ? '100%' : '30%',
//                 height: '100%',
//                 background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
//                 borderRadius: '4px',
//                 transition: 'width 1s ease',
//                 boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
//                 animation: modelsLoaded ? 'pulse 2s infinite' : 'none'
//               }}></div>
//             </div>
//             <p style={{ margin: '0', fontSize: '0.9rem', opacity: '0.9' }}>
//               {modelsLoaded ? 'Active' : 'Loading...'}
//             </p>
//           </div>

//           <div style={{
//             background: 'rgba(255, 255, 255, 0.08)',
//             padding: '20px',
//             borderRadius: '16px',
//             minWidth: '200px',
//             textAlign: 'center',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             transition: 'all 0.3s ease',
//             animation: 'fadeInUp 0.6s 0.4s both'
//           }} onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'translateY(-5px)';
//             e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
//           }} onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'translateY(0)';
//             e.currentTarget.style.boxShadow = 'none';
//           }}>
//             <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600' }}>Eye Contact</h3>
//             <div style={{
//               width: '100%',
//               height: '8px',
//               background: 'rgba(255, 255, 255, 0.15)',
//               borderRadius: '4px',
//               overflow: 'hidden',
//               marginBottom: '12px'
//             }}>
//               <div style={{
//                 width: detectionActive ? '100%' : '0%',
//                 height: '100%',
//                 background: 'linear-gradient(90deg, #10b981, #22c55e)',
//                 borderRadius: '4px',
//                 transition: 'width 0.5s ease',
//                 boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
//                 animation: detectionActive ? 'pulse 2s infinite' : 'none'
//               }}></div>
//             </div>
//             <p style={{ margin: '0', fontSize: '0.9rem', opacity: '0.9' }}>
//               {detectionActive ? 'Monitoring' : 'Paused'}
//             </p>
//           </div>
          
//           <div style={{
//             background: 'rgba(255, 255, 255, 0.08)',
//             padding: '20px',
//             borderRadius: '16px',
//             minWidth: '200px',
//             textAlign: 'center',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             transition: 'all 0.3s ease',
//             animation: 'fadeInUp 0.6s 0.6s both'
//           }} onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'translateY(-5px)';
//             e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
//           }} onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'translateY(0)';
//             e.currentTarget.style.boxShadow = 'none';
//           }}>
//             <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600' }}>Video Status</h3>
//             <div style={{
//               width: '100%',
//               height: '8px',
//               background: 'rgba(255, 255, 255, 0.15)',
//               borderRadius: '4px',
//               overflow: 'hidden',
//               marginBottom: '12px'
//             }}>
//               <div style={{
//                 width: isPlaying ? '100%' : '0%',
//                 height: '100%',
//                 background: 'linear-gradient(90deg, #ec4899, #db2777)',
//                 borderRadius: '4px',
//                 transition: 'width 0.5s ease',
//                 boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
//                 animation: isPlaying ? 'pulse 2s infinite' : 'none'
//               }}></div>
//             </div>
//             <p style={{ margin: '0', fontSize: '0.9rem', opacity: '0.9' }}>
//               {isPlaying ? 'Playing' : 'Paused'}
//             </p>
//           </div>
//         </div>

//       </div>

//       {/* Global styles */}
//       <style>
//         {`
//           @keyframes pulse {
//             0% { opacity: 1; }
//             50% { opacity: 0.7; }
//             100% { opacity: 1; }
//           }
          
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(20px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           @keyframes fadeInUp {
//             from { opacity: 0; transform: translateY(30px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           @keyframes slideInRight {
//             from { opacity: 0; transform: translateX(20px); }
//             to { opacity: 1; transform: translateX(0); }
//           }
          
//           @keyframes ripple {
//             to {
//               transform: scale(2.5);
//               opacity: 0;
//             }
//           }
          
//           body {
//             margin: 0;
//             font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             min-height: 100vh;
//             overflow: hidden;
//           }
          
//           * {
//             box-sizing: border-box;
//           }
          
//           @media (max-width: 900px) {
//             .media-container {
//               flex-direction: column;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default SmartVideoPlayer;











// for mobile responsiveness

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";

function SmartVideoPlayer() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectionActive, setDetectionActive] = useState(true);

  // Helper functions
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const center = (pts) => {
    const s = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
      x: 0,
      y: 0,
    });
    return { x: s.x / pts.length, y: s.y / pts.length };
  };
  const ear = (eye) => {
    const [p1, p2, p3, p4, p5, p6] = eye;
    const v1 = dist(p2, p6);
    const v2 = dist(p3, p5);
    const h = dist(p1, p4);
    return (v1 + v2) / (2.0 * h);
  };

  // Load models + webcam
  useEffect(() => {
    const load = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam error:", err);
      }
    };
    load();
  }, []);

  // Detection loop
  useEffect(() => {
    if (!modelsLoaded || !detectionActive) return;
    let rafId = null;
    const EAR_THRESHOLD = 0.20;
    const YAW_THRESHOLD = 0.45;
    let lastState = null;

    const run = async () => {
      const v = webcamRef.current;
      const c = canvasRef.current;
      const player = videoPlayerRef.current;
      if (!v || !c || v.readyState < 2) {
        rafId = requestAnimationFrame(run);
        return;
      }

      const ctx = c.getContext("2d");
      const opts = new faceapi.TinyFaceDetectorOptions({
        inputSize: 256,
        scoreThreshold: 0.5,
      });

      let shouldPlay = false;

      try {
        const det = await faceapi
          .detectSingleFace(v, opts)
          .withFaceLandmarks(true);

        ctx.clearRect(0, 0, c.width, c.height);

        if (det) {
          const resized = faceapi.resizeResults(det, {
            width: c.width,
            height: c.height,
          });
          faceapi.draw.drawDetections(c, resized);
          faceapi.draw.drawFaceLandmarks(c, resized);

          const lm = resized.landmarks;
          const leftEye = lm.getLeftEye();
          const rightEye = lm.getRightEye();
          const nose = lm.getNose();

          if (leftEye.length === 6 && rightEye.length === 6 && nose.length > 3) {
            const leftEAR = ear(leftEye);
            const rightEAR = ear(rightEye);

            const leftCenter = center(leftEye);
            const rightCenter = center(rightEye);
            const eyesCenter = {
              x: (leftCenter.x + rightCenter.x) / 2,
              y: (leftCenter.y + rightCenter.y) / 2,
            };
            const interEye = dist(leftCenter, rightCenter);
            const noseTip = nose[3];
            const yawMetric =
              Math.abs(noseTip.x - eyesCenter.x) / Math.max(interEye, 1);

            const eyesOpen = leftEAR > EAR_THRESHOLD && rightEAR > EAR_THRESHOLD;
            const facingForward = yawMetric < YAW_THRESHOLD;

            shouldPlay = eyesOpen && facingForward;
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (player) {
        if (shouldPlay && lastState !== true) {
          try {
            await player.play();
            setIsPlaying(true);
          } catch (err) {
            console.warn("Autoplay blocked, user must click play once:", err);
          }
          lastState = true;
        } else if (!shouldPlay && lastState !== false) {
          player.pause();
          setIsPlaying(false);
          lastState = false;
        }
      }

      rafId = requestAnimationFrame(run);
    };

    rafId = requestAnimationFrame(run);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [modelsLoaded, detectionActive]);

  const toggleDetection = () => {
    setDetectionActive(!detectionActive);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '10px',
      fontFamily: "'Poppins', sans-serif",
      color: 'white',
      overflowX: 'hidden',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '20px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        minHeight: 'calc(100vh - 20px)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: '800',
            marginBottom: '12px',
            background: 'linear-gradient(45deg, #fff, #c3cfe2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '0 10px'
          }}>
            Smart Video Player
          </h1>
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          alignItems: 'flex-start',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          marginBottom: '30px'
        }}>
          {/* Video Player Section */}
          <div style={{
            flex: '1',
            width: '100%',
            maxWidth: window.innerWidth <= 768 ? '100%' : '500px',
            minWidth: window.innerWidth <= 768 ? '100%' : '400px',
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            transform: 'perspective(1000px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            height: window.innerWidth <= 768 ? '250px' : '380px',
            marginBottom: window.innerWidth <= 768 ? '20px' : '0'
          }}>
            <video
              ref={videoPlayerRef}
              width="100%"
              height="100%"
              controls
              muted
              style={{
                display: 'block',
                objectFit: 'cover',
                borderRadius: '20px',
                backgroundColor: '#000'
              }}
            >
              <source src="/ramayanam.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Status indicator */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: window.innerWidth <= 768 ? '6px 12px' : '8px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'slideInRight 0.5s ease-out',
              fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.9rem'
            }}>
              <div style={{
                width: window.innerWidth <= 768 ? '10px' : '12px',
                height: window.innerWidth <= 768 ? '10px' : '12px',
                borderRadius: '50%',
                background: detectionActive ? 
                  (isPlaying ? '#4ade80' : '#f87171') : '#94a3b8',
                boxShadow: detectionActive ? 
                  (isPlaying ? '0 0 10px #4ade80' : '0 0 10px #f87171') : 'none',
                animation: detectionActive ? 'pulse 2s infinite' : 'none'
              }}></div>
              <span style={{ fontWeight: '500' }}>
                {detectionActive ? (isPlaying ? 'Playing' : 'Paused') : 'Detection Off'}
              </span>
            </div>
          </div>

          {/* Webcam Section */}
          <div style={{
            flex: '1',
            width: '100%',
            maxWidth: window.innerWidth <= 768 ? '100%' : '400px',
            minWidth: window.innerWidth <= 768 ? '100%' : '400px',
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            transform: 'perspective(1000px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: window.innerWidth <= 768 ? '15px' : '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: window.innerWidth <= 768 ? '220px' : '280px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}>
              <video
                ref={webcamRef}
                autoPlay
                muted
                playsInline
                width="100%"
                height="100%"
                style={{
                  position: 'absolute',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
              />
              <canvas
                ref={canvasRef}
                width={window.innerWidth <= 768 ? "350" : "400"}
                height={window.innerWidth <= 768 ? "220" : "280"}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  borderRadius: '16px',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            
            {/* Detection toggle button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: window.innerWidth <= 768 ? '15px' : '25px'
            }}>
              <button
                onClick={toggleDetection}
                style={{
                  background: detectionActive ? 
                    'linear-gradient(45deg, #ef4444, #dc2626)' : 
                    'linear-gradient(45deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: window.innerWidth <= 768 ? '10px 25px' : '12px 30px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                  fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
                  letterSpacing: '0.5px',
                  position: 'relative',
                  overflow: 'hidden',
                  touchAction: 'manipulation'
                }}
                onMouseOver={(e) => {
                  if (window.innerWidth > 768) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (window.innerWidth > 768) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                  }
                }}
              >
                {detectionActive ? 'Pause Detection' : 'Resume Detection'}
              </button>
            </div>

            {/* Status indicators for webcam */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: window.innerWidth <= 768 ? '15px' : '20px',
              gap: window.innerWidth <= 768 ? '10px' : '15px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: window.innerWidth <= 768 ? '6px 12px' : '8px 15px',
                borderRadius: '20px',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.85rem'
              }}>
                <div style={{
                  width: window.innerWidth <= 768 ? '10px' : '12px',
                  height: window.innerWidth <= 768 ? '10px' : '12px',
                  borderRadius: '50%',
                  background: modelsLoaded ? '#10b981' : '#f59e0b',
                  boxShadow: modelsLoaded ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
                  animation: modelsLoaded ? 'pulse 2s infinite' : 'none'
                }}></div>
                <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                  {modelsLoaded ? 'Model Loaded' : 'Loading Model'}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: window.innerWidth <= 768 ? '6px 12px' : '8px 15px',
                borderRadius: '20px',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.85rem'
              }}>
                <div style={{
                  width: window.innerWidth <= 768 ? '10px' : '12px',
                  height: window.innerWidth <= 768 ? '10px' : '12px',
                  borderRadius: '50%',
                  background: detectionActive ? '#10b981' : '#94a3b8',
                  boxShadow: detectionActive ? '0 0 8px #10b981' : 'none'
                }}></div>
                <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                  {detectionActive ? 'Detection On' : 'Detection Off'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : 
                              window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 
                              'repeat(3, 1fr)',
          gap: window.innerWidth <= 768 ? '15px' : '20px',
          marginTop: window.innerWidth <= 768 ? '30px' : '50px',
          padding: '0 10px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: window.innerWidth <= 768 ? '15px' : '20px',
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.6s 0.2s both',
            minHeight: window.innerWidth <= 768 ? 'auto' : '120px'
          }} onMouseEnter={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }
          }} onMouseLeave={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem', 
              fontWeight: '600' 
            }}>Face Detection</h3>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: modelsLoaded ? '100%' : '30%',
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                borderRadius: '4px',
                transition: 'width 1s ease',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                animation: modelsLoaded ? 'pulse 2s infinite' : 'none'
              }}></div>
            </div>
            <p style={{ 
              margin: '0', 
              fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem', 
              opacity: '0.9' 
            }}>
              {modelsLoaded ? 'Active' : 'Loading...'}
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: window.innerWidth <= 768 ? '15px' : '20px',
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.6s 0.4s both',
            minHeight: window.innerWidth <= 768 ? 'auto' : '120px'
          }} onMouseEnter={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }
          }} onMouseLeave={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem', 
              fontWeight: '600' 
            }}>Eye Contact</h3>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: detectionActive ? '100%' : '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #22c55e)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                animation: detectionActive ? 'pulse 2s infinite' : 'none'
              }}></div>
            </div>
            <p style={{ 
              margin: '0', 
              fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem', 
              opacity: '0.9' 
            }}>
              {detectionActive ? 'Monitoring' : 'Paused'}
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: window.innerWidth <= 768 ? '15px' : '20px',
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.6s 0.6s both',
            minHeight: window.innerWidth <= 768 ? 'auto' : '120px',
            gridColumn: window.innerWidth <= 480 ? '1' : 
                       window.innerWidth <= 768 ? 'span 2' : '3'
          }} onMouseEnter={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }
          }} onMouseLeave={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem', 
              fontWeight: '600' 
            }}>Video Status</h3>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: isPlaying ? '100%' : '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #ec4899, #db2777)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
                animation: isPlaying ? 'pulse 2s infinite' : 'none'
              }}></div>
            </div>
            <p style={{ 
              margin: '0', 
              fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem', 
              opacity: '0.9' 
            }}>
              {isPlaying ? 'Playing' : 'Paused'}
            </p>
          </div>
        </div>

      </div>

      {/* Global styles with responsive media queries */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes ripple {
            to {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          
          body {
            margin: 0;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          * {
            box-sizing: border-box;
          }
          
          /* Mobile styles */
          @media (max-width: 768px) {
            body {
              font-size: 14px;
            }
            
            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
              -webkit-overflow-scrolling: touch;
            }
            
            /* Better touch targets */
            button {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Prevent horizontal scroll */
            * {
              max-width: 100%;
            }
          }
          
          /* Tablet styles */
          @media (min-width: 769px) and (max-width: 1024px) {
            body {
              font-size: 15px;
            }
          }
          
          /* Desktop styles */
          @media (min-width: 1025px) {
            body {
              font-size: 16px;
            }
          }
          
          /* High-DPI displays */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            canvas {
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
          }
          
          /* Landscape orientation on mobile */
          @media (max-width: 768px) and (orientation: landscape) {
            .main-content {
              flex-direction: row;
              height: 90vh;
            }
          }
          
          /* Accessibility improvements */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            body {
              background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            }
          }
          
          /* Print styles */
          @media print {
            video, canvas {
              display: none;
            }
            
            .no-print {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default SmartVideoPlayer;



























