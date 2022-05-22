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
        console.log(this.area, 0 in this.area[0]);

        for (let i = 0; i <= this.trackLength; i++) {

            if (i == 0) {
                this.setCoursePos(this.startPosX, this.startPosY, "up", 0, "start");
            } else if (i == this.trackLength) {
                this.trackCourse[this.currentPos - 1].turn = "end";
                return;
            }
            else {
                let nextPos = this.getNextPos();
                if (nextPos == false) {
                    this.trackCourse[this.currentPos - 1].turn = "end";
                    return;
                } else {
                    this.setCoursePos(nextPos.x, nextPos.y, nextPos.direction, nextPos.rotation, nextPos.turn);
                }
            }
        }
    }

    setCoursePos(x, y, direction, rotation, turn) {
        this.trackCourse.push({ x: x, y: y, direction: direction, rotation: rotation, turn: turn });
        this.area[y][x] = { x: x, y: y, direction: direction, rotation: rotation, turn: turn };
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

        if (temp.turn != "crossing" && temp.turn != "tcrossing") {
            let chanceTurn = this.getChangeForTurn(30);
            temp.turn = this.getTurn(chanceTurn, 100 - chanceTurn);
            temp.rotation = this.getRotation(temp);
        } else {
            temp.rotation = 0;
        }

        return temp;
    }

    getChangeForTurn(chanceTurn) {
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
        } else if (lastArea.turn == "straight" || lastArea.turn == "crossing" || lastArea.turn == "tcrossing") {

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
        let pos = {};
        pos.middle = this.checkIfUsedAlready(temp.x, temp.y);
        if (pos.middle == true) {
            return false;
        } else if (pos.middle == false || pos.middle == "crossing") {

            pos.left = this.checkIfUsedAlready(temp.x - 1, temp.y);
            pos.right = this.checkIfUsedAlready(temp.x + 1, temp.y);
            pos.bottom = this.checkIfUsedAlready(temp.x, temp.y - 1);
            pos.top = this.checkIfUsedAlready(temp.x, temp.y + 1);

            temp = this.getCrossing(temp, pos);

        }
        return temp;
    }

    getCrossing(temp, pos) {
        let used = 0;
        for (const key in pos) {
            const element = pos[key];
            if (element != false && key != "middle") {
                used++;
            }
        }

        if (used >= 3) {
            temp.turn = "crossing";
        } else if (used > 1) {
            temp.turn = "tcrossing";
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
        if (this.area[y][x] == undefined) {
            return false;
        } else {
            return "crossing";
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