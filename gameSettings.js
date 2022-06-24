loadSessionStorage();
console.log(wSize);
let worldSize = parseInt(document.getElementById("worldSizeSlider").value);
if (wSize != 0) worldSize = wSize;
let viewRadius = document.getElementById("ViewRadiusSlider").value;
let trackLength = document.getElementById("trackLengthSlider").value;
let areaSize = document.getElementById("areaSizeSlider").value / 100 * window.innerWidth / 3;
let min = Math.round(worldSize * 0.3), max = Math.round(worldSize * 0.7);
let startPos = { x: getRandomInt(min, max), y: getRandomInt(min, max) };
let soundVolume = 0.75;

function loadSessionStorage() {
    if (sessionStorage.getItem("trackLength")) document.getElementById("trackLengthSlider").value = sessionStorage.getItem("trackLength");
    if (sessionStorage.getItem("worldSize")) document.getElementById("worldSizeSlider").value = sessionStorage.getItem("worldSize");
    if (sessionStorage.getItem("ViewRadius")) document.getElementById("ViewRadiusSlider").value = sessionStorage.getItem("ViewRadius");
    if (sessionStorage.getItem("areaSize")) document.getElementById("areaSizeSlider").value = sessionStorage.getItem("areaSize");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}