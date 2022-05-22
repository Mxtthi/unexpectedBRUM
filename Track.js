class Track extends World {
    constructor(areaSize, worldSize, trackLength) {
        super(areaSize, worldSize);
        this.startPosX = startPos.x;
        this.startPosY = startPos.y;
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
                this.setCoursePos(this.startPosX, this.startPosY, "up", 0, "start", ["left", "right", "up", "down"], []);
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
                    this.setCoursePos(nextPos.x, nextPos.y, nextPos.direction, nextPos.rotation, nextPos.turn, nextPos.facing, nextPos.nextDirection);
                }
            }
        }
    }

    setCoursePos(x, y, direction, rotation, turn, facing, nextDirection) {
        this.trackCourse.push({ x: x, y: y, direction: direction, rotation: rotation, turn: turn, facing: facing, nextDirection: nextDirection });
        this.area[y][x] = { x: x, y: y, direction: direction, rotation: rotation, turn: turn, facing: facing, nextDirection: nextDirection };
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
            let chanceTurn = this.getChangeForTurn(10);
            temp.turn = this.getTurn(chanceTurn, 100 - chanceTurn);
            let obj = this.getRotation(temp);
            temp.rotation = obj.rotation, temp.facing = obj.facing;
        }

        return temp;
    }

    getChangeForTurn(chanceTurn) {
        let isStraight = true;
        let i = 1;

        while (isStraight) {
            if (this.currentPos - i <= 1 || this.trackCourse[this.currentPos - i].turn == "curve") {
                isStraight == false;
                break;
            }
            i
            if (this.trackCourse[this.currentPos - i].turn == "straight") {
                chanceTurn += 5;
            }
            i++;
            if (i > 5) {
                chanceTurn += 15;
            }
        }
        if (this.trackCourse[this.currentPos - 1].turn == "curve") {
            chanceTurn -= 5;
        }
        console.log(chanceTurn)
        return chanceTurn;
    }

    getDirection() {
        let temp = {};
        let direction;
        let lastArea = this.trackCourse[this.currentPos - 1];

        if (lastArea.turn == "start") {
            direction = getRandomInt(1, 4);
        } else if (lastArea.turn == "crossing" || lastArea.turn == "tcrossing") {

            direction = this.selectDirectionByString(lastArea.nextDirection[0]);

        }
        else if (lastArea.turn == "straight") {

            direction = this.selectDirectionByString(lastArea.direction);

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
        temp.nextDirection = [];
        let pos = {};
        pos.middle = this.checkIfUsedAlready(temp.x, temp.y);
        if (pos.middle == true) {
            return false;
        } else if (pos.middle == false || pos.middle == "crossing") {

            if (temp.x - 1 >= 0) pos.left = this.area[temp.y][temp.x - 1];
            if (temp.x + 1 < worldSize) pos.right = this.area[temp.y][temp.x + 1];
            if (temp.y - 1 >= 0) pos.up = this.area[temp.y - 1][temp.x];
            if (temp.y + 1 < worldSize) pos.down = this.area[temp.y + 1][temp.x];

            temp = this.getCrossing(temp, pos);

        }
        return temp;
    }

    selectDirectionByString(inputDirection) {
        let direction;
        switch (inputDirection) {
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
        return direction;
    }

    getCrossing(temp, pos) {
        let used = 0;
        let connections = [];
        let dir = { "left": "right", "right": "left", "up": "down", "down": "up" };
        for (const key in pos) {
            const element = pos[key];
            if (element != false && element != undefined && key != "middle") {
                if (element.facing.includes(dir[key])) {
                    used++;
                    connections.push(key);
                }
            }
        }

        if (used == 2) {
            console.log("JA");
        }

        if (used >= 3) {
            temp.turn = "crossing";
            temp.nextDirection = ["left", "right", "up", "down"];
            temp.facing = ["left", "right", "up", "down"];

            for (let i = 0; i < connections.length; i++) {
                const index = temp.nextDirection.indexOf(connections[i]);
                temp.nextDirection.splice(index, 1);
            }

            if (temp.nextDirection.length == 0) {
                temp.nextDirection.push(this.trackCourse[this.currentPos - 1].direction);
            }

        } else if (used == 2) {

            temp.turn = "tcrossing";
            let nextDirection;
            let possiblities = {
                0: ["left", "right", "down"],
                90: ["left", "up", "down"],
                180: ["left", "right", "up"],
                270: ["up", "right", "down"],
            }
            let possibleRotations = [];
            let rot;

            for (const key in possiblities) {
                if (possiblities[key].includes(connections[0]) && possiblities[key].includes(connections[1])) possibleRotations.push(key);
            }

            if (possibleRotations.length > 1 && getByChance(50, 50) == 1) {
                rot = possibleRotations[1];
            } else {
                rot = possibleRotations[0];
            }

            temp.facing = possiblities[rot];
            for (let i = 0; i < connections.length; i++) {
                const index = possiblities[rot].indexOf(connections[i]);
                possiblities[rot].splice(index, 1);
            }
            temp.rotation = parseInt(rot);
            temp.nextDirection.push(possiblities[rot][0]);
        }
        if (temp.turn == "tcrossing") {
            console.log(temp.x, temp.y, this.trackCourse.length, used, pos, connections)
            console.log(temp.turn)
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