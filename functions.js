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

function checkIfElementsOverlap(elem1, elem2) {
    let pos1 = elem1.getBoundingClientRect();
    let pos2 = elem2.getBoundingClientRect();

    return !(pos1.top > pos2.bottom || pos1.right < pos2.left || pos1.bottom < pos2.top || pos1.left > pos2.right);
}

function loadSessionStorage() {
    if (sessionStorage.getItem("trackLength")) document.getElementById("trackLengthSlider").value = sessionStorage.getItem("trackLength");
    if (sessionStorage.getItem("worldSize")) document.getElementById("worldSizeSlider").value = sessionStorage.getItem("worldSize");
    if (sessionStorage.getItem("ViewRadius")) document.getElementById("ViewRadiusSlider").value = sessionStorage.getItem("ViewRadius");
    if (sessionStorage.getItem("areaSize")) document.getElementById("areaSizeSlider").value = sessionStorage.getItem("areaSize");
}