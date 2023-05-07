// import React, { useState, useRef } from 'react';
// import * as Pose from '@mediapipe/pose';
// import WebcamCapture from '../Webcam.jsx';
// import './Pushups.css';

// const Pushups = () => {
//   const [cameraStream, setCameraStream] = useState(null);
//   const [exerciseStarted, setExerciseStarted] = useState(false);
//   const [exerciseComplete, setExerciseComplete] = useState(false);
//   const [exerciseData, setExerciseData] = useState([]);
//   const poseRef = useRef(null);

//   const startExercise = () => {
//     setExerciseStarted(true);
//     setCameraStream(poseRef.current.camera);
//     poseRef.current.start();
//   };

//   const endExercise = () => {
//     setExerciseComplete(true);
//   };

//   const handlePoseData = (pose) => {
//     // TODO: Handle the pose data from Mediapipe
//   };

//   return (
//     <div className="exercise-page">
//       <h1>Pushups</h1>
//       {!exerciseStarted && (
//         <button className="start-button" onClick={startExercise}>Start Exercise</button>
//       )}
//       {exerciseStarted && !exerciseComplete && (
//         <div className="exercise-container">
//             <div className="video-container">
//                 <WebcamCapture cameraStream={cameraStream} />
//                 {/* <Pose onPose={handlePoseData} ref={poseRef} /> */}
//             </div>
//           {/* TODO: Display exercise instructions */}
//           {/* TODO: Display feedback to the user */}
//           <button className="end-button" onClick={endExercise}>End Exercise</button>
//         </div>
//       )}
//       {exerciseComplete && (
//         <div className="exercise-container">
//           {/* TODO: Display exercise data */}
//           <button className="retry-button" onClick={() => setExerciseComplete(false)}>Retry</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Pushups;


// ------------------------------------------------------------------------------------------------------------------------

// import React, { useState, useRef } from 'react';
// import WebcamCapture from '../Webcam.jsx';
// import * as posenet from '@tensorflow-models/posenet';
// import './Pushups.css';

// const Pushups = () => {
//   const [cameraStream, setCameraStream] = useState(null);
//   const [exerciseStarted, setExerciseStarted] = useState(false);
//   const [exerciseComplete, setExerciseComplete] = useState(false);
//   const [exerciseData, setExerciseData] = useState([]);
//   const netRef = useRef(null);
//   const poseRef = useRef(null);

//   const startExercise = async () => {
//     setExerciseStarted(true);
//     const net = await posenet.load();
//     netRef.current = net;
//     setCameraStream(poseRef.current.camera);
//     poseRef.current.start();
//   };

//   const endExercise = () => {
//     setExerciseComplete(true);
//   };

//   const handlePoseData = async (poses) => {
//     if (poses.length > 0) {
//       const net = netRef.current;
//       const pose = poses[0];
//       const poseData = await net.estimateSinglePose(pose.image, {
//         flipHorizontal: false,
//       });
//       setExerciseData((prevData) => [...prevData, poseData]);
//     }
//   };

//   return (
//     <div className="exercise-page">
//       <h1>Pushups</h1>
//       {!exerciseStarted && (
//         <button className="start-button" onClick={startExercise}>Start Exercise</button>
//       )}
//       {exerciseStarted && !exerciseComplete && (
//         <div className="exercise-container">
//             <div className="video-container">
//                 <WebcamCapture cameraStream={cameraStream} />
//             </div>
//           {/* TODO: Display exercise instructions */}
//           {/* TODO: Display feedback to the user */}
//           <button className="end-button" onClick={endExercise}>End Exercise</button>
//         </div>
//       )}
//       {exerciseComplete && (
//         <div className="exercise-container">
//           {/* TODO: Display exercise data */}
//           <button className="retry-button" onClick={() => setExerciseComplete(false)}>Retry</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Pushups;

// ---------------------------------------------------------------------------------------------------------------------

// import React, { useRef } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";
// import { drawKeypoints, drawSkeleton } from "../utilities";
// import './Pushups.css';

// function Pushups() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   //  Load posenet
//   const runPosenet = async () => {
//     const net = await posenet.load({
//       inputResolution: { width: 640, height: 480 },
//       scale: 0.8,
//     });
//     //
//     setInterval(() => {
//       detect(net);
//     }, 1000);
//   };

//   const detect = async (net) => {
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       // Get Video Properties
//       const video = webcamRef.current.video;
//       const videoWidth = webcamRef.current.video.videoWidth;
//       const videoHeight = webcamRef.current.video.videoHeight;

//       // Set video width
//       webcamRef.current.video.width = videoWidth;
//       webcamRef.current.video.height = videoHeight;

//       // Make Detections
//       const pose = await net.estimateSinglePose(video);
      

//       drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
//     }
//   };

//   const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
//     const ctx = canvas.current.getContext("2d");
//     canvas.current.width = videoWidth;
//     canvas.current.height = videoHeight;

//     drawKeypoints(pose["keypoints"], 0.6, ctx);
//     drawSkeleton(pose["keypoints"], 0.7, ctx);
//   };

//   runPosenet();

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Pushups</h1>
//         <Webcam
//           ref={webcamRef}
//           classname='webcam'
//           style={{
//             position: "relative",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zindex: 9,
//             width: 640,
//             height: 480,
//           }}
//         />
//         <button>Start</button>

//         <canvas
//           ref={canvasRef}
//           classname='canvas'
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zindex: 9,
//             width: 640,
//             height: 480,
//           }}
//         />
//       </header>
//     </div>
//   );
// }

// export default Pushups;



// -------------------------------------------------------------------------------------------------------------
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "../utilities";
import "./Pushups.css";

function Pushups() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [net, setNet] = useState(null);
  const [pushupCount, setPushupCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function loadPosenet() {
      const net = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
      });
      setNet(net);
    }
    loadPosenet();
  }, []);

  useEffect(() => {
    async function runDetection() {
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4 &&
    isRunning // check if isRunning is still true
  ) {
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    const pose = await net.estimateSinglePose(video);
    drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    checkPushup(pose);
  }
}
  
    if (isRunning && net) {
      intervalRef.current = setInterval(runDetection, 100);
    }
  
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, net]);
  
  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  const checkPushup = (pose) => {
    const nose = pose.keypoints[0].position.y;
    const leftElbow = pose.keypoints[7].position.y;
    const rightElbow = pose.keypoints[8].position.y;
    if (nose < leftElbow && nose < rightElbow) {
      setPushupCount((prevCount) => prevCount + 1);
    }
  };

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  
  return (
    <div className="pushups-container">
      <h1 className="pushups-header">Pushups</h1>
      <div className="pushups-content">
        <div className="webcam-container">
          <Webcam
            ref={webcamRef}
            className="webcam"
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: "640px",
              height: "480px",
            }}
          />
        </div>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="canvas"
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: "640px",
              height: "480px",
            }}
          />
        </div>
        <div className="pushups-buttons-container">
          <button className="pushups-start-button" onClick={start}>
            Start
          </button>
          <button className="pushups-stop-button" onClick={stop}>
            Stop
          </button>
        <div class="pushup-counter-container">
          <p class="pushup-counter-label">Pushups:</p>
          <p class="pushup-counter">{pushupCount}</p>
        </div>
        </div>
      </div>
    </div>
  );
  
}

export default Pushups;