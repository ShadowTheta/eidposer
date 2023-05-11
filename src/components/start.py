from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import argparse
import cv2
import time
import json
import curses
import numpy as np

app = Flask(__name__)
CORS(app, resources={ r'/*': { 'origins': 'http://localhost:5000' } })

# Define a global variable to track whether the camera is currently capturing frames or not
camera_active = False

# Define a function to start capturing frames from the camera
def start_camera():
    global camera_active
    cap = cv2.VideoCapture(0)
    camera_active = True

    def get_frame():
        # capture a frame from the camera
        ret, frame = cap.read()
        if not ret:
            return None

        # perform pose estimation on the frame
        frame_with_skeleton = run_pose_estimator(cap)

        # encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame_with_skeleton)
        if not ret:
           return None

        # convert the JPEG buffer to bytes
        jpg_bytes = buffer.tobytes()

        return jpg_bytes

    def generate_frames():
        while camera_active:
            frame = get_frame()
            if frame is None:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
            time.sleep(0.001)

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Define a function to stop capturing frames from the camera
def stop_camera():
    global cap, camera_active
    camera_active = False
    cap.release()

@app.route('/')
def route_default():
    return 'Welcome to FitClub'

@app.route('/exercise')
def exercise():
    # If the camera is not currently active, start capturing frames from the camera
    if not camera_active:
        return start_camera()

    # If the camera is already active, return an empty response
    return Response('', mimetype='multipart/x-mixed-replace; boundary=frame')

ROOT_PORT = 5000 #default port
PORT = ROOT_PORT

if __name__ == '__main__':
    app.run(port=PORT)
    stop_camera()
