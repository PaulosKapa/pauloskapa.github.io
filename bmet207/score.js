export function calculateScore(angles, maxFlex, maxExtend) {
    let score = 0;
    let range = maxFlex - maxExtend
    if (angles[1] > angles[0]) {
        score = Math.abs(((angles[1] - range) / range));
    }
    return score;
}