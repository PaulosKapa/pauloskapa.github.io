//squares for gamification
export function drawRectangles(pointA, pointB, color, canvasCtx) {
    if (pointA && pointB &&
        (pointA.visibility === undefined || pointA.visibility > 0.3) &&
        (pointB.visibility === undefined || pointB.visibility > 0.3)) {
        const pointAx = pointA.x * canvasElement.width;
        const pointAy = pointA.y * canvasElement.height;
        const pointBx = pointB.x * canvasElement.width;
        const pointBy = pointB.y * canvasElement.height;

        // Calculate the distance (length of the upper arm segment)
        const length = Math.hypot(pointBx - pointAx, pointBy - pointAy);
        const squareHeight = 25; // Fixed thickness of the "upper arm" square (adjust as desired)

        // Calculate the angle of the upper arm segment (shoulder to elbow)
        const angleRad = Math.atan2(pointBy - pointAy, pointBx - pointAx);

        canvasCtx.save(); // Save context state before applying transformations for the square
        canvasCtx.translate(pointAx, pointAy); // Translate origin to the shoulder (anchor point)
        canvasCtx.rotate(angleRad); // Rotate the context
        canvasCtx.fillStyle = color; // Orange color for the square
        canvasCtx.fillRect(0, -squareHeight / 2, length, squareHeight);
        canvasCtx.restore(); // Restore context to its state before square drawing transformations
    }
}