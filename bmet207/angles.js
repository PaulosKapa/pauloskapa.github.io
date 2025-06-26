// Function to calculate the angle between three points (A, B, C) with B as the vertex
export function calculateAngle(A, B, C) {
    // // Ensure points have x and y properties
    // if (!A || !B || !C || typeof A.x === 'undefined' || typeof A.y === 'undefined' ||
    //     typeof B.x === 'undefined' || typeof B.y === 'undefined' ||
    //     typeof C.x === 'undefined' || typeof C.y === 'undefined') {
    //     console.warn("Invalid landmark data for angle calculation. Skipping.");
    //     return null; // Return null or throw an error
    // }

    const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
    let angle = Math.abs(radians * 180.0 / Math.PI); // Convert to degrees and take absolute value
    angle = 180-angle;
    if (angle > 180.0 || angle<0.0) {
        return null
    }
    return angle;
}