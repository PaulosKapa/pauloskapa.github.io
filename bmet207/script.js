const videoElement = document.getElementById('videoElement');
        const canvasElement = document.getElementById('canvasElement');
        const canvasCtx = canvasElement.getContext('2d');
        const startButton = document.getElementById("sButton");
        const stopButton = document.getElementById("spButton");

        function onResults(results) {
            // Before drawing, clear the canvas
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // Draw the camera feed on the canvas (optional, but useful for context)
            canvasCtx.drawImage(
                results.image, 0, 0, canvasElement.width, canvasElement.height);

            // Only draw the pose if landmarks are detected
            if (results.poseLandmarks) {
                // Use drawing_utils to draw the landmarks and connections
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                               {color: '#00FF00', lineWidth: 4}); // Green lines for connections
                drawLandmarks(canvasCtx, results.poseLandmarks,
                              {color: '#FF0000', lineWidth: 2, radius: 4}); // Red dots for landmarks
            }
        }

        // Initialize MediaPipe Pose
        const pose = new Pose({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }});

        // Configure MediaPipe Pose
        pose.setOptions({
            modelComplexity: 1, // 0, 1, or 2 (higher is more accurate but slower)
            smoothLandmarks: true,
            enableSegmentation: false, // Set to true if you need body segmentation
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        // Set up the camera
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await pose.send({image: videoElement});
            },
            width: 640,
            height: 480
        });
        // Set up the callback for results
        pose.onResults(onResults);
        function startCamera(){
        

        // Start the camera
        camera.start();

        // Adjust canvas size to match video when it loads metadata
        videoElement.addEventListener('loadedmetadata', () => {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
        });
    }

    startButton.addEventListener("click", function (e) {
            startCamera();
});
stopButton.addEventListener("click", function (e) {
            camera.stop();
});
