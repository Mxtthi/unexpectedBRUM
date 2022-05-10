class Track extends World {
    constructor(areaSize, worldSize, trackLength) {
        super(areaSize, worldSize);
        this.startPosX = getRandomInt(0, this.worldSize - 1);
        this.startPosY = getRandomInt(0, this.worldSize - 1);
        this.trackLength = trackLength;
        this.currentPos = 0;

        this.createWorld();
        this.getTrackCourse();
    }

    getTrackCourse() {
        this.trackCourse = [];
        this.area = Array.from(Array(worldSize), () => new Array(worldSize));

        for (let i = 0; i <= this.trackLength; i++) {
            if (i == 0) {
                this.setCoursePos(this.startPosX, this.startPosY, "up", 0, "start");
            }
            else if (i == this.trackLength) {
                this.trackCourse[this.currentPos - 1].turn = "end";
                return;
            }
            else {
                let nextPos = this.getNextPos();
                if (nextPos == false) {
                    this.trackCourse[this.currentPos - 1].turn = "end";
                    return;
                }
                this.setCoursePos(nextPos.x, nextPos.y, nextPos.direction, nextPos.rotation, nextPos.turn);
            }
        }
    }

    setCoursePos(x, y, direction, rotation, turn) {
        let trackObj = { x: x, y: y, direction: direction, rotation: rotation, turn: turn };
        this.trackCourse.push(trackObj);
        this.area[y][x] = trackObj;
        this.currentPos++;
    }

    getNextPos() {
        let temp, isBlocked = false, counter = 0, chanceTurn = 30;;

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
        let isStraight = true, i = 1;

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
        let temp = {}, direction, lastArea = this.trackCourse[this.currentPos - 1];

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

        let elem = this.area[y][x];
        if (elem == undefined) {
            return false;
        } else {
            if (elem.turn == "straight" || elem.turn == "curve" || elem.turn == "crossing") {
                return "crossing";
            }
            return true;
        }
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
}