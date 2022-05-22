let world = new World(areaSize, worldSize)
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
let start = world.car.getPos(document.getElementsByClassName("start")[0])
world.car.setCarPos(start.left, start.top);
world.car.scrollToCar();
world.updateWorld();
let intervalDings = setInterval(world.updateWorld, 100);