class World {
    constructor(areaSize, worldSize) {
        this.areaSize = areaSize;
        this.worldSize = worldSize;
        this.drivenOn = [];
        this.gameStatus = true;
    }

    loadWorld() {
        for (let y = 0; y < world.worldSize; y++) {
            for (let x = 0; x < world.worldSize; x++) {
                if (y < 0 || x < 0 || y >= world.worldSize || x >= world.worldSize) {
                    break;
                }
                let elem = document.getElementsByClassName(`x${x} y${y}`)[0];
                elem.classList.add("invisible");
            }
        }
        document.getElementsByClassName("worldDiv")[0].setAttribute("style", `grid-template-columns: repeat(${world.worldSize}, auto); `);

        for (let i = 0; i < world.track.trackCourse.length; i++) {

            let x = world.track.trackCourse[i].x;
            let y = world.track.trackCourse[i].y;

            let elem = document.getElementsByClassName(`x${x} y${y}`)[0];

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
                case "tcrossing":
                    elem.classList.add("tcrossing");
                    break;
                default:
                    console.log("direction not found");
                    break;

            }
            elem.setAttribute("style", `transform: rotate(${world.track.trackCourse[i].rotation}deg); `);
        }
    }

    sendButtonPressed() {
        let data = { "track": world.track.trackCourse };
        console.log(data.track.length);
        world.sendData(data);
    }

    loadButtonPressed() {
        let data = { "code": document.getElementById("codeInput").value };
        world.sendData(data);
    }

    sendData(dataToBeSent) {
        $("#result").innerHTML = "";
        $.post("db.php", dataToBeSent, function (data) {
            // Display the returned data in browser

            $("#result").html(data);
        });
        console.log("data sent");
    }

    getRoadsDrivenOn(arr) {
        let temp = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == true) temp++;
        }
        console.log(temp, world.track.trackLength);
        return temp / world.track.trackLength * 100;
    }


    updateWorld() {
        if (checkIfElementsOverlap(document.getElementsByClassName("car")[0], document.getElementsByClassName("end")[0])) {
            world.drivenOn[world.track.trackLength - 1] = true;
            console.log(world.getRoadsDrivenOn(world.drivenOn), world.drivenOn)
            alert("finished race");

            location.reload(true);
        }

        world.car.getCarPos();

        let currentX;
        let currentY;

        if (world.car !== undefined) {
            currentX = parseInt(world.car.currentPosition.x);
            currentY = parseInt(world.car.currentPosition.y);
        } else {
            currentX = world.track.trackCourse[0].x;
            currentY = world.track.trackCourse[0].y;
        }

        let renderPosY = world.getRenderPosY(currentY, viewRadius)
        let renderPosX = world.getRenderPosX(currentX, viewRadius)

        for (let y = renderPosY; y <= currentY + viewRadius; y++) {
            for (let x = renderPosX; x <= currentX + viewRadius; x++) {
                if (y < 0 || x < 0 || y >= world.worldSize || x >= world.worldSize) {
                    break;
                }
                document.getElementsByClassName(`x${x} y${y} `)[0].classList.remove("invisible");

            }
        }
    }

    createWorld() {
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("worldDiv");
        parentDiv.setAttribute("style", `grid - template - columns: repeat(${this.worldSize}, auto); `);
        document.body.appendChild(parentDiv);

        for (let y = 0; y < this.worldSize; y++) {
            for (let x = 0; x < this.worldSize; x++) {
                let areaDiv = document.createElement("div");
                // areaDiv.classList.add("x" + x, "y" + y, "areaDiv", "invisible");
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

    centerElem(elem) {
        elem.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
    }
}
