class World {
    constructor(areaSize, worldSize) {
        this.areaSize = areaSize;
        this.worldSize = worldSize;
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

class Track extends World {
    constructor(areaSize, worldSize, startPosX, startPosY) {
        super(areaSize, worldSize);
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.trackLength = 10;
        this.currentPos = 0;

        this.getTrackCourse();
        this.createWorld();
    }

    getTrackCourse() {
        this.trackCourse = [];
        this.setCoursePos(this.startPosX, this.startPosY);

        for (let i = 0; i < this.trackLength; i++) {
            this.getNextPos();

        }
    }

    getNextPos() {

    }

    setCoursePos(x, y) {
        this.trackCourse.push({ x: x, y: y });
        this.currentPos++;
    }

}