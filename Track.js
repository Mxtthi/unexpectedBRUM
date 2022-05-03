class Track extends World {
    constructor(areaSize, worldSize, trackLength, startPosX, startPosY) {
        super(areaSize, worldSize);
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.trackLength = trackLength;
        this.currentPos = 0;

        this.createWorld();
        this.getTrackCourse();
    }

    getTrackCourse() {
        this.trackCourse = [];
        this.setCoursePos(this.startPosX, this.startPosY, "up", 0, "start");

        for (let i = 0; i < this.trackLength; i++) {
            let nextPos = this.getNextPos();
            if (nextPos == false) {
                this.createTrack();
                return;
            }
            this.setCoursePos(nextPos.x, nextPos.y, nextPos.direction, nextPos.rotation, nextPos.turn);
            this.createTrack();
        }
    }

    setCoursePos(x, y, direction, rotation, turn) {
        this.trackCourse.push({ x: x, y: y, direction: direction, rotation: rotation, turn: turn });
        this.currentPos++;
    }

    getNextPos() {
        let temp;
        let isBlocked = false;
        let counter = 0;

        do {
            temp = this.getDirection();
            isBlocked = false;
            if (temp == false) {
                isBlocked = true;
                counter++;
            }
            if (counter >= 5) {
                return false;
            }
        } while (isBlocked == true)

        let chanceTurn = 30;
        chanceTurn = this.chanceChanges(chanceTurn);
        if (temp.turn != "crossing") {
            temp.turn = this.getTurn(chanceTurn, 100 - chanceTurn);
            temp.rotation = this.getRotation(temp);
        } else {
            temp.rotation = 0;
        }
        return temp;
    }

    chanceChanges(chanceTurn) {
        let isStraight = true;
        let i = 1;

        if (this.currentPos < 5) {
            return chanceTurn;
        }

        while (isStraight) {
            if (this.currentPos - i <= 1 || this.trackCourse[this.currentPos - i].turn == "curve") {
                isStraight == false;
                break;
            }
            if (this.trackCourse[this.currentPos - i].turn == "straight") {
                chanceTurn += 5;
            }
            i++;
        }
        if (this.trackCourse[this.currentPos - 1].turn == "curve") {
            chanceTurn -= 20;
        }
        return chanceTurn;
    }

    getDirection() {
        let temp = {};
        let direction;
        let lastArea = this.trackCourse[this.currentPos - 1];

        if (lastArea.turn == "start") {
            direction = getRandomInt(1, 4);
        } else if (lastArea.turn == "straight" || lastArea.turn == "crossing") {

            switch (lastArea.direction) {
                case "up":
                    direction = 1;
                    break;
                case "down":
                    direction = 2;
                    break;
                case "left":
                    direction = 3;
                    break;
                case "right":
                    direction = 4;
                    break;
                default:
                    console.log("unknown direction");
                    break;
            }

        } else if (lastArea.turn == "curve") {

            switch (lastArea.direction) {
                case "up":
                    if (lastArea.rotation == 0) {
                        direction = 3;
                    } else if (lastArea.rotation == 270) {
                        direction = 4;
                    }
                    break;
                case "down":
                    if (lastArea.rotation == 90) {
                        direction = 3;
                    } else if (lastArea.rotation == 180) {
                        direction = 4;
                    } else {
                        console.log("unknown rotation");
                    }
                    break;
                case "left":
                    if (lastArea.rotation == 270) {
                        direction = 2;
                    } else if (lastArea.rotation == 180) {
                        direction = 1;
                    } else {
                        console.log("unknown rotation");
                    }
                    break;
                case "right":
                    if (lastArea.rotation == 90) {
                        direction = 1;
                    } else if (lastArea.rotation == 0) {
                        direction = 2;
                    } else {
                        console.log("unknown rotation");
                    }
                    break;
                default:
                    console.log("unknown direction");
                    break;

            }
        }

        temp = this.setDirection(direction);
        let check = this.checkIfUsedAlready(temp.x, temp.y);
        if (check == true) {
            return false;
        } else if (check == "crossing") {
            temp.turn = "crossing";
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

    checkIfUsedAlready(x, y) {
        if (this.worldSize <= x || x < 0 || this.worldSize <= y || y < 0) {
            return true;
        }
        let elem = document.getElementsByClassName(`x${x} y${y}`)[0];
        let arr = ["straight", "curve", "start"];
        for (let i = 0; i < arr.length; i++) {
            for (let v = 0; v < elem.classList.length; v++) {
                if (elem.classList[v].includes(arr[i])) {
                    if (arr[i] == "straight" || arr[i] == "curve") {
                        return "crossing";
                    }
                    return true;
                }
            }
        }
        return false;
    }

    getTurn(chanceCurve, chanceStraight) {
        if (getByChance(chanceCurve, chanceStraight) == 1) {
            return "curve";
        } else {
            return "straight";
        }
    }

    getRotation(temp) {
        let rotation = 0;

        if (temp.turn == "straight") {
            if (temp.direction == "left" || temp.direction == "right") {
                rotation = 90;
            }
        } else if (temp.turn == "curve") {

            switch (temp.direction) {
                case "up":
                    if (getByChance(50, 50) == 1) {
                        rotation = 270;
                    }
                    break;
                case "down":
                    if (getByChance(50, 50) == 1) {
                        rotation = 90;
                    } else {
                        rotation = 180;
                    }
                    break;
                case "left":
                    if (getByChance(50, 50) == 1) {
                        rotation = 180;
                    } else {
                        rotation = 270;
                    }
                    break;
                case "right":
                    if (getByChance(50, 50) == 1) {
                        rotation = 90;
                    }
                    break;
                default:
                    console.log("unknown direction");
                    break;

            }
        }

        return rotation;
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
                case "curve":
                    element.classList.add("curve");
                    break;
                case "crossing":
                    element.classList.add("crossing");
                    break;
                default:
                    console.log("direction not found");
                    break;
            }
            element.setAttribute("style", `transform: rotate(${this.trackCourse[i].rotation}deg); `)
        }
    }
}