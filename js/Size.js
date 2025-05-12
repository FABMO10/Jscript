// This script calculates the number of times the mouse cursor moves on the webpage
let mouseMoveCount = 0;

document.addEventListener('mousemove', () => {
    mouseMoveCount++;
    console.log(`Mouse moved ${mouseMoveCount} times`);
});