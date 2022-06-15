let worldSize = 50;
let viewRadius = worldSize;
let trackLength = 200;
let areaSize = window.innerWidth / worldSize;
let min = Math.round(worldSize * 0.3), max = Math.round(worldSize * 0.7);
let startPos = { x: getRandomInt(min, max), y: getRandomInt(min, max) };