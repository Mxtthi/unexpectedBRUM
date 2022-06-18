let keys = [];

document.addEventListener("keydown",
    function (e) {
        if (keys.includes(e.key) === false) {
            if (e.key == "w" || e.key == "s") {
                world.car.accelerating = true;
            }
            if (e.key == "Tab") {
                e.preventDefault();
                location.reload(true);
            }
            keys.push(e.key);
        }
    },
    false);

document.addEventListener("keyup",
    function (e) {
        if (e.key == "w" || e.key == "s") {
            world.car.accelerating = false;
            world.car.pauseAudio(world.car.drivingSound);
            if (e.key == "s") world.car.pauseAudio(world.car.brakingSound);
        }
        keys = keys.filter(t => t !== e.key);
    },
    false);

setInterval(() => {
    for (let i = 0; i < keys.length; i++) {
        switch (keys[i].toLowerCase()) {
            case "w":
                world.car.changeVelocity(1);
                break;
            case "s":
                world.car.changeVelocity(-1);
                break;
            case "a":
                world.car.changeRotation(-2);
                break;
            case "d":
                world.car.changeRotation(2);
                break;
        }
    }
}, 15);



