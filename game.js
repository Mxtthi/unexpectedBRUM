
let worldSize = 100;
let viewRadius = worldSize;
let areaSize = 25;
let trackLength = 500;
let world = new World(areaSize, worldSize);
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
world.car.getCarPos();
world.car.scrollToCar();
console.log(world.track.area);

