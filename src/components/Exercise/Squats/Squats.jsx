import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "../utilities";
import "./Squats.css";

function Squats() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [net, setNet] = useState(null);
  const [squatCount, setSquatCount] = useState(0);
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

  const checkSquat = (pose) => {
    const nose = pose.keypoints[0].position.y;
    const leftElbow = pose.keypoints[7].position.y;
    const rightElbow = pose.keypoints[8].position.y;
    if (nose < leftElbow && nose < rightElbow) {
      setSquatCount((prevCount) => prevCount + 1);
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
    <div className="squats-container">
      <h1 className="squats-header">Squats</h1>
      <div className="squats-content">
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
        <div className="squats-buttons-container">
          <button className="squats-start-button" onClick={start}>
            Start
          </button>
          <button className="squats-stop-button" onClick={stop}>
            Stop
          </button>
        <div class="squat-counter-container">
          <p class="squat-counter-label">Squats:</p>
          <p class="squat-counter">0</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Squats;
