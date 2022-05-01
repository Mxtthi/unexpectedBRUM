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
        this.setCoursePos(this.startPosX, this.startPosY, "up", 0, "start");

        for (let i = 0; i < this.trackLength; i++) {
            let nextPos = this.getNextPos();
            this.setCoursePos(nextPos.x, nextPos.y, nextPos.direction, nextPos.rotation, nextPos.turn);
        }
    }

    setCoursePos(x, y, direction, rotation, turn) {
        this.trackCourse.push({ x: x, y: y, direction: direction, rotation: rotation, turn: turn });
        this.currentPos++;
    }

    getNextPos() {
        let temp = this.getDirection();
        temp.turn = this.getTurn(15, 30);
        temp.rotation = this.getRotation(temp.turn);

        return temp;
    }

    getDirection() {
        let temp = {};
        let lastArea = this.trackCourse[this.currentPos - 1];

        if (lastArea.turn == "straight") {
            if (lastArea.rotation == 0) {
                temp = this.setDirection(getRandomInt(1, 2));
            } else if (lastArea.rotation == 90) {
                temp = this.setDirection(getRandomInt(3, 4));
            }
        } else if (lastArea.turn == "left") {
            switch (lastArea.rotation) {
                case 0:
                    temp = this.setDirection(3);
                    break;
                case 90:
                    temp = this.setDirection(1);
                    break;
                case 180:
                    temp = this.setDirection(4);
                    break;
                case 270:
                    temp = this.setDirection(2);
                    break;
            }
        } else if (lastArea.turn == "right") {
            switch (lastArea.rotation) {
                case 0:
                    temp = this.setDirection(4);
                    break;
                case 90:
                    temp = this.setDirection(2);
                    break;
                case 180:
                    temp = this.setDirection(3);
                    break;
                case 270:
                    temp = this.setDirection(1);
                    break;
            }
        } else {
            temp = this.setDirection(getRandomInt(1, 4));
        }

        if (this.checkIfUsedAlready(temp.x, temp.y)) {
            return false;
        }
        return temp;
    }

    setDirection(direction) {
        let temp = {};
        switch (direction) {
            case 1:
                temp.direction = "up";
                temp.x = this.trackCourse[this.currentPos - 1].x;
                temp.y = this.trackCourse[this.currentPos - 1].y - 1;
                break;
            case 2:
                temp.direction = "down";
                temp.x = this.trackCourse[this.currentPos - 1].x;
                temp.y = this.trackCourse[this.currentPos - 1].y + 1;
                break;
            case 3:
                temp.direction = "left";
                temp.x = this.trackCourse[this.currentPos - 1].x - 1;
                temp.y = this.trackCourse[this.currentPos - 1].y;
                break;
            case 4:
                temp.direction = "right";
                temp.x = this.trackCourse[this.currentPos - 1].x + 1;
                temp.y = this.trackCourse[this.currentPos - 1].y;
                break;
        }
        return temp;
    }

    getRotation(turn) {
        let lastArea = this.trackCourse[this.currentPos - 1];
        let rotation = 0;

        if (turn == "straight") {
            if (lastArea.turn == "left" || lastArea.turn == "right") {
                if (lastArea.rotation == 0 || lastArea.rotation == 180) {
                    rotation = 90;
                }
            } else {
                rotation = lastArea.rotation;
            }
        }

        if (turn == "left") {
            if (lastArea.turn == "straight") {
                if (lastArea.rotation == 90 && lastArea.direction == "left") {
                    if (getByChance(50) == 1) {
                        rotation = 180;
                    } else {
                        rotation = 270;
                    }
                } else if (lastArea.rotation == 90 && lastArea.direction == "right") {
                    if (getByChance(50) == 1) {
                        rotation = 90;
                    }
                }
            } else if (lastArea.turn == "left") {
                if (lastArea.rotation == 0 || lastArea.rotation == 90) {
                    if (getByChance(50) == 1) {
                        rotation = 180;
                    } else {
                        rotation = 270;
                    }
                } else if (lastArea.rotation == 90 && lastArea.direction == "right") {
                    rotation = 90;
                }
            }


        }
        return rotation;
    }

    getTurn(chanceLeft, chanceRight) {
        let rndm = getRandomInt(1, 100);

        if (rndm <= chanceLeft) {
            return "left";
        } else if (rndm <= chanceRight) {
            return "right";
        } else {
            return "straight";
        }
    }

    checkIfUsedAlready(x, y) {
        let elem = document.getElementsByClassName(`x${x} y${y}`)[0];
        let arr = ["straight", "right", "left", "start"];
        for (let i = 0; i < arr; i++) {
            if (elem.include(arr[i])) {
                return true;
            }
        }
        return false;
    }

    createTrack() {
        for (let i = 0; i < this.trackCourse.length; i++) {
            const element = document.getElementsByClassName(`x${this.trackCourse[i].x} y${this.trackCourse[i].y}`)[0];
            switch (this.trackCourse[i].turn) {
                case "start":
                    element.classList.add("start");
                    break;
                case "straight":
                    element.classList.add("straight");
                    break;
                case "left":
                    element.classList.add("left");
                    break;
                case "right":
                    element.classList.add("right");
                    break;
                default:
                    console.log("direction not found");
                    break;
            }
            console.log(this.trackCourse[i].rotation);
            element.setAttribute("style", `transform: rotate(${this.trackCourse[i].rotation}deg);`)
        }
    }
}