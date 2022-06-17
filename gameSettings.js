let worldSize = 50;
let viewRadius = 2;
let trackLength = 50;
let areaSize = window.innerWidth / 3;
let min = Math.round(worldSize * 0.3), max = Math.round(worldSize * 0.7);
let startPos = { x: getRandomInt(min, max), y: getRandomInt(min, max) };