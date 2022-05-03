window.onload = function () {
    let world = new World(200, 25);
    let trackLength = 500;
    let startPosX = 12;
    let startPosY = 12;
    world.track = new Track(world.areaSize, world.worldSize, trackLength, startPosX, startPosY);
    world.track.createTrack();
    world.car = new Car(world.areaSize, world.worldSize, startPosX, startPosY);
    console.log(world);
};