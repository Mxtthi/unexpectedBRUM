let world = new World(areaSize, worldSize)
world.track = new Track(world.areaSize, world.worldSize, trackLength);
if (trackCourse != 0 && typeof trackCourse !== undefined) {
    world.track.trackCourse = trackCourse;
    world.track.area = world.track.createAreaArray(world.track.trackCourse);
}
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
let start = world.car.getPos(document.getElementsByClassName("start")[0])
world.car.setCarPos(start.left, start.top);
world.car.scrollToCar();
world.updateWorld();
let updateWorld = setInterval(world.updateWorld, 100);
document.getElementById("getCode").addEventListener("click", world.sendButtonPressed);
document.getElementById("setCode").addEventListener("click", world.loadButtonPressed);