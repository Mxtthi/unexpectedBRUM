let world = new World(areaSize, worldSize)
world.track = new Track(world.areaSize, world.worldSize, trackLength);
if (trackCourse != 0 && typeof trackCourse !== undefined) {
    world.track.trackCourse = trackCourse;
    world.track.area = world.track.createAreaArray(world.track.trackCourse);
}
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
world.car.moveCarToElem(document.getElementsByClassName("start")[0])
let updateWorld = setInterval(world.updateWorld, 100);
world.addListeners();