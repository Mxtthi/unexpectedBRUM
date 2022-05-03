var keys = [];

window.addEventListener("keydown",
    function (e) {
        if (keys.includes(e.key) === false) {
            keys.push(e.key);
        }
    },
    false);

window.addEventListener('keyup',
    function (e) {
        keys.pop(e.key);
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
                world.car.changeRotation(-2.5);
                break;
            case "d":
                world.car.changeRotation(2.5);
                break;
            default:
                console.log("key not found");
                break;
        }
    }
}, 10);



