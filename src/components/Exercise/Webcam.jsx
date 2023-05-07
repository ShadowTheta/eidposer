// import React, { useRef, useState } from "react";
// import Webcam from "react-webcam";

// const WebcamCapture = () => {
//   const webcamRef = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);

//   const startRecording = () => {
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//   };

//   const capture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     console.log(imageSrc);
//   };

//   return (
//     <div>
//       <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
//       <div>
//         <button onClick={capture}>Capture photo</button>
//         {isRecording ? (
//           <button onClick={stopRecording}>Stop recording</button>
//         ) : (
//           <button onClick={startRecording}>Start recording</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WebcamCapture;

// import React, { useRef } from 'react';
// import Webcam from 'react-webcam';

// const WebcamCapture = () => {
//   const webcamRef = useRef(null);
//   let mediaStream = null;

//   const stopCapture = () => {
//     if (mediaStream) {
//       mediaStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       mediaStream = null;
//     }
//   };

//   const startCapture = async () => {
//     mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
//     webcamRef.current.video.srcObject = mediaStream;
//   };

//   return (
//     <div>
//       <Webcam audio={false} ref={webcamRef} />
//       <button onClick={stopCapture}>Stop</button>
//       <button onClick={startCapture}>Start</button>
//     </div>
//   );
// };
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const stopCapture = () => {
    const videoTrack = webcamRef.current.stream.getVideoTracks()[0];
    videoTrack.stop();
    setShowWebcam(false);
  };

  const startCapture = () => {
    setShowWebcam(true);
  };

  return (
    <div>
      {!showWebcam && (
        <button onClick={startCapture}>Start</button>
      )}
      {showWebcam && (
        <div>
            <hr />
          <Webcam audio={false} ref={webcamRef} />
          <hr />
          <button onClick={stopCapture}>Stop</button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
