var bKeys = [];

$('body').keydown(function (e) {
    if (bKeys.includes(e.which) === false) {
        bKeys.push(e.which);
    }

    for (let i = 0; i < bKeys.length; i++) {
        switch (bKeys[i]) {
            case 87:
                world.car.changeVelocity(1);
                break;
            case 83:
                world.car.changeVelocity(-1);
                break;
            case 65:
                world.car.changeRotation(-3);
                break;
            case 68:
                world.car.changeRotation(3);
                break;
            default:
                console.log("key not found");
                break;
        }
    }
});

$('body').keyup(function (e) {
    bKeys.pop(e.which);
});
setInterval(() => {
    //console.log(bKeys);
}, 15);

