import React from "react";
import './newExercise.css';

function ExercisePage() {
    const [showVideo, setShowVideo] = React.useState(false);
    const [showStop, setShowStop] = React.useState(false);

    const handleStart = () => {
      setShowVideo(true);
      setShowStop(true);
    }

    const handleStop = () => {
      setShowVideo(false);
      setShowStop(false);
    }
    
    return (
        <div className="container">
          <h1>Exercise</h1>
          {!showVideo && (
            <button className="btn-exercise" onClick={handleStart}>
              Start
            </button>
          )}
          {showVideo && (
            <div>
              <img
                className="video-stream"
                src="http://localhost:5000/exercise"
                alt="Exercise video stream"
              />
              <button className="btn-exercise" onClick={handleStop}>
                Stop
              </button>
            </div>
          )}
        </div>
      );
    }
    
    export default NewExercisePage;
