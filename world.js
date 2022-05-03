class World {
    constructor(areaSize, worldSize) {
        this.areaSize = areaSize;
        this.worldSize = worldSize;
        this.gameStatus = true;
    }

    createWorld() {
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("worldDiv");
        parentDiv.setAttribute("style", `grid-template-columns: repeat(${this.worldSize}, auto);`);
        document.body.appendChild(parentDiv);

        for (let y = 0; y < this.worldSize; y++) {
            for (let x = 0; x < this.worldSize; x++) {
                let areaDiv = document.createElement("div");
                areaDiv.classList.add("x" + x, "y" + y, "areaDiv");
                areaDiv.setAttribute("style", `width: ${this.areaSize}px; height: ${this.areaSize}px`);
                parentDiv.appendChild(areaDiv);
            }
        }
    }
}