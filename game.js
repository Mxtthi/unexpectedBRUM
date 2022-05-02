window.onload = function () {
    let world = new World(50, 50);
    world.track = new Track(world.areaSize, world.worldSize, 25, 25);
    world.track.createTrack();
    console.log(world);
};