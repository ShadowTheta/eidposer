import cv2
import mediapipe as mp
import matplotlib.pyplot as plt
import json
import numpy as np
import math

from pose_estimation.utils import midpoint, magnitude


class Pose:
    # Initializing mediapipe pose class.
    mp_pose = mp.solutions.pose

    # Setting up the Pose function.
    pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.7, model_complexity=2)

    # Initializing mediapipe drawing class, useful for annotation.
    mp_drawing = mp.solutions.drawing_utils

    LEFT_SHOULDER = mp_pose.PoseLandmark.LEFT_SHOULDER.value
    RIGHT_SHOULDER = mp_pose.PoseLandmark.RIGHT_SHOULDER.value
    LEFT_HIP = mp_pose.PoseLandmark.LEFT_HIP.value
    RIGHT_HIP = mp_pose.PoseLandmark.RIGHT_HIP.value
    LEFT_KNEE = mp_pose.PoseLandmark.LEFT_KNEE.value
    RIGHT_KNEE = mp_pose.PoseLandmark.RIGHT_KNEE.value
    LEFT_WRIST = mp_pose.PoseLandmark.LEFT_WRIST.value
    RIGHT_WRIST = mp_pose.PoseLandmark.RIGHT_WRIST.value
    LEFT_ELBOW = mp_pose.PoseLandmark.LEFT_ELBOW.value
    RIGHT_ELBOW = mp_pose.PoseLandmark.RIGHT_ELBOW.value

    def __init__(self, num_frame, image, display=True):
        self.num_frame = num_frame
        self.image = image
        self.display = display

    def detectPose(self):
        '''
        This function performs pose detection on an image.
        Args:
            image: The input image with a prominent person whose pose landmarks needs to be detected.
            pose: The pose setup function required to perform the pose detection.
            display: A boolean value that is if set to true the function displays the original input image, the resultant image,
                    and the pose landmarks in 3D plot and returns nothing.
        Returns:
            output_image: The input image with the detected pose landmarks drawn.
            landmarks: A list of detected landmarks converted into their original scale.
        '''
        shoulder_confidence_index = 0
        hip_confidence_index = 0
        knee_confidence_index = 0
        wrist_confidence_index = 0
        elbow_confidence_index = 0

        # Create a copy of the input image.
        output_image = self.image.copy()

        # Convert the image from BGR into RGB format.
        imageRGB = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)

        # Perform the Pose Detection.
        results = Pose.pose.process(imageRGB)

        # Retrieve the height and width of the input image.
        height, width, _ = self.image.shape

        # Initialize a list to store the detected landmarks.
        landmarks = []

        # Check if any landmarks are detected.
        front = None
        if results.pose_landmarks:
            # Get the x-coordinates of the left and right shoulders
            left_shoulder_x = results.pose_landmarks.landmark[Pose.mp_pose.PoseLandmark.LEFT_SHOULDER].x
            right_shoulder_x = results.pose_landmarks.landmark[Pose.mp_pose.PoseLandmark.RIGHT_SHOULDER].x

            # Determine if the person is facing towards the robot or not
            difference = abs((left_shoulder_x - right_shoulder_x) * width)
            if difference < 100:
                front = 0
            else:
                front = 1

            # Draw Pose landmarks on the output image.
            Pose.mp_drawing.draw_landmarks(image=output_image, landmark_list=results.pose_landmarks,
                                    connections=Pose.mp_pose.POSE_CONNECTIONS)

            if results.pose_landmarks.landmark[Pose.LEFT_SHOULDER].visibility >= 0.5 or results.pose_landmarks.landmark[Pose.RIGHT_SHOULDER].visibility >= 0.5:
                shoulder_confidence_index = 1
            if results.pose_landmarks.landmark[Pose.LEFT_HIP].visibility >= 0.5 or results.pose_landmarks.landmark[Pose.RIGHT_HIP].visibility >= 0.5:
                hip_confidence_index = 1
            if results.pose_landmarks.landmark[Pose.LEFT_KNEE].visibility >= 0.5 or results.pose_landmarks.landmark[Pose.RIGHT_KNEE].visibility >= 0.5:
                knee_confidence_index = 1
            if results.pose_landmarks.landmark[Pose.LEFT_WRIST].visibility >= 0.5 or results.pose_landmarks.landmark[Pose.RIGHT_WRIST].visibility >= 0.5:
                wrist_confidence_index = 1
            if results.pose_landmarks.landmark[Pose.LEFT_ELBOW].visibility >= 0.5 or results.pose_landmarks.landmark[Pose.RIGHT_ELBOW].visibility >= 0.5:
                elbow_confidence_index = 1

            # print(f'Shoulder Confidence Index: {shoulder_confidence_index}')
            # print(f'Hip Confidence Index: {hip_confidence_index}')
            # print(f'Knee Confidence Index: {knee_confidence_index}')
            # print(f'Wrist Confidence Index: {wrist_confidence_index}')
            # print(f'Elbow Confidence Index: {elbow_confidence_index}')

            # Iterate over the detected landmarks.
            for landmark in results.pose_landmarks.landmark:
                # Append the landmark into the list.
                landmarks.append((int(landmark.x * width), int(landmark.y * height),
                                    (landmark.z * width)))

            shoulder = midpoint(landmarks[Pose.LEFT_SHOULDER], landmarks[Pose.RIGHT_SHOULDER])
            hip = midpoint(landmarks[Pose.LEFT_HIP], landmarks[Pose.RIGHT_HIP])
            knee = midpoint(landmarks[Pose.LEFT_KNEE], landmarks[Pose.RIGHT_KNEE])
            wrist = midpoint(landmarks[Pose.LEFT_WRIST], landmarks[Pose.RIGHT_WRIST])
            elbow = midpoint(landmarks[Pose.LEFT_ELBOW], landmarks[Pose.RIGHT_ELBOW])

            """
            SHOULDER 3D COORDINATES
            """
            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/shoulder.json') as f1:
                config1 = json.load(f1)

            config1[f'SHOULDER_{self.num_frame}'] = shoulder

            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/shoulder.json', 'w') as f1:
                json.dump(config1, f1, indent=4)


            """
            HIP 3D COORDINATES
            """
            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/hip.json') as f2:
                config2 = json.load(f2)

            config2[f'HIP_{self.num_frame}'] = hip

            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/hip.json', 'w') as f2:
                json.dump(config2, f2, indent=4)


            """
            KNEE 3D COORDINATES
            """
            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/knee.json') as f3:
                config3 = json.load(f3)

            config3[f'KNEE_{self.num_frame}'] = knee

            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/knee.json', 'w') as f3:
                json.dump(config3, f3, indent=4)


            """
            WRIST 3D COORDINATES
            """
            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/wrist.json') as f4:
                config4 = json.load(f4)

            config4[f'WRIST_{self.num_frame}'] = wrist

            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/wrist.json', 'w') as f4:
                json.dump(config4, f4, indent=4)


            """
            ELBOW 3D COORDINATES
            """
            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/elbow.json') as f5:
                config5 = json.load(f5)

            config5[f'ELBOW_{self.num_frame}'] = elbow

            with open('src/components/MA2079_Engineering_Innovation_and_Desgin/pose_estimation/database/elbow.json', 'w') as f5:
                json.dump(config5, f5, indent=4)


        # Check if the original input image and the resultant image are specified to be displayed.
        if self.display:

            # Display the original input image and the resultant image.
            plt.figure(figsize=[22,22])
            plt.subplot(121);plt.imshow(self.image[:,:,::-1]);plt.title("Original Image");plt.axis('off');
            plt.subplot(122);plt.imshow(output_image[:,:,::-1]);plt.title("Output Image");plt.axis('off');

            # Also Plot the Pose landmarks in 3D.
            Pose.mp_drawing.plot_landmarks(results.pose_world_landmarks, Pose.mp_pose.POSE_CONNECTIONS)

        # Otherwise
        else:

            # Return the output image and the found landmarks.
            return output_image, landmarks, results.pose_world_landmarks, shoulder_confidence_index, hip_confidence_index, knee_confidence_index, wrist_confidence_index, elbow_confidence_index, front

    @classmethod
    def calculateSpineAngleSquat(cls, g_dir, landmark1, landmark2):
        '''
        This function calculates angle between three different landmarks.
        Args:
            landmark1: The first landmark containing the x,y and z coordinates.
            landmark2: The second landmark containing the x,y and z coordinates.
            landmark3: The third landmark containing the x,y and z coordinates.
        Returns:
            angle: The calculated angle between the three landmarks.

        '''

        # Get the required landmarks coordinates.
        x1, y1, z1 = landmark1
        x2, y2, z2 = landmark2

        if g_dir is not None:
            r = np.array([x1, y1]) - np.array([x2, y2]) #vector from low back to shoulder
            print(np.dot(r, g_dir))
            print(magnitude(r))
            theta = math.acos((math.floor(np.dot(r, g_dir) * 1e8) / 1e8) / magnitude(r))

            print(theta)

        # Return the calculated angle.
            return theta * 180 / math.pi

    @classmethod
    def calculateSpineAnglePush(cls, landmark1, landmark2, landmark3):
        '''
        This function calculates angle between three different landmarks.
        Args:
            landmark1: The first landmark containing the x,y and z coordinates.
            landmark2: The second landmark containing the x,y and z coordinates.
            landmark3: The third landmark containing the x,y and z coordinates.
        Returns:
            angle: The calculated angle between the three landmarks.

        '''

        # Get the required landmarks coordinates.
        x1, y1, z1 = landmark1
        x2, y2, z2 = landmark2
        x3, y3, z3 = landmark3

        r1 = np.array([x1, y1]) - np.array([x2, y2]) #vector from hip to shoulder
        r2 = np.array([x2, y2]) - np.array([x3, y3]) #vector from knee to hip

        beta = math.acos( (math.floor(np.dot(r1, r2) * 1e8) / 1e8) / (magnitude(r1) * magnitude(r2)) )

        print(f"spine angle: {beta * 180 / math.pi}")

        return beta * 180 / math.pi

    @classmethod
    def calculateElbowAngle(cls, landmark1, landmark2, landmark3):
        x1, y1, z1 = landmark1
        x2, y2, z2 = landmark2
        x3, y3, z3 = landmark3

        r1 = np.array([x1, y1]) - np.array([x2, y2]) #vector from elbow to wrist
        r2 = np.array([x3, y3]) - np.array([x2, y2]) #vector from elbow to shoulder

        alpha = math.acos( (math.floor(np.dot(r1, r2) * 1e8) / 1e8) / (magnitude(r1) * magnitude(r2)) )

        print(f"elbow angle: {alpha * 180 / math.pi}")

        return alpha * 180 / math.pi

    @classmethod
    def calculateDistance(cls, landmark1, landmark2):
        x1, y1, z1 = landmark1
        x2, y2, z2 = landmark2

        r = np.array([x1, y1]) - np.array([x2, y2]) #vector from shoulder to wrist
        r_mag = magnitude(r)

        print(f"distance: {r_mag}")

        return r_mag
