let worldSize = parseInt(document.getElementById("worldSizeSlider").value);
let viewRadius = document.getElementById("ViewRadiusSlider").value;
let trackLength = document.getElementById("trackLengthSlider").value;
let areaSize = document.getElementById("areaSizeSlider").value / 100 * window.innerWidth / 3;
let min = Math.round(worldSize * 0.3), max = Math.round(worldSize * 0.7);
let startPos = { x: getRandomInt(min, max), y: getRandomInt(min, max) };