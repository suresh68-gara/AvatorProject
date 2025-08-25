import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

function SmartVideoPlayer() {
  const webcamRef = useRef(null); // Webcam for face detection
  const canvasRef = useRef(null); // Canvas for drawing detection box
  const videoPlayerRef = useRef(null); // Main video player

  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load Face API models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      startWebcam();
    };

    const startWebcam = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Webcam error:', err));
    };

    loadModels();
  }, []);

  // Face Detection and Video Control
  useEffect(() => {
    if (!modelsLoaded) return;

    const detectFace = async () => {
      if (!webcamRef.current || webcamRef.current.readyState !== 4) return;

      const video = webcamRef.current;
      const canvas = canvasRef.current;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      // Control video playback based on detection
      if (videoPlayerRef.current) {
        if (detections.length > 0) {
          videoPlayerRef.current.play();
        } else {
          videoPlayerRef.current.pause();
        }
      }
    };

    const interval = setInterval(detectFace, 500);
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div>
      <h2>Smart Video Player (Pause if student looks away)</h2>

      {/* Video being played */}
      <video
        ref={videoPlayerRef}
        width="400"
        controls
        style={{ marginBottom: '20px', border: '2px solid green' }}
      >
        <source src="/ramayanam.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Webcam feed for face detection */}
      <div style={{ position: 'relative', width: 400, height: 300 }}>
        <video
          ref={webcamRef}
          autoPlay
          muted
          width="400"
          height="300"
          style={{ position: 'absolute', border: '1px solid black' }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

export default SmartVideoPlayer;
