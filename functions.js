function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getByChance(chance) {
    let rndm = getRandomInt(1, 100);
    if (rndm <= chance) {
        return 1;
    }
    else {
        return 2;
    }
}