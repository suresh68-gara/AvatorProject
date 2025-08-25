

import React, { useEffect, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';

function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      console.log('Models loaded');

      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Camera error:', err));
    };

    loadModels();
  }, []);

  useEffect(() => {
    let interval;

    const detect = async () => {
      if (
        !videoRef.current ||
        videoRef.current.readyState !== 4 ||
        !canvasRef.current
      )
        return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    };

    interval = setInterval(detect, 300); // 300ms detection interval

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Face Detection</h2>
      <div style={{ position: 'relative', width: '500px', height: '375px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="500"
          height="375"
          style={{ border: '1px solid black' }}
          onLoadedMetadata={() => {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }}
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

export default FaceDetection;

