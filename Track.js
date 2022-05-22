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
                this.setCoursePos(this.startPosX, this.startPosY, "up", 0, "start", "unknown");
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
                    this.setCoursePos(nextPos.x, nextPos.y, nextPos.direction, nextPos.rotation, nextPos.turn, nextPos.facing);
                }
            }
        }
    }

    setCoursePos(x, y, direction, rotation, turn, facing) {
        this.trackCourse.push({ x: x, y: y, direction: direction, rotation: rotation, turn: turn, facing: facing });
        this.area[y][x] = { x: x, y: y, direction: direction, rotation: rotation, turn: turn, facing: facing };
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
            let obj = this.getRotation(temp);
            temp.rotation = obj.rotation, temp.facing = obj.facing;
        } else {
            temp.rotation = 0;
            temp.facing = "unknown";
        }

        console.log(temp);

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

            if (temp.x - 1 >= 0) pos.left = this.area[temp.y][temp.x - 1];
            if (temp.x + 1 < worldSize) pos.right = this.area[temp.y][temp.x + 1];
            if (temp.y - 1 >= 0) pos.down = this.area[temp.y - 1][temp.x];
            if (temp.y + 1 < worldSize) pos.up = this.area[temp.y + 1][temp.x];

            temp = this.getCrossing(temp, pos);

        }
        return temp;
    }

    getCrossing(temp, pos) {
        let used = 0;
        let dir = { "left": "right", "right": "left", "up": "down", "down": "up" };
        for (const key in pos) {
            const element = pos[key];
            if (element != false && element != undefined && key != "middle") {
                if (element.facing.includes(dir[key])) {
                    used++;
                }
            }
        }

        console.log(temp, used, this.trackCourse.length);

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
        let obj = {};
        obj.rotation = 0;
        obj.facing = [];

        if (temp.turn == "straight") {
            if (temp.direction == "left" || temp.direction == "right") {
                obj.rotation = 90;
                obj.facing = ["left", "right"];
            } else {
                obj.facing = ["up", "down"];
            }
        } else if (temp.turn == "curve") {

            switch (temp.direction) {
                case "up":
                    if (getByChance(50, 50) == 1) {
                        obj.rotation = 270;
                        obj.facing = ["right", "down"];
                    } else {
                        obj.facing = ["left", "down"];
                    }
                    break;
                case "down":
                    if (getByChance(50, 50) == 1) {
                        obj.rotation = 90;
                        obj.facing = ["left", "up"];
                    } else {
                        obj.rotation = 180;
                        obj.facing = ["right", "up"];
                    }
                    break;
                case "left":
                    if (getByChance(50, 50) == 1) {
                        obj.rotation = 180;
                        obj.facing = ["right", "up"];
                    } else {
                        obj.rotation = 270;
                        obj.facing = ["right", "down"];
                    }
                    break;
                case "right":
                    if (getByChance(50, 50) == 1) {
                        obj.rotation = 90;
                        obj.facing = ["left", "up"];
                    } else {
                        obj.facing = ["left", "down"];
                    }
                    break;
                default:
                    console.log("unknown direction");
                    break;
            }
        }

        return obj;
    }
}