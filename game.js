<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

let worldSize = 10, viewRadius = 3, trackLength = 500;
let areaSize = 500;
>>>>>>> bb5310c018a2c77fbc472d1804e77432867b9714
>>>>>>> f0b2c892ef61a523756b4624290f67a4c45b6826
let world = new World(areaSize, worldSize)
world.track = new Track(world.areaSize, world.worldSize, trackLength);
world.loadWorld();
world.car = new Car(world.areaSize, world.worldSize);
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> f0b2c892ef61a523756b4624290f67a4c45b6826
let start = world.car.getPos(document.getElementsByClassName("start")[0])
world.car.setCarPos(start.left, start.top);
world.car.scrollToCar();
world.updateWorld();
let intervalDings = setInterval(world.updateWorld, 100);


<<<<<<< HEAD
=======
=======
world.car.scrollToCar();
world.updateWorld();
let intervalDings = setInterval(world.updateWorld, 1000);
>>>>>>> bb5310c018a2c77fbc472d1804e77432867b9714
>>>>>>> f0b2c892ef61a523756b4624290f67a4c45b6826

