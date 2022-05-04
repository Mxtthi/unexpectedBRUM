class Car extends World {
    constructor(areaSize, worldSize) {
        super(areaSize, worldSize);
        let pos = document.getElementsByClassName("start")[0].getBoundingClientRect();
        this.startPosX = pos.left + this.areaSize / 2;
        this.startPosY = pos.top + this.areaSize / 2;
        this.currentPosX = this.startPosX;
        this.currentPosY = this.startPosY;
        this.height = Math.round(this.areaSize * 0.25);
        this.width = Math.round(this.height * 0.55);

        this.createCar();
        this.spawnCar();

    }

    createCar() {
        this.velocity = 0;
        this.accelerating = false;
        this.isDriving = false;
        switch (world.track.trackCourse[1].direction) {
            case "up":
                this.rotation = 0;
                break;
            case "down":
                this.rotation = 180;
                break;
            case "left":
                this.rotation = 270;
                break;
            case "right":
                this.rotation = 90;
                break;
            default:
                console.log("unknown direction");
                break;
        }
    }

    spawnCar() {
        let elem = document.createElement("div");
        elem.classList.add("car");
        elem.style.left = this.startPosX + "px";
        elem.style.top = this.startPosY + "px";
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";
        elem.style.transform = `rotate(${this.rotation}deg)`;
        document.body.appendChild(elem);
    }

    changeVelocity(value) {
        let multiplicator = 1;
        if (this.velocity < 0 && value > 0 || this.velocity > 0 && value < 0) {
            multiplicator = 5;
        }

        if (this.velocity >= -75 && this.velocity < 350 || this.velocity <= -75 && value > 0 || this.velocity >= 350 && value < 0) {
            this.velocity += value * multiplicator;
        }
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 10);
            this.isDriving = true;
        }
    }

    changeRotation(value) {
        this.rotation += value;
        if (this.rotation >= 360 || this.rotation <= -360) {
            this.rotation = 0;
        }
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 10);
            this.isDriving = true;
        }
    }

    slowDown() {
        let car = document.getElementsByClassName("car")[0];
        let road = document.getElementsByClassName("road");
        let onRoad = false;
        for (let i = 0; i < road.length; i++) {
            if (checkIfElementsOverlap(car, road[i])) {
                onRoad = true;
                break;
            }
        }
        if (this.accelerating == false) {
            if (this.velocity < 10) {
                this.velocity *= 0.5;
            } else if (this.velocity < 3) {
                this.velocity = 0;
            } else
                this.velocity *= 0.99;
        }

        if (onRoad == false) {
            if (this.velocity > 100 || this.velocity < -100) {
                this.velocity *= 0.97;
            } else if (this.velocity > 50 || this.velocity < -50) {
                this.velocity += 0.98;
            } else {
                this.velocity += 0.99;
            }
        }
    }

    moveCar() {
        this.slowDown();
        let car = document.getElementsByClassName("car")[0];
        let posX = parseFloat(car.style.left.substring(0, car.style.left.length - 2));
        let posY = parseFloat(car.style.top.substring(0, car.style.top.length - 2))

        let sin = Math.sin(this.rotation * Math.PI / 180).toFixed(3);
        let cos = Math.cos(this.rotation * Math.PI / 180).toFixed(3);
        let movementX = (this.velocity / 100 * sin);
        let movementY = (this.velocity / 100 * cos) * -1;
        if (movementX > 0.05 || movementY > 0.05 || movementX < -0.05 || movementY < -0.05) {
            car.style.top = (posY + movementY) + "px";
            car.style.left = (posX + movementX) + "px";
        }
        car.style.transform = `rotate(${this.rotation}deg)`;

        /*console.log(sin, "sin", cos, "cos");
        console.log(movementX, "x", movementY, "y", this.rotation, "rotation", this.velocity, "speed");
        console.log(posX, posY, "x y", this.velocity, "velocity");
        console.log(car.style.top, "top", car.style.left, "left");*/
    }


}