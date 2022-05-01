window.onload = function () {
    let world = new World(30, 30);
    world.track = new Track(world.areaSize, world.worldSize, 15, 15);
    world.track.createTrack();
    console.log(world);
};