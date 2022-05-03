document.onkeydown = function (e) {
    e = e || window.event;

    switch (e.key.toLowerCase()) {
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
        default:
            console.log("key not found");
            break;
    }
}