window.onload = function () {
    let world = new World(30, 10);
    world.track = new Track(world.areaSize, world.worldSize, 5, 5);
    console.log(world);
};