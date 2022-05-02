function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getByChance(chance1, chance2) {
    let rndm = getRandomInt(1, 100);
    if (rndm <= chance1) {
        return 1;
    }
    else if (rndm <= chance2) {
        return 2;
    }
}