class World {
    constructor(areaSize, worldSize) {
        this.areaSize = areaSize;
        this.worldSize = worldSize;
        this.gameStatus = true;
    }

    loadWorld() {
        let currentX, currentY, width, height;

        if (world.car !== undefined) {
            //world.car.getCarPos();
            currentX = parseInt(world.car.currentPosition.x);
            currentY = parseInt(world.car.currentPosition.y);
        } else {
            currentX = world.track.trackCourse[0].x;
            currentY = world.track.trackCourse[0].y;
        }

        world.resetRender();

        for (let y = world.getRenderPosY(currentY, viewRadius); y <= currentY + viewRadius; y++) {
            for (let x = world.getRenderPosX(currentX, viewRadius); x <= currentX + viewRadius; x++) {
                if (y < 0 || x < 0 || y >= world.worldSize || x >= world.worldSize) {
                    break;
                }

                let elem = document.getElementsByClassName(`x${x} y${y}`)[0];

                for (let i = 0; i < world.track.trackCourse.length; i++) {

                    const track = world.track.trackCourse[i];
                    if (track.x == x && track.y == y) {
                        console.log("place");

                        elem.classList.add("road");
                        switch (world.track.trackCourse[i].turn) {
                            case "start":
                                elem.classList.add("start");
                                break;
                            case "end":
                                elem.classList.remove("straight", "curve");
                                elem.classList.add("end");
                                break;
                            case "straight":
                                elem.classList.add("straight");
                                break;
                            case "curve":
                                elem.classList.add("curve");
                                break;
                            case "crossing":
                                elem.classList.add("crossing");
                                break;
                            default:
                                console.log("direction not found");
                                break;

                        }

                        elem.setAttribute("style", `transform: rotate(${world.track.trackCourse[i].rotation}deg); `)

                    }

                }
                elem.classList.add("active");
                width = x - world.getRenderPosX(currentX, viewRadius) + 1;
            }
            height = y - world.getRenderPosY(currentY, viewRadius) + 1;
        }
        console.log(width, height, "WICHTIG");
        document.getElementsByClassName("worldDiv")[0].setAttribute("style", `grid-template-columns: repeat(${width}, auto);`);
    }

    resetRender() {
        for (let i = document.getElementsByClassName("active").length - 1; i >= 0; i--) {
            document.getElementsByClassName("active")[i].classList.remove("active");
        }
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

    getRenderPosX(currentX, viewRadius) {
        for (let i = currentX - viewRadius; i <= currentX; i++) {
            if (i >= 0) {
                return i;
            }
        }
    }

    getRenderPosY(currentY, viewRadius) {
        for (let i = currentY - viewRadius; i <= currentY; i++) {
            if (i >= 0) {
                return i;
            }
        }
    }

    getPos(elem) {
        let temp = {}, pos = elem.getBoundingClientRect();
        temp.left = pos.x;
        temp.top = pos.y;
        return temp;
    }

    scrollToElem(elem) {
        elem.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }
}
