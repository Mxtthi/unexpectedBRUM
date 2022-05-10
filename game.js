
let worldSize = 50, viewRadius = worldSize, areaSize = 100, trackLength = 500, world = new World(areaSize, worldSize);
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
world.car.getCarPos();

world.scrollToElem(document.getElementsByClassName("start")[0]);
let start = world.getPos(document.getElementsByClassName("start")[0])
world.car.setCarPos(start.left, start.top);
world.scrollToElem(document.getElementsByClassName("car")[0]);

console.log(world);

