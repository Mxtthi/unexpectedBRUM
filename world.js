class World {
    constructor(areaSize, worldSize) {
        this.areaSize = areaSize;
        this.worldSize = worldSize;
        this.gameStatus = true;
    }

    loadWorld() {
        let currentPos = {}, render = {};

        if (world.car !== undefined) {
            let newPos = world.car.getCarPos();
            currentPos.x = parseInt(newPos.x);
            currentPos.y = parseInt(newPos.y);
        } else {
            currentPos.x = world.track.trackCourse[0].x;
            currentPos.y = world.track.trackCourse[0].y;
        }
        console.log(currentPos, "HIER");
        render.xStart = world.getRenderPos(currentPos.y, viewRadius);
        render.yStart = world.getRenderPos(currentPos.x, viewRadius);
        render.xEnd = currentPos.x + viewRadius;
        render.yEnd = currentPos.y + viewRadius;

        let height = render.xEnd - render.xStart + 1;
        let width = render.yEnd - render.yStart + 1;

        world.removeElem(document.getElementsByClassName("worldDiv")[0]);
        world.createWorld(render, viewRadius * 2 + 1);

        for (let y = render.yStart; y <= render.yEnd; y++) {
            for (let x = render.xStart; x <= render.xEnd; x++) {

                if (y < 0 || y >= world.worldSize || x < 0 || x >= world.worldSize) {
                    break;
                }

                let elem = document.getElementsByClassName(`x${x} y${y}`)[0];

                for (let i = 0; i < world.track.trackCourse.length; i++) {

                    const track = world.track.trackCourse[i];
                    if (track.x == x && track.y == y) {

                        elem.classList.add("road");
                        switch (world.track.trackCourse[i].turn) {
                            case "start":
                                elem.classList.add("start");
                                break;
                            case "end":
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
            }
        }

        document.getElementsByClassName("worldDiv")[0].setAttribute("style", `grid-template-columns: repeat(${width}, auto);`);
    }

    removeElem(elem) {
        if (elem != undefined) {
            elem.remove();
        }
    }

    createWorld(pos, size) {
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("worldDiv");
        document.body.appendChild(parentDiv);

        for (let y = pos.yStart; y <= pos.yEnd; y++) {
            for (let x = pos.xStart; x <= pos.xEnd; x++) {

                let areaDiv = document.createElement("div");
                areaDiv.classList.add("x" + x, "y" + y, "areaDiv");
                areaDiv.setAttribute("style", `width: ${this.areaSize}px; height: ${this.areaSize}px`);
                parentDiv.appendChild(areaDiv);

            }
        }
    }

    getRenderPos(pos, viewRadius) {
        for (let i = pos - viewRadius; i <= pos; i++) {
            if (i >= 0) {
                return i;
            }
        }
    }

    getPos(elem) {
        let temp = {}, pos = elem.getBoundingClientRect();
        temp.left = pos.left + window.scrollX;
        temp.top = pos.top + window.scrollY;
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
