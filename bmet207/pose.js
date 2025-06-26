import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
import { drawRectangles } from "./draw.js";
import { calculateAngle } from "./angles.js";
import { calculateScore } from "./score.js";
import { setCookie, getCookie } from "./cookies.js";

const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const canvasCtx = canvasElement.getContext('2d');
const startButton = document.getElementById("sButton");
const stopButton = document.getElementById("spButton");
const leftElbowAngleDisplay = document.getElementById("left");
const scoreDisplay = document.getElementById("score");
const lScoreDisplay = document.getElementById("lastScore");
const hScoreDisplay = document.getElementById("highScore");
let angleArray = [];
let poseLandmarker = undefined;
let webcamRunning = false;
let lastVideoTime = -1; // To manage video frame processing
var score = 0;
var maxFlex = 0;
var maxExtend = 0;
let startScore = false;
var lineColor = "#FF0000"
let highScore = getCookie("highscore");
let lastScore = getCookie("score");
let leftElbowAngle = 0;
let flexStart = false;
if (highScore === null || isNaN(highScore) || lastScore === null || isNaN(lastScore)) {
    lScoreDisplay.textContent = 0;
    hScoreDisplay.textContent = 0;
    highScore = setCookie("highscore", 0, 1000000);
    lastScore = setCookie("score", 0, 1000000);
}
else {
    lScoreDisplay.textContent = lastScore;
    hScoreDisplay.textContent = highScore;
}
maxDegrees('Enter maximum flexion degrees (the more the better)').then(value => {
    maxFlex = value;

    // Once first is done, ask for extension
    maxDegrees('Enter maximum extension degrees (the less the better)').then(value => {
        maxExtend = value;
    });
});



const myLandmarks = [
    11, // Left Shoulder   
    13, // Left Elbow   
    15  // Left Wrist
];

const drawingUtils = new DrawingUtils(canvasCtx);



// Initialize PoseLandmarker
const createPoseLandmarker = async () => {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `pose_landmarker_heavy.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO", // Always set to VIDEO for continuous stream
            numPoses: 1 // We are interested in detecting a single person's pose
        });
        // Enable the start button once the model is loaded
        startButton.disabled = false;
        console.log("PoseLandmarker model loaded successfully.");
    } catch (error) {
        console.error("Failed to load PoseLandmarker model:", error);
        alert("Failed to load the pose detection model. Please check your internet connection.");
    }
};
createPoseLandmarker();

async function predictWebcam() {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    let startTimeMs = performance.now();

    if (lastVideoTime !== videoElement.currentTime) {
        lastVideoTime = videoElement.currentTime;
        const results = poseLandmarker.detectForVideo(videoElement, startTimeMs);

        // DEBUG: Log raw results
        //console.log("Detection results:", results);

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];

            // Draw key points
            const filteredLandmarks = myLandmarks.map(index => landmarks[index]);
            drawingUtils.drawLandmarks(filteredLandmarks, { color: lineColor, lineWidth: 2, radius: 4 });

            // Calculate Elbow Angles
            const leftShoulder = landmarks[11];
            const leftElbow = landmarks[13];
            const leftWrist = landmarks[15];

            drawRectangles(leftShoulder, leftElbow, lineColor, canvasCtx);
            drawRectangles(leftElbow, leftWrist, lineColor, canvasCtx);
            // For angle calculation, it's good practice to ensure all necessary points are present
            leftElbowAngle = 0;
            // Check if all three points are available AND have sufficient visibility
            if (leftShoulder && leftElbow && leftWrist &&
                (leftShoulder.visibility === undefined || leftShoulder.visibility > 0.5) &&
                (leftElbow.visibility === undefined || leftElbow.visibility > 0.5) &&
                (leftWrist.visibility === undefined || leftWrist.visibility > 0.5)) {
                leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
                leftElbowAngleDisplay.textContent = leftElbowAngle
                leftElbowAngleDisplay.textContent = `${leftElbowAngle !== null ? Math.round(leftElbowAngle) + '°' : 'N/A'}`;
                if (startScore == true) {
                    angleArray.push(Math.round(leftElbowAngle));
                }
                if (leftElbowAngle >= maxFlex && startScore == false) {
                    flexStart = true;
                    lineColor = "#0000FF";
                    console.log("FLEX STARTED: Angle =", leftElbowAngle, "| MaxFlex =", maxFlex);
                }
                if (leftElbowAngle <= maxExtend && leftElbowAngle != null && flexStart == true) {
                    startScore = true;
                    lineColor = "#00FF00";
                    flexStart = false;
                    console.log("EXTENSION REACHED: Angle =", leftElbowAngle, "| MaxExtend =", maxExtend);
                }

                //console.log(angleArray);
                if (angleArray.length == 2 && startScore == true) {
                    score += calculateScore(angleArray, score, maxFlex, maxExtend);
                    //  console.log(score);
                    scoreDisplay.textContent = Math.round(score);
                    angleArray.shift();
                }

            } else {
                leftElbowAngleDisplay.textContent = `Left Elbow Angle: N/A (Insufficient Data)`;
            }

        } else {
            console.warn("No landmarks detected in this frame!");
        }

        canvasCtx.restore();
    }

    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
    }
}
// Enable the live webcam view and start detection.
function startCamera() {
    lineColor = "#FF0000";
    if (!poseLandmarker) {
        console.log("Wait! PoseLandmarker not loaded yet.");
        alert("Pose detection model is still loading. Please wait a moment.");
        return;
    }

    webcamRunning = true;
    startButton.disabled = true; // Disable start button once camera is on
    stopButton.disabled = false; // Enable stop button

    // getUsermedia parameters.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        videoElement.srcObject = stream;
        // Event listener for when video data is loaded
        videoElement.addEventListener("loadeddata", predictWebcam);
    }).catch(error => {
        console.error("Error accessing webcam:", error);
        webcamRunning = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        alert("Failed to start camera. Please ensure camera access is allowed and no other application is using it.");
    });

}

function stopCamera() {
    webcamRunning = false;
    startButton.disabled = false; // Enable start button
    stopButton.disabled = true;  // Disable stop button
    if (Math.round(score) > highScore) {
        highScore = score;
        setCookie("highscore", Math.round(score), 1000000);
    }
    setCookie("score", Math.round(score), 1000000);
    Swal.fire({
        title: "Score saved!",
        icon: "success",
    });
    lScoreDisplay.textContent = Math.round(score);
    hScoreDisplay.textContent = Math.round(highScore);
    leftElbowAngleDisplay.textContent = 0;
    score = 0;
    scoreDisplay.textContent = score
    startScore = false;
    flexStart == false;
    angleArray.length = 0;
    // Stop video stream
    if (videoElement.srcObject) {
        const stream = videoElement.srcObject;
        // Check if stream is a MediaStream before calling getTracks
        if (stream instanceof MediaStream) {
            stream.getTracks().forEach(track => track.stop());
        }
        videoElement.srcObject = null; // Clear the video source
    }

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clear canvas
    leftElbowAngle = 0;
}


// Event Listeners
startButton.addEventListener("click", startCamera);
stopButton.addEventListener("click", stopCamera);

// Initialize buttons state (Start button disabled until model loads)
startButton.disabled = true;
stopButton.disabled = true;


function maxDegrees(titleName) {
    return Swal.fire({
        title: titleName,
        input: 'number',
        inputPlaceholder: 'degrees',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'Please enter a number';
        }
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(`User's input: ${result.value}`);
            return Number(result.value);
        }
    });
}
