
let worldSize = 30, viewRadius = 3, areaSize = 200, trackLength = 500, world = new World(areaSize, worldSize);
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
let carPos = world.car.getCarPos();
console.log(carPos);
world.car.currentPositionx = carPos.x;
world.car.currentPositionx = carPos.y;

world.scrollToElem(document.getElementsByClassName("start")[0]);
// let start = world.getPos(document.getElementsByClassName("start")[0])
// world.car.setCarPos(start.left, start.top);
// console.log(start);
// document.getElementsByClassName("car")[0].scrollIntoView();
// world.scrollToElem(document.getElementsByClassName("car")[0]);

let updateWorldInterval = setInterval(world.loadWorld, 1000);

console.log(world);

