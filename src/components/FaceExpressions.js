
// // import React, { useRef, useState, useEffect } from 'react';
// // import Webcam from 'react-webcam';
// // import * as faceapi from 'face-api.js';

// // const FaceExpressions = () => {
// //     const webcamRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const [detections, setDetections] = useState([]);
// //     const [capturedImages, setCapturedImages] = useState([]);
// //     const [isModelsLoaded, setIsModelsLoaded] = useState(false);
// //     const [capturedFaces, setCapturedFaces] = useState(new Set());
// //     const [isDetecting, setIsDetecting] = useState(false);

// //     // Load models
// //     useEffect(() => {
// //         const loadModels = async () => {
// //             try {
// //                 await Promise.all([
// //                     faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
// //                     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
// //                     faceapi.nets.faceExpressionNet.loadFromUri('/models')
// //                 ]);
// //                 setIsModelsLoaded(true);
// //             } catch (error) {
// //                 console.error("Error loading models:", error);
// //             }
// //         };
// //         loadModels();

// //         return () => {
// //             // Cleanup
// //             setIsModelsLoaded(false);
// //             setDetections([]);
// //         };
// //     }, []);

// //     // Real-time multi-face detection and drawing
// //     useEffect(() => {
// //         if (!isModelsLoaded || isDetecting || !webcamRef.current) return;

// //         const detectFaces = async () => {
// //             setIsDetecting(true);
// //             try {
// //                 if (webcamRef.current.video.readyState !== 4) {
// //                     setIsDetecting(false);
// //                     return;
// //                 }

// //                 const video = webcamRef.current.video;
// //                 const detections = await faceapi.detectAllFaces(
// //                     video,
// //                     new faceapi.TinyFaceDetectorOptions()
// //                 ).withFaceLandmarks().withFaceExpressions();

// //                 // Validate detections before setting state
// //                 const validDetections = detections.filter(det =>
// //                     det.detection &&
// //                     det.detection.box &&
// //                     typeof det.detection.box.x === 'number' &&
// //                     typeof det.detection.box.y === 'number' &&
// //                     typeof det.detection.box.width === 'number' &&
// //                     typeof det.detection.box.height === 'number'
// //                 );

// //                 setDetections(validDetections);

// //                 // Auto-capture new faces with strong expressions
// //                 validDetections.forEach((detection, index) => {
// //                     const expressions = detection.expressions.asSortedArray();
// //                     if (expressions.length > 0) {
// //                         const dominantExpression = expressions[0];
// //                         if (dominantExpression.probability > 0.8 && !capturedFaces.has(index)) {
// //                             handleCapture(index, dominantExpression.expression);
// //                             setCapturedFaces(prev => new Set(prev).add(index));
// //                         }
// //                     }
// //                 });

// //                 // Draw face boxes and expressions
// //                 if (canvasRef.current && validDetections.length > 0) {
// //                     const displaySize = {
// //                         width: video.videoWidth,
// //                         height: video.videoHeight
// //                     };

// //                     faceapi.matchDimensions(canvasRef.current, displaySize);
// //                     const resizedDetections = faceapi.resizeResults(validDetections, displaySize);

// //                     const ctx = canvasRef.current.getContext('2d');
// //                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

// //                     faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
// //                     faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
// //                 }
// //             } catch (error) {
// //                 console.error("Detection error:", error);
// //             } finally {
// //                 setIsDetecting(false);
// //             }
// //         };

// //         const interval = setInterval(detectFaces, 500);
// //         return () => {
// //             clearInterval(interval);
// //             setIsDetecting(false);
// //         };
// //     }, [isModelsLoaded, capturedFaces, isDetecting]);

// //     const handleCapture = (faceIndex, expression) => {
// //         try {
// //             const imageSrc = webcamRef.current.getScreenshot();
// //             setCapturedImages(prev => [
// //                 ...prev,
// //                 {
// //                     image: imageSrc,
// //                     expression,
// //                     timestamp: new Date().toLocaleString(),
// //                     faceId: faceIndex
// //                 }
// //             ]);
// //         } catch (error) {
// //             console.error("Capture error:", error);
// //         }
// //     };

// //     const videoConstraints = {
// //         width: { ideal: 1280 },
// //         height: { ideal: 720 },
// //         facingMode: "user"
// //     };

// //     return (
// //         <div style={{
// //             maxWidth: '1200px',
// //             margin: '0 auto',
// //             padding: '20px',
// //             fontFamily: 'Arial, sans-serif'
// //         }}>
// //             <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
// //                 Multi-Person Facial Expression Detection
// //             </h2>

// //             <div style={{
// //                 position: 'relative',
// //                 marginBottom: '30px',
// //                 borderRadius: '8px',
// //                 overflow: 'hidden',
// //                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
// //             }}>
// //                 <Webcam
// //                     ref={webcamRef}
// //                     audio={false}
// //                     screenshotFormat="image/jpeg"
// //                     videoConstraints={videoConstraints}
// //                     style={{
// //                         width: '100%',
// //                         display: 'block',
// //                         transform: 'scaleX(-1)' // Mirror the video
// //                     }}
// //                 />
// //                 <canvas
// //                     ref={canvasRef}
// //                     style={{
// //                         position: 'absolute',
// //                         top: 0,
// //                         left: 0,
// //                         width: '100%',
// //                         height: '100%',
// //                         pointerEvents: 'none'
// //                     }}
// //                 />

// //                 {detections.length > 0 && (
// //                     <div style={{
// //                         position: 'absolute',
// //                         top: '10px',
// //                         left: '10px',
// //                         backgroundColor: 'rgba(0,0,0,0.7)',
// //                         color: 'white',
// //                         padding: '8px 12px',
// //                         borderRadius: '4px',
// //                         fontSize: '14px',
// //                         zIndex: 2
// //                     }}>
// //                         Detected: {detections.length} face(s)
// //                     </div>
// //                 )}
// //             </div>

// //             {/* <div>
// //                 <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
// //                     Captured Expressions ({capturedImages.length})
// //                 </h3>
// //                 {capturedImages.length > 0 ? (
// //                     <div style={{
// //                         display: 'grid',
// //                         gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
// //                         gap: '15px',
// //                         marginTop: '20px'
// //                     }}>
// //                         {capturedImages.map((item, index) => (
// //                             <div key={index} style={{
// //                                 border: '1px solid #e0e0e0',
// //                                 borderRadius: '8px',
// //                                 padding: '12px',
// //                                 backgroundColor: '#fff',
// //                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
// //                                 transition: 'transform 0.2s',
// //                                 ':hover': {
// //                                     transform: 'translateY(-2px)'
// //                                 }
// //                             }}>
// //                                 <img
// //                                     src={item.image}
// //                                     alt={`Face ${item.faceId}`}
// //                                     style={{
// //                                         width: '100%',
// //                                         borderRadius: '4px',
// //                                         marginBottom: '10px',
// //                                         border: '1px solid #eee'
// //                                     }}
// //                                 />
// //                                 <div>
// //                                     <div style={{
// //                                         fontWeight: 'bold',
// //                                         marginBottom: '4px',
// //                                         color: '#3498db'
// //                                     }}>
// //                                         Face {item.faceId + 1}: {item.expression}
// //                                     </div>
// //                                     <div style={{
// //                                         fontSize: '0.8em',
// //                                         color: '#7f8c8d',
// //                                     }}>
// //                                         {item.timestamp}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 ) : (
// //                     <div style={{
// //                         padding: '20px',
// //                         textAlign: 'center',
// //                         color: '#7f8c8d',
// //                         backgroundColor: '#f8f9fa',
// //                         borderRadius: '8px'
// //                     }}>
// //                         No expressions captured yet. Show your face to the camera!
// //                     </div>
// //                 )}
// //             </div> */}
// //         </div>
// //     );
// // };

// // export default FaceExpressions;


// // import React, { useRef, useState, useEffect } from 'react';
// // import Webcam from 'react-webcam';
// // import * as faceapi from 'face-api.js';

// // const FaceExpressions = () => {
// //     const webcamRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const [detections, setDetections] = useState([]);
// //     const [capturedImages, setCapturedImages] = useState([]);
// //     const [isModelsLoaded, setIsModelsLoaded] = useState(false);
// //     const [capturedFaces, setCapturedFaces] = useState(new Set());
// //     const [isDetecting, setIsDetecting] = useState(false);

// //     // Load models
// //     useEffect(() => {
// //         const loadModels = async () => {
// //             try {
// //                 await Promise.all([
// //                     faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
// //                     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
// //                     faceapi.nets.faceExpressionNet.loadFromUri('/models')
// //                 ]);
// //                 setIsModelsLoaded(true);
// //             } catch (error) {
// //                 console.error("Error loading models:", error);
// //             }
// //         };
// //         loadModels();

// //         return () => {
// //             setIsModelsLoaded(false);
// //             setDetections([]);
// //         };
// //     }, []);

// //     // Real-time multi-face detection and drawing
// //     useEffect(() => {
// //         if (!isModelsLoaded || isDetecting || !webcamRef.current) return;

// //         const detectFaces = async () => {
// //             setIsDetecting(true);
// //             try {
// //                 if (webcamRef.current.video.readyState !== 4) {
// //                     setIsDetecting(false);
// //                     return;
// //                 }

// //                 const video = webcamRef.current.video;
// //                 const detections = await faceapi.detectAllFaces(
// //                     video,
// //                     new faceapi.TinyFaceDetectorOptions()
// //                 ).withFaceLandmarks().withFaceExpressions();

// //                 const validDetections = detections.filter(det =>
// //                     det.detection &&
// //                     det.detection.box &&
// //                     typeof det.detection.box.x === 'number' &&
// //                     typeof det.detection.box.y === 'number' &&
// //                     typeof det.detection.box.width === 'number' &&
// //                     typeof det.detection.box.height === 'number'
// //                 );

// //                 setDetections(validDetections);

// //                 validDetections.forEach((detection, index) => {
// //                     const expressions = detection.expressions.asSortedArray();
// //                     if (expressions.length > 0) {
// //                         const dominantExpression = expressions[0];
// //                         if (dominantExpression.probability > 0.8 && !capturedFaces.has(index)) {
// //                             handleCapture(index, dominantExpression.expression);
// //                             setCapturedFaces(prev => new Set(prev).add(index));
// //                         }
// //                     }
// //                 });

// //                 if (canvasRef.current && validDetections.length > 0) {
// //                     const displaySize = {
// //                         width: video.videoWidth,
// //                         height: video.videoHeight
// //                     };

// //                     faceapi.matchDimensions(canvasRef.current, displaySize);
// //                     const resizedDetections = faceapi.resizeResults(validDetections, displaySize);

// //                     const ctx = canvasRef.current.getContext('2d');
// //                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

// //                     faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
// //                     faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
// //                 }
// //             } catch (error) {
// //                 console.error("Detection error:", error);
// //             } finally {
// //                 setIsDetecting(false);
// //             }
// //         };

// //         const interval = setInterval(detectFaces, 500);
// //         return () => {
// //             clearInterval(interval);
// //             setIsDetecting(false);
// //         };
// //     }, [isModelsLoaded, capturedFaces, isDetecting]);

// //     const handleCapture = (faceIndex, expression) => {
// //         try {
// //             const imageSrc = webcamRef.current.getScreenshot();
// //             setCapturedImages(prev => [
// //                 ...prev,
// //                 {
// //                     image: imageSrc,
// //                     expression,
// //                     timestamp: new Date().toLocaleString(),
// //                     faceId: faceIndex
// //                 }
// //             ]);
// //         } catch (error) {
// //             console.error("Capture error:", error);
// //         }
// //     };

// //     const videoConstraints = {
// //         width: { ideal: 1280 },
// //         height: { ideal: 720 },
// //         facingMode: "user"
// //     };

// //     return (
// //         <div style={styles.container}>
// //             <div style={styles.contentWrapper}>
// //                 <h2 style={styles.title}>Multi-Person Facial Expression Detection</h2>
                
// //                 <div style={styles.webcamContainer}>
// //                     <Webcam
// //                         ref={webcamRef}
// //                         audio={false}
// //                         screenshotFormat="image/jpeg"
// //                         videoConstraints={videoConstraints}
// //                         style={styles.webcam}
// //                     />
// //                     <canvas
// //                         ref={canvasRef}
// //                         style={styles.canvas}
// //                     />

// //                     {detections.length > 0 && (
// //                         <div style={styles.detectionCounter}>
// //                             Detected: {detections.length} face(s)
// //                         </div>
// //                     )}
// //                 </div>

// //                 {capturedImages.length > 0 && (
// //                     <div style={styles.gallerySection}>
// //                         <h3 style={styles.galleryTitle}>Captured Expressions ({capturedImages.length})</h3>
// //                         <div style={styles.galleryGrid}>
// //                             {capturedImages.map((item, index) => (
// //                                 <div key={index} style={styles.galleryItem}>
// //                                     <img
// //                                         src={item.image}
// //                                         alt={`Face ${item.faceId}`}
// //                                         style={styles.capturedImage}
// //                                     />
// //                                     <div style={styles.caption}>
// //                                         <div style={styles.expressionText}>
// //                                             Face {item.faceId + 1}: {item.expression}
// //                                         </div>
// //                                         <div style={styles.timestamp}>
// //                                             {item.timestamp}
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // const styles = {
// //     container: {
// //         minHeight: '100vh',
// //         backgroundColor: '#f5f7fa',
// //         padding: '20px',
// //         display: 'flex',
// //         justifyContent: 'center',
// //         alignItems: 'center'
// //     },
// //     contentWrapper: {
// //         width: '100%',
// //         maxWidth: '1200px',
// //         backgroundColor: 'white',
// //         borderRadius: '12px',
// //         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
// //         padding: '30px',
// //         border: '1px solid #e1e5eb'
// //     },
// //     title: {
// //         color: '#2c3e50',
// //         marginBottom: '25px',
// //         textAlign: 'center',
// //         fontSize: '28px',
// //         fontWeight: '600',
// //         borderBottom: '2px solid #3498db',
// //         paddingBottom: '10px'
// //     },
// //     webcamContainer: {
// //         position: 'relative',
// //         marginBottom: '30px',
// //         borderRadius: '8px',
// //         overflow: 'hidden',
// //         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
// //         border: '1px solid #dfe6e9'
// //     },
// //     webcam: {
// //         width: '100%',
// //         display: 'block',
// //         transform: 'scaleX(-1)'
// //     },
// //     canvas: {
// //         position: 'absolute',
// //         top: 0,
// //         left: 0,
// //         width: '100%',
// //         height: '100%',
// //         pointerEvents: 'none'
// //     },
// //     detectionCounter: {
// //         position: 'absolute',
// //         top: '15px',
// //         left: '15px',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //         color: 'white',
// //         padding: '8px 15px',
// //         borderRadius: '20px',
// //         fontSize: '14px',
// //         zIndex: 2,
// //         fontWeight: '500'
// //     },
// //     gallerySection: {
// //         marginTop: '40px',
// //         padding: '20px',
// //         backgroundColor: '#f8f9fa',
// //         borderRadius: '10px',
// //         border: '1px solid #e1e5eb'
// //     },
// //     galleryTitle: {
// //         color: '#2c3e50',
// //         marginBottom: '20px',
// //         fontSize: '22px',
// //         textAlign: 'center',
// //         fontWeight: '500'
// //     },
// //     galleryGrid: {
// //         display: 'grid',
// //         gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
// //         gap: '20px',
// //         marginTop: '15px'
// //     },
// //     galleryItem: {
// //         border: '1px solid #e0e0e0',
// //         borderRadius: '8px',
// //         padding: '15px',
// //         backgroundColor: '#fff',
// //         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
// //         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
// //         ':hover': {
// //             transform: 'translateY(-5px)',
// //             boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
// //         }
// //     },
// //     capturedImage: {
// //         width: '100%',
// //         borderRadius: '6px',
// //         marginBottom: '12px',
// //         border: '1px solid #eee',
// //         aspectRatio: '1/1',
// //         objectFit: 'cover'
// //     },
// //     caption: {
// //         padding: '0 5px'
// //     },
// //     expressionText: {
// //         fontWeight: '600',
// //         marginBottom: '5px',
// //         color: '#3498db',
// //         fontSize: '16px'
// //     },
// //     timestamp: {
// //         fontSize: '0.85em',
// //         color: '#7f8c8d',
// //         fontStyle: 'italic'
// //     }
// // };

// // export default FaceExpressions;


// // import React, { useRef, useState, useEffect } from 'react';
// // import Webcam from 'react-webcam';
// // import * as faceapi from 'face-api.js';

// // const FaceExpressions = () => {
// //     const webcamRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const [detections, setDetections] = useState([]);
// //     const [capturedImages, setCapturedImages] = useState([]);
// //     const [isModelsLoaded, setIsModelsLoaded] = useState(false);
// //     const [isDetecting, setIsDetecting] = useState(false);
// //     const capturedFacesRef = useRef(new Set()); // Using ref instead of state

// //     // Load models - IMPORTANT: Ensure models are in public/models directory
// //     useEffect(() => {
// //         const loadModels = async () => {
// //             try {
// //                 // IMPORTANT: Verify your models are in the correct location
// //                 const modelsPath = process.env.PUBLIC_URL + '/models';
// //                 await Promise.all([
// //                     faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
// //                     faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
// //                     faceapi.nets.faceExpressionNet.loadFromUri(modelsPath)
// //                 ]);
// //                 setIsModelsLoaded(true);
// //                 console.log('Models loaded successfully');
// //             } catch (error) {
// //                 console.error("Error loading models:", error);
// //             }
// //         };
// //         loadModels();

// //         return () => {
// //             setIsModelsLoaded(false);
// //             setDetections([]);
// //         };
// //     }, []);

// //     // Real-time face detection
// //     useEffect(() => {
// //         if (!isModelsLoaded || isDetecting || !webcamRef.current) return;

// //         const detectFaces = async () => {
// //             setIsDetecting(true);
// //             try {
// //                 const video = webcamRef.current.video;
                
// //                 // Ensure video is ready
// //                 if (!video || video.readyState !== 4) {
// //                     setIsDetecting(false);
// //                     return;
// //                 }

// //                 // Get detections
// //                 const detections = await faceapi.detectAllFaces(
// //                     video,
// //                     new faceapi.TinyFaceDetectorOptions()
// //                 ).withFaceLandmarks().withFaceExpressions();

// //                 // Filter valid detections
// //                 const validDetections = detections.filter(det => 
// //                     det.detection?.box &&
// //                     typeof det.detection.box.x === 'number'
// //                 );

// //                 setDetections(validDetections);

// //                 // Auto-capture new faces with strong expressions
// //                 validDetections.forEach((detection, index) => {
// //                     const expressions = detection.expressions.asSortedArray();
// //                     if (expressions.length > 0 && expressions[0].probability > 0.8) {
// //                         if (!capturedFacesRef.current.has(index)) {
// //                             handleCapture(index, expressions[0].expression);
// //                             capturedFacesRef.current.add(index);
// //                         }
// //                     }
// //                 });

// //                 // Draw on canvas
// //                 if (canvasRef.current && validDetections.length > 0) {
// //                     const displaySize = {
// //                         width: video.videoWidth,
// //                         height: video.videoHeight
// //                     };
                    
// //                     // Set canvas dimensions
// //                     canvasRef.current.width = displaySize.width;
// //                     canvasRef.current.height = displaySize.height;
                    
// //                     const resizedDetections = faceapi.resizeResults(validDetections, displaySize);
// //                     const ctx = canvasRef.current.getContext('2d');
// //                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    
// //                     // Draw detections and expressions
// //                     faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
// //                     faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
// //                 }
// //             } catch (error) {
// //                 console.error("Detection error:", error);
// //             } finally {
// //                 setIsDetecting(false);
// //             }
// //         };

// //         const interval = setInterval(detectFaces, 300); // Reduced interval for better performance
// //         return () => clearInterval(interval);
// //     }, [isModelsLoaded, isDetecting]);

// //     const handleCapture = (faceIndex, expression) => {
// //         try {
// //             const imageSrc = webcamRef.current.getScreenshot();
// //             setCapturedImages(prev => [
// //                 ...prev,
// //                 {
// //                     image: imageSrc,
// //                     expression,
// //                     timestamp: new Date().toLocaleString(),
// //                     faceId: faceIndex
// //                 }
// //             ]);
// //         } catch (error) {
// //             console.error("Capture error:", error);
// //         }
// //     };

// //     const videoConstraints = {
// //         width: { ideal: 1280 },
// //         height: { ideal: 720 },
// //         facingMode: "user"
// //     };

// //     return (
// //         <div style={styles.container}>
// //             <div style={styles.contentWrapper}>
// //                 <h2 style={styles.title}>Multi-Person Facial Expression Detection</h2>
                
// //                 <div style={styles.webcamContainer}>
// //                     <Webcam
// //                         ref={webcamRef}
// //                         audio={false}
// //                         screenshotFormat="image/jpeg"
// //                         videoConstraints={videoConstraints}
// //                         style={styles.webcam}
// //                         onUserMedia={() => console.log('Webcam ready')}
// //                         onUserMediaError={(err) => console.error('Webcam error:', err)}
// //                     />
// //                     <canvas
// //                         ref={canvasRef}
// //                         style={styles.canvas}
// //                     />

// //                     {detections.length > 0 && (
// //                         <div style={styles.detectionCounter}>
// //                             Detected: {detections.length} face(s)
// //                         </div>
// //                     )}
// //                 </div>

// //                 {capturedImages.length > 0 && (
// //                     <div style={styles.gallerySection}>
// //                         <h3 style={styles.galleryTitle}>Captured Expressions ({capturedImages.length})</h3>
// //                         <div style={styles.galleryGrid}>
// //                             {capturedImages.map((item, index) => (
// //                                 <div key={index} style={styles.galleryItem}>
// //                                     <img
// //                                         src={item.image}
// //                                         alt={`Face ${item.faceId}`}
// //                                         style={styles.capturedImage}
// //                                     />
// //                                     <div style={styles.caption}>
// //                                         <div style={styles.expressionText}>
// //                                             Face {item.faceId + 1}: {item.expression}
// //                                         </div>
// //                                         <div style={styles.timestamp}>
// //                                             {item.timestamp}
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 )}

// //                 {!isModelsLoaded && (
// //                     <div style={styles.loadingMessage}>
// //                         Loading face detection models... This may take a moment.
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // // ... (keep your existing styles object, but add this new style)
// // const styles = {
// //     // ... (previous styles)
// //     loadingMessage: {
// //         textAlign: 'center',
// //         padding: '20px',
// //         color: '#7f8c8d',
// //         fontSize: '18px'
// //     }
// // };

// // export default FaceExpressions;


// // import React, { useRef, useState, useEffect } from 'react';
// // import Webcam from 'react-webcam';
// // import * as faceapi from 'face-api.js';

// // const FaceExpression = () => {
// //     const webcamRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const [detections, setDetections] = useState([]);
// //     const [capturedImages, setCapturedImages] = useState([]);
// //     const [isModelsLoaded, setIsModelsLoaded] = useState(false);
// //     const capturedFacesRef = useRef(new Set());
// //     const [isDetecting, setIsDetecting] = useState(false);

// //     // Load models
// //     useEffect(() => {
// //         const loadModels = async () => {
// //             try {
// //                 const modelsPath = process.env.PUBLIC_URL + '/models';
// //                 await Promise.all([
// //                     faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
// //                     faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
// //                     faceapi.nets.faceExpressionNet.loadFromUri(modelsPath)
// //                 ]);
// //                 setIsModelsLoaded(true);
// //                 console.log('Models loaded successfully');
// //             } catch (error) {
// //                 console.error("Error loading models:", error);
// //             }
// //         };
// //         loadModels();

// //         return () => {
// //             setIsModelsLoaded(false);
// //             setDetections([]);
// //         };
// //     }, []);

// //     // Real-time face detection
// //     useEffect(() => {
// //         if (!isModelsLoaded || isDetecting || !webcamRef.current) return;

// //         const detectFaces = async () => {
// //             setIsDetecting(true);
// //             try {
// //                 const video = webcamRef.current.video;
                
// //                 if (!video || video.readyState !== 4) {
// //                     setIsDetecting(false);
// //                     return;
// //                 }

// //                 const detections = await faceapi.detectAllFaces(
// //                     video,
// //                     new faceapi.TinyFaceDetectorOptions()
// //                 ).withFaceLandmarks().withFaceExpressions();

// //                 const validDetections = detections.filter(det => 
// //                     det.detection?.box &&
// //                     typeof det.detection.box.x === 'number'
// //                 );

// //                 setDetections(validDetections);

// //                 validDetections.forEach((detection, index) => {
// //                     const expressions = detection.expressions.asSortedArray();
// //                     if (expressions.length > 0 && expressions[0].probability > 0.8) {
// //                         if (!capturedFacesRef.current.has(index)) {
// //                             handleCapture(index, expressions[0].expression);
// //                             capturedFacesRef.current.add(index);
// //                         }
// //                     }
// //                 });

// //                 if (canvasRef.current && validDetections.length > 0) {
// //                     const displaySize = {
// //                         width: video.videoWidth,
// //                         height: video.videoHeight
// //                     };
                    
// //                     canvasRef.current.width = displaySize.width;
// //                     canvasRef.current.height = displaySize.height;
                    
// //                     const resizedDetections = faceapi.resizeResults(validDetections, displaySize);
// //                     const ctx = canvasRef.current.getContext('2d');
// //                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    
// //                     faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
// //                     faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
// //                 }
// //             } catch (error) {
// //                 console.error("Detection error:", error);
// //             } finally {
// //                 setIsDetecting(false);
// //             }
// //         };

// //         const interval = setInterval(detectFaces, 300);
// //         return () => clearInterval(interval);
// //     }, [isModelsLoaded, isDetecting]);

// //     const handleCapture = (faceIndex, expression) => {
// //         try {
// //             const imageSrc = webcamRef.current.getScreenshot();
// //             setCapturedImages(prev => [
// //                 ...prev,
// //                 {
// //                     image: imageSrc,
// //                     expression,
// //                     timestamp: new Date().toLocaleString(),
// //                     faceId: faceIndex
// //                 }
// //             ]);
// //         } catch (error) {
// //             console.error("Capture error:", error);
// //         }
// //     };

// //     const videoConstraints = {
// //         width: { ideal: 1280 },
// //         height: { ideal: 720 },
// //         facingMode: "user"
// //     };

// //     return (
// //         <div style={{
// //             maxWidth: '1200px',
// //             margin: '0 auto',
// //             padding: '20px',
// //             fontFamily: 'Arial, sans-serif'
// //         }}>
// //             <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
// //                 Multi-Person Facial Expression Detection
// //             </h2>

// //             {!isModelsLoaded && (
// //                 <div style={{
// //                     padding: '20px',
// //                     textAlign: 'center',
// //                     color: '#7f8c8d',
// //                     backgroundColor: '#f8f9fa',
// //                     borderRadius: '8px',
// //                     marginBottom: '20px'
// //                 }}>
// //                     Loading face detection models... Please wait.
// //                 </div>
// //             )}

// //             <div style={{
// //                 position: 'relative',
// //                 marginBottom: '30px',
// //                 borderRadius: '8px',
// //                 overflow: 'hidden',
// //                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
// //             }}>
// //                 <Webcam
// //                     ref={webcamRef}
// //                     audio={false}
// //                     screenshotFormat="image/jpeg"
// //                     videoConstraints={videoConstraints}
// //                     style={{
// //                         width: '100%',
// //                         display: 'block',
// //                         transform: 'scaleX(-1)'
// //                     }}
// //                     onUserMedia={() => console.log('Webcam access granted')}
// //                     onUserMediaError={(err) => console.error('Webcam error:', err)}
// //                 />
// //                 <canvas
// //                     ref={canvasRef}
// //                     style={{
// //                         position: 'absolute',
// //                         top: 0,
// //                         left: 0,
// //                         width: '100%',
// //                         height: '100%',
// //                         pointerEvents: 'none'
// //                     }}
// //                 />

// //                 {detections.length > 0 && (
// //                     <div style={{
// //                         position: 'absolute',
// //                         top: '10px',
// //                         left: '10px',
// //                         backgroundColor: 'rgba(0,0,0,0.7)',
// //                         color: 'white',
// //                         padding: '8px 12px',
// //                         borderRadius: '4px',
// //                         fontSize: '14px',
// //                         zIndex: 2
// //                     }}>
// //                         Detected: {detections.length} face(s)
// //                     </div>
// //                 )}
// //             </div>

// //             {capturedImages.length > 0 && (
// //                 <div>
// //                     <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
// //                         Captured Expressions ({capturedImages.length})
// //                     </h3>
// //                     <div style={{
// //                         display: 'grid',
// //                         gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
// //                         gap: '15px',
// //                         marginTop: '20px'
// //                     }}>
// //                         {capturedImages.map((item, index) => (
// //                             <div key={index} style={{
// //                                 border: '1px solid #e0e0e0',
// //                                 borderRadius: '8px',
// //                                 padding: '12px',
// //                                 backgroundColor: '#fff',
// //                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
// //                                 transition: 'transform 0.2s',
// //                                 ':hover': {
// //                                     transform: 'translateY(-2px)'
// //                                 }
// //                             }}>
// //                                 <img
// //                                     src={item.image}
// //                                     alt={`Face ${item.faceId}`}
// //                                     style={{
// //                                         width: '100%',
// //                                         borderRadius: '4px',
// //                                         marginBottom: '10px',
// //                                         border: '1px solid #eee'
// //                                     }}
// //                                 />
// //                                 <div>
// //                                     <div style={{
// //                                         fontWeight: 'bold',
// //                                         marginBottom: '4px',
// //                                         color: '#3498db'
// //                                     }}>
// //                                         Face {item.faceId + 1}: {item.expression}
// //                                     </div>
// //                                     <div style={{
// //                                         fontSize: '0.8em',
// //                                         color: '#7f8c8d',
// //                                     }}>
// //                                         {item.timestamp}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default FaceExpression;


// import React, { useRef, useState, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import * as faceapi from 'face-api.js';
// import '@tensorflow/tfjs'; // Explicitly import TensorFlow.js

// const FaceExpressions = () => {
//     const webcamRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [detections, setDetections] = useState([]);
//     const [isModelsLoaded, setIsModelsLoaded] = useState(false);
//     const [error, setError] = useState(null);
//     const [loadingStatus, setLoadingStatus] = useState('Initializing...');
//     const detectionIntervalRef = useRef(null);

//     // Initialize TensorFlow and load models
//     useEffect(() => {
//         let isMounted = true;

//         const initialize = async () => {
//             try {
//                 // 1. Set TensorFlow.js backend
//                 setLoadingStatus('Setting up TensorFlow.js backend...');
//                 await faceapi.tf.setBackend('webgl');
//                 await faceapi.tf.ready();
//                 console.log('TensorFlow.js backend ready');

//                 // 2. Load models sequentially with error handling
//                 setLoadingStatus('Loading face detection model...');
//                 await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                
//                 setLoadingStatus('Loading facial landmarks model...');
//                 await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                
//                 setLoadingStatus('Loading expression recognition model...');
//                 await faceapi.nets.faceExpressionNet.loadFromUri('/models');

//                 if (isMounted) {
//                     setIsModelsLoaded(true);
//                     setLoadingStatus('All models loaded successfully');
//                 }
//             } catch (err) {
//                 if (isMounted) {
//                     setError(`Initialization failed: ${err.message}`);
//                     console.error('Initialization error:', err);
//                 }
//             }
//         };

//         initialize();

//         return () => {
//             isMounted = false;
//             // Clean up any pending operations
//             if (detectionIntervalRef.current) {
//                 clearInterval(detectionIntervalRef.current);
//             }
//             faceapi.tf.disposeVariables();
//         };
//     }, []);

//     // Face detection logic
//     useEffect(() => {
//         if (!isModelsLoaded || !webcamRef.current) return;

//         const detectFaces = async () => {
//             try {
//                 const video = webcamRef.current.video;
//                 if (!video || video.readyState !== 4) return;

//                 // Perform detection
//                 const detections = await faceapi.detectAllFaces(
//                     video,
//                     new faceapi.TinyFaceDetectorOptions()
//                 ).withFaceLandmarks().withFaceExpressions();

//                 // Filter valid detections
//                 const validDetections = detections.filter(det => 
//                     det.detection?.box &&
//                     typeof det.detection.box.x === 'number'
//                 );

//                 setDetections(validDetections);

//                 // Draw on canvas
//                 if (canvasRef.current && validDetections.length > 0) {
//                     const displaySize = {
//                         width: video.videoWidth,
//                         height: video.videoHeight
//                     };
                    
//                     // Set canvas dimensions
//                     faceapi.matchDimensions(canvasRef.current, displaySize);
//                     const resizedDetections = faceapi.resizeResults(validDetections, displaySize);
                    
//                     const ctx = canvasRef.current.getContext('2d');
//                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    
//                     // Draw detections and expressions
//                     faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
//                     faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
//                 }
//             } catch (err) {
//                 console.error('Detection error:', err);
//                 setError(`Detection error: ${err.message}`);
//             }
//         };

//         // Start detection loop
//         detectionIntervalRef.current = setInterval(async () => {
//             await faceapi.tf.nextFrame(); // Allow TensorFlow to breathe
//             detectFaces();
//         }, 300);

//         return () => {
//             if (detectionIntervalRef.current) {
//                 clearInterval(detectionIntervalRef.current);
//             }
//         };
//     }, [isModelsLoaded]);

//     const videoConstraints = {
//         width: { ideal: 1280 },
//         height: { ideal: 720 },
//         facingMode: "user"
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.contentWrapper}>
//                 <h2 style={styles.title}>Multi-Person Facial Expression Detection</h2>
                
//                 {error ? (
//                     <div style={styles.errorContainer}>
//                         <h3 style={styles.errorTitle}>Error occurred</h3>
//                         <p>{error}</p>
//                         <div style={styles.troubleshooting}>
//                             <p>Possible solutions:</p>
//                             <ul>
//                                 <li>Ensure all model files are in /public/models directory</li>
//                                 <li>Check browser console for 404 errors</li>
//                                 <li>Try refreshing the page</li>
//                                 <li>Use Chrome browser with WebGL enabled</li>
//                             </ul>
//                         </div>
//                     </div>
//                 ) : !isModelsLoaded ? (
//                     <div style={styles.loadingContainer}>
//                         <p>{loadingStatus}</p>
//                         <div style={styles.loadingSpinner}></div>
//                     </div>
//                 ) : null}

//                 <div style={styles.webcamContainer}>
//                     <Webcam
//                         ref={webcamRef}
//                         audio={false}
//                         screenshotFormat="image/jpeg"
//                         videoConstraints={videoConstraints}
//                         style={styles.webcam}
//                         onUserMedia={() => console.log('Webcam access granted')}
//                         onUserMediaError={(err) => {
//                             console.error('Webcam error:', err);
//                             setError(`Webcam error: ${err.message}`);
//                         }}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         style={styles.canvas}
//                     />

//                     {detections.length > 0 && (
//                         <div style={styles.detectionCounter}>
//                             Detected: {detections.length} face(s)
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         maxWidth: '1200px',
//         margin: '0 auto',
//         padding: '20px',
//         fontFamily: 'Arial, sans-serif'
//     },
//     contentWrapper: {
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//     },
//     title: {
//         color: '#2c3e50',
//         marginBottom: '20px',
//         textAlign: 'center'
//     },
//     webcamContainer: {
//         position: 'relative',
//         marginBottom: '20px',
//         borderRadius: '8px',
//         overflow: 'hidden',
//         boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//     },
//     webcam: {
//         width: '100%',
//         display: 'block',
//         transform: 'scaleX(-1)'
//     },
//     canvas: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none'
//     },
//     detectionCounter: {
//         position: 'absolute',
//         top: '10px',
//         left: '10px',
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         color: 'white',
//         padding: '8px 12px',
//         borderRadius: '4px',
//         fontSize: '14px',
//         zIndex: 2
//     },
//     errorContainer: {
//         backgroundColor: '#ffebee',
//         color: '#c62828',
//         padding: '20px',
//         borderRadius: '8px',
//         marginBottom: '20px'
//     },
//     errorTitle: {
//         marginTop: 0,
//         color: '#c62828'
//     },
//     troubleshooting: {
//         marginTop: '15px',
//         padding: '10px',
//         backgroundColor: '#f5f5f5',
//         borderRadius: '4px'
//     },
//     loadingContainer: {
//         textAlign: 'center',
//         padding: '20px',
//         marginBottom: '20px'
//     },
//     loadingSpinner: {
//         border: '4px solid #f3f3f3',
//         borderTop: '4px solid #3498db',
//         borderRadius: '50%',
//         width: '40px',
//         height: '40px',
//         animation: 'spin 1s linear infinite',
//         margin: '20px auto'
//     }
// };

// export default FaceExpressions;


import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import './FaceExpressions.css';

const FaceExpressions = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [expressions, setExpressions] = useState([]);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [dominantExpression, setDominantExpression] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);

  // Available expressions to detect
  const EXPRESSION_LABELS = [
    'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'
  ];

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingStatus('Loading face detection model...');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        
        setLoadingStatus('Loading facial landmarks model...');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        
        setLoadingStatus('Loading expression recognition model...');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        
        setIsModelsLoaded(true);
        setLoadingStatus('Models loaded successfully');
      } catch (err) {
        setError(`Failed to load models: ${err.message}`);
        console.error('Model loading error:', err);
      }
    };

    // Initialize TensorFlow backend first
    const initialize = async () => {
      try {
        await faceapi.tf.setBackend('webgl');
        await faceapi.tf.ready();
        console.log('TensorFlow backend ready');
        await loadModels();
      } catch (err) {
        setError(`Initialization failed: ${err.message}`);
        console.error('Initialization error:', err);
      }
    };

    initialize();

    return () => {
      // Clean up
      faceapi.tf.disposeVariables();
    };
  }, []);

  // Detect expressions
  useEffect(() => {
    if (!isModelsLoaded || !webcamRef.current) return;

    let animationFrameId;
    let detectionInterval;

    const detectExpressions = async () => {
      try {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;

        // Detect all faces with expressions
        const detections = await faceapi.detectAllFaces(
          video, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        if (detections.length > 0) {
          // Get expressions from the first face (you can modify for multiple faces)
          const faceExpressions = detections[0].expressions;
          
          // Convert to array and sort by probability
          const sortedExpressions = Object.entries(faceExpressions)
            .map(([expression, probability]) => ({ expression, probability }))
            .sort((a, b) => b.probability - a.probability);

          setExpressions(sortedExpressions);
          setDominantExpression(sortedExpressions[0]);

          // Update detection history
          setDetectionHistory(prev => [
            ...prev.slice(-9), // Keep last 10 entries
            {
              timestamp: new Date().toLocaleTimeString(),
              expressions: sortedExpressions
            }
          ]);

          // Draw detections on canvas
          if (canvasRef.current) {
            const displaySize = {
              width: video.videoWidth,
              height: video.videoHeight
            };
            faceapi.matchDimensions(canvasRef.current, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
          }
        }
      } catch (err) {
        console.error('Detection error:', err);
        setError(`Detection error: ${err.message}`);
      }
    };

    // Start detection loop
    const startDetection = () => {
      detectionInterval = setInterval(() => {
        animationFrameId = requestAnimationFrame(detectExpressions);
      }, 300);
    };

    startDetection();

    return () => {
      clearInterval(detectionInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isModelsLoaded]);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user"
  };

  // Calculate expression intensity (0-100)
  const getExpressionIntensity = (probability) => {
    return Math.round(probability * 100);
  };

  return (
    <div className="face-expressions-container">
      <h1>Facial Expression Detection</h1>
      
      {error ? (
        <div className="error-message">
          <h3>Error occurred</h3>
          <p>{error}</p>
          <div className="troubleshooting">
            <p>Possible solutions:</p>
            <ul>
              <li>Ensure all model files are in /public/models directory</li>
              <li>Check browser console for errors</li>
              <li>Refresh the page</li>
              <li>Use Chrome/Firefox with WebGL enabled</li>
              <li>Allow camera permissions</li>
            </ul>
          </div>
        </div>
      ) : !isModelsLoaded ? (
        <div className="loading-container">
          <p>{loadingStatus}</p>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="detection-area">
            <div className="webcam-container">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="webcam-video"
                onUserMedia={() => console.log('Webcam access granted')}
                onUserMediaError={(err) => {
                  console.error('Webcam error:', err);
                  setError(`Webcam error: ${err.message}`);
                }}
              />
              <canvas
                ref={canvasRef}
                className="detection-canvas"
              />
            </div>

            <div className="results-panel">
              {dominantExpression && (
                <div className="dominant-expression">
                  <h2>Dominant Expression</h2>
                  <div className={`expression-badge ${dominantExpression.expression}`}>
                    {dominantExpression.expression}
                    <span className="probability">
                      {getExpressionIntensity(dominantExpression.probability)}%
                    </span>
                  </div>
                </div>
              )}

              <div className="all-expressions">
                <h3>All Expressions</h3>
                <div className="expressions-list">
                  {expressions.map((exp, index) => (
                    <div key={index} className="expression-item">
                      <span className="expression-label">{exp.expression}</span>
                      <div className="expression-bar-container">
                        <div 
                          className={`expression-bar ${exp.expression}`}
                          style={{ width: `${getExpressionIntensity(exp.probability)}%` }}
                        ></div>
                        <span className="expression-value">
                          {getExpressionIntensity(exp.probability)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {detectionHistory.length > 0 && (
            <div className="history-panel">
              <h3>Detection History</h3>
              <div className="history-grid">
                {detectionHistory.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-time">{entry.timestamp}</div>
                    <div className="history-expressions">
                      {entry.expressions.slice(0, 3).map((exp, i) => (
                        <div key={i} className="history-expression">
                          <span className="history-expression-label">{exp.expression}</span>
                          <span className="history-expression-value">
                            {getExpressionIntensity(exp.probability)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaceExpressions;