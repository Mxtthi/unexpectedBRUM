
let worldSize = 10, viewRadius = 3, trackLength = 500;
let areaSize = 500;
let world = new World(areaSize, worldSize)
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
world.car.scrollToCar();
world.updateWorld();
let intervalDings = setInterval(world.updateWorld, 1000);

