


import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

const FaceExpressions = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [expressions, setExpressions] = useState([]);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [dominantExpression, setDominantExpression] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasEyeContact, setHasEyeContact] = useState(false);

  // Container styles
  const containerStyle = {
    fontFamily: "'Poppins', sans-serif",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "20px",
    color: "#2c3e50",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    overflow: "auto",
    display: "flex",
    flexDirection: "column"
  };

  // Header styles
  const headerStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "white",
    fontSize: "2rem",
    fontWeight: "700",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
    flex: "0 0 auto"
  };

  // Main content area
  const contentStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    flex: "1",
    overflow: "auto",
    minHeight: "calc(100vh - 150px)"
  };

  // Card styles
  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
    height: "100%",
    overflow: "auto"
  };

  // Webcam container styles
  const webcamContainerStyle = {
    position: "relative",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    minWidth: "400px",
    maxWidth: "500px",
    height: "375px",
    flex: "1"
  };

  // Webcam video styles
  const webcamStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "15px",
    transform: "scaleX(-1)",
    display: "block",
    objectFit: "cover"
  };

  // Canvas styles
  const canvasStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "15px"
  };

  // Expressions panel styles
  const expressionsPanelStyle = {
    minWidth: "350px",
    maxWidth: "400px",
    height: "375px",
    flex: "1",
    display: "flex",
    flexDirection: "column"
  };

  // Button styles
  const buttonStyle = {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    display: "block",
    margin: "10px auto",
    width: "200px",
    flex: "0 0 auto"
  };

  // Expression badge styles
  const getBadgeStyle = (expression) => {
    const colorMap = {
      happy: "#27ae60",
      sad: "#3498db",
      angry: "#e74c3c",
      fearful: "#9b59b6",
      disgusted: "#f39c12",
      surprised: "#f1c40f",
      neutral: "#95a5a6"
    };
    return {
      display: "inline-block",
      padding: "10px 20px",
      borderRadius: "50px",
      background: `linear-gradient(45deg, ${colorMap[expression]}, ${colorMap[expression]}dd)`,
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      margin: "10px 0",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      animation: "pulse 2s infinite"
    };
  };

  // Expression bar styles
  const barContainerStyle = {
    backgroundColor: "#ecf0f1",
    borderRadius: "10px",
    height: "20px",
    margin: "8px 0",
    overflow: "hidden",
    position: "relative"
  };

  const getBarStyle = (expression, width) => {
    const colorMap = {
      happy: "#2ecc71",
      sad: "#3498db",
      angry: "#e74c3c",
      fearful: "#9b59b6",
      disgusted: "#f39c12",
      surprised: "#f1c40f",
      neutral: "#95a5a6"
    };
    return {
      height: "100%",
      width: `${width}%`,
      background: `linear-gradient(90deg, ${colorMap[expression]}, ${colorMap[expression]}aa)`,
      borderRadius: "10px",
      transition: "width 0.5s ease-in-out",
      boxShadow: `0 0 8px ${colorMap[expression]}`
    };
  };

  // Loading spinner styles
  const spinnerStyle = {
    border: "4px solid rgba(255, 255, 255, 0.3)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 1s linear infinite",
    margin: "20px auto"
  };

  // Error message styles
  const errorStyle = {
    background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    margin: "20px 0",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
  };

  // Eye contact indicator styles
  const eyeContactStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "8px 16px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    background: hasEyeContact
      ? "linear-gradient(45deg, #27ae60, #2ecc71)"
      : "linear-gradient(45deg, #e74c3c, #ee5a52)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
  };

  // Animation keyframes
  const keyframesStyle = `
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
      50% { transform: scale(1.05); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
      100% { transform: scale(1); boxShadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Starting model loading...');
        setLoadingStatus('Loading TensorFlow.js...');
        await tf.ready();
        await tf.setBackend('webgl');
        console.log('TensorFlow.js backend set to WebGL');
        setLoadingStatus('Loading BlazeFace model...');
        const model = await blazeface.load();
        console.log('BlazeFace model loaded successfully');
        setIsModelsLoaded(true);
        setLoadingStatus('Models loaded successfully');
        setIsDetecting(true);
      } catch (err) {
        const errorMessage = `Failed to load models: ${err.message}. Ensure WebGL is enabled and refresh the page.`;
        setError(errorMessage);
        console.error('Model loading error:', err);
      }
    };
    loadModels();
  }, []);

  // Face and eye contact detection
  useEffect(() => {
    if (!isModelsLoaded || !isDetecting || !webcamRef.current) {
      console.log('Detection skipped: Models not loaded or detection paused');
      return;
    }

    let model;
    const loadModel = async () => {
      try {
        model = await blazeface.load();
        console.log('BlazeFace model initialized for detection');
      } catch (err) {
        console.error('Error loading BlazeFace model for detection:', err);
        setError(`Error loading model for detection: ${err.message}`);
      }
    };
    loadModel();

    const detectFaces = async () => {
      if (!webcamRef.current?.video || !model) {
        console.log('Detection skipped: Webcam or model not ready');
        return;
      }

      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
        console.log('Webcam video not ready (readyState:', video.readyState, ')');
        return;
      }

      try {
        const predictions = await model.estimateFaces(video, false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
          let eyeContactDetected = false;
          predictions.forEach((prediction) => {
            const [x, y] = prediction.topLeft;
            const [bottomRightX, bottomRightY] = prediction.bottomRight;
            const width = bottomRightX - x;
            const height = bottomRightY - y;

            // Draw face bounding box
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw landmarks
            ctx.fillStyle = '#3498db';
            prediction.landmarks.forEach(([pointX, pointY]) => {
              ctx.beginPath();
              ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
              ctx.fill();
            });

            // Eye contact detection
            const landmarks = prediction.landmarks;
            const leftEye = landmarks[0]; // [x, y]
            const rightEye = landmarks[1];
            const nose = landmarks[2];

            const eyeDistance = Math.sqrt(
              Math.pow(rightEye[0] - leftEye[0], 2) +
              Math.pow(rightEye[1] - leftEye[1], 2)
            );
            const faceWidth = width;
            const eyeToFaceRatio = eyeDistance / faceWidth;
            const eyeMidpointX = (leftEye[0] + rightEye[0]) / 2;
            const noseDeviation = Math.abs(nose[0] - eyeMidpointX) / faceWidth;

            const isEyeDistanceValid = eyeToFaceRatio > 0.2 && eyeToFaceRatio < 0.4;
            const isFaceCentered = noseDeviation < 0.15;
            if (isEyeDistanceValid && isFaceCentered) {
              eyeContactDetected = true;
            }
          });

          setHasEyeContact(eyeContactDetected);
          if (eyeContactDetected) {
            // Simulate expression detection (replace with actual model in production)
            const expressionsList = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
            const randomExpression = expressionsList[Math.floor(Math.random() * expressionsList.length)];
            const probability = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
            
            const newDominantExpression = { expression: randomExpression, probability };
            
            // Only update if the expression has changed
            if (!dominantExpression || dominantExpression.expression !== newDominantExpression.expression) {
              setDominantExpression(newDominantExpression);
              
              // Add to history
              setDetectionHistory((prev) => [
                ...prev.slice(-4),
                {
                  timestamp: new Date().toLocaleTimeString(),
                  expression: newDominantExpression.expression,
                  probability: newDominantExpression.probability
                },
              ]);
              
              console.log('New expression detected:', newDominantExpression);
            }
          } else {
            setDominantExpression(null);
            console.log('No eye contact detected');
          }
        } else {
          setDominantExpression(null);
          setHasEyeContact(false);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          console.log('No faces detected');
        }
      } catch (err) {
        console.error('Detection error:', err);
        setError(`Detection error: ${err.message}. Ensure camera is working.`);
      }
    };

    const detectionInterval = setInterval(detectFaces, 100);
    return () => clearInterval(detectionInterval);
  }, [isModelsLoaded, isDetecting, dominantExpression]);

  // Set canvas size to match webcam
  useEffect(() => {
    const resizeCanvas = () => {
      if (webcamRef.current && canvasRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        canvasRef.current.width = video.videoWidth || 640;
        canvasRef.current.height = video.videoHeight || 480;
        console.log('Canvas resized to:', canvasRef.current.width, 'x', canvasRef.current.height);
      } else {
        console.log('Cannot resize canvas: Webcam not ready');
      }
    };

    resizeCanvas(); // Initial resize
    const interval = setInterval(resizeCanvas, 1000);
    return () => clearInterval(interval);
  }, []);

  const videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: "user"
  };

  const getExpressionIntensity = (probability) => {
    return Math.round(probability * 100);
  };

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    console.log('Detection toggled to:', !isDetecting);
  };

  return (
    <div style={containerStyle}>
      <style>{keyframesStyle}</style>
      <h1 style={headerStyle}>Facial Expression Detection</h1>
      {error ? (
        <div style={{ ...cardStyle, maxWidth: "800px", margin: "0 auto" }}>
          <div style={errorStyle}>
            <h3>Error Occurred</h3>
            <p>{error}</p>
            <div>
              <p>Possible solutions:</p>
              <ul>
                <li>Check your internet connection</li>
                <li>Ensure WebGL is enabled in your browser (e.g., Chrome/Firefox)</li>
                <li>Allow camera permissions</li>
                <li>Refresh the page</li>
                <li>Verify a webcam is connected</li>
              </ul>
            </div>
          </div>
        </div>
      ) : !isModelsLoaded ? (
        <div style={{ ...cardStyle, maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>{loadingStatus}</p>
          <div style={spinnerStyle}></div>
        </div>
      ) : (
        <>
          <div style={contentStyle}>
            {/* Webcam Panel */}
            <div style={webcamContainerStyle}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={webcamStyle}
                onUserMedia={() => console.log('Webcam access granted')}
                onUserMediaError={(err) => {
                  console.error('Webcam error:', err);
                  setError(`Webcam error: ${err.message}. Allow camera permissions and ensure a webcam is connected.`);
                }}
              />
              <canvas ref={canvasRef} style={canvasStyle} />
              <div style={eyeContactStyle}>
                {hasEyeContact ? "Eye Contact Detected" : "No Eye Contact"}
              </div>
            </div>
            {/* Expressions Panel */}
            <div style={expressionsPanelStyle}>
              <div style={cardStyle}>
                {dominantExpression && hasEyeContact ? (
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ marginBottom: '15px', color: '#2c3e50' }}>Current Expression</h2>
                    <div style={getBadgeStyle(dominantExpression.expression)}>
                      {dominantExpression.expression}
                      <span style={{ marginLeft: '10px', fontSize: '14px', opacity: '0.9' }}>
                        {getExpressionIntensity(dominantExpression.probability)}%
                      </span>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>Confidence</span>
                        <span style={{ fontWeight: 'bold' }}>{getExpressionIntensity(dominantExpression.probability)}%</span>
                      </div>
                      <div style={barContainerStyle}>
                        <div style={getBarStyle(dominantExpression.expression, getExpressionIntensity(dominantExpression.probability))}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', marginBottom: '20px', color: '#7f8c8d' }}>
                    {hasEyeContact ? "No face detected" : "Please look at the camera"}
                  </div>
                )}
              </div>
            </div>
            {/* History Panel */}
            <div style={{ minWidth: "300px", maxWidth: "350px", height: "375px", flex: "1" }}>
              <div style={cardStyle}>
                <h3 style={{ marginBottom: '15px', color: '#2c3e50', textAlign: 'center' }}>
                  Expression History
                </h3>
                <div>
                  {detectionHistory.length > 0 ? (
                    detectionHistory.slice().reverse().map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          background: "linear-gradient(45deg, #f8f9fa, #e9ecef)",
                          padding: "12px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                          marginBottom: "12px",
                          animation: "fadeIn 0.5s ease-out"
                        }}
                      >
                        <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '8px', fontWeight: '500' }}>
                          {entry.timestamp}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{entry.expression}</span>
                          <span style={{ fontWeight: 'bold' }}>
                            {getExpressionIntensity(entry.probability)}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                      No expression history
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            style={{ ...buttonStyle, opacity: isDetecting ? 1 : 0.7 }}
            onClick={toggleDetection}
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            {isDetecting ? 'Pause Detection' : 'Resume Detection'}
          </button>
        </>
      )}
    </div>
  );
};

export default FaceExpressions;








// mobie responsiveness





