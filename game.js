
// let areaSize = (window.innerHeight + window.innerWidth) / 2 / 2;
let areaSize = 100;
let worldSize = 20;
if (window.innerHeight < window.innerWidth) {
    areaSize = window.innerHeight / (worldSize);
} else {
    areaSize = window.innerWidth / (worldSize);
}
let trackLength = 500;
let world = new World(areaSize, worldSize);
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.track.createTrack();
world.car = new Car(world.areaSize, world.worldSize);
console.log(world);
