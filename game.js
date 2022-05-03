let areaSize = 75;
let worldSize = 15;
let trackLength = 500;
let world = new World(areaSize, worldSize);
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.track.createTrack();
world.car = new Car(world.areaSize, world.worldSize);
console.log(world);
