class Car extends World {
    constructor(areaSize, worldSize) {
        super(areaSize, worldSize);
        this.height = Math.round(this.areaSize * 0.15);
        this.currentPosition = { x: 0, y: 0 };
        this.drivingSound = new Audio('./other/driving.mp3');
        this.brakingSound = new Audio('./other/brake.mp3');
        this.idleSound = new Audio('./other/idle.mp3');
        this.velocity = 0;
        this.accelerating = false;
        this.isDriving = false;

        this.drivingSound.volume = 0.1;
        this.brakingSound.volume = 0.1;
        this.idleSound.volume = 0.3;
        this.idleSound.loop = true;
        this.drivingSound.loop = true;
        this.brakingSound.loop = true;

        this.createCar();
        this.spawnCar();
    }

    resumeAudio(audio) {
        audio.play();
    }

    pauseAudio(audio) {
        audio.pause();
    }

    moveCarToElem(elem) {
        window.scrollTo(0, 0);
        let pos = world.car.getPos(elem);
        world.car.getCarPos();
        world.centerElem(elem);
        document.getElementsByClassName("car")[0].style.left = pos.left + "px";
        document.getElementsByClassName("car")[0].style.top = pos.top + "px";
    }

    getPos(elem) {
        let temp = {};
        let pos = elem.getBoundingClientRect();
        temp.left = pos.left + areaSize / 2;
        temp.top = pos.top + areaSize / 2;
        return temp;
    }

    getCarPos() {
        let elems = document.getElementsByClassName("areaDiv");
        let car = document.getElementsByClassName("car")[0];
        for (let i = 0; i < elems.length; i++) {
            const element = elems[i];
            if (world.checkIfElementsOverlap(car, element)) {
                world.car.currentPosition.x = element.classList[0].substring(1);
                world.car.currentPosition.y = element.classList[1].substring(1);
            }
        }
    }

    setCarPos(x, y) {
        let car = document.getElementsByClassName("car")[0];
        car.style.left = x + "px";
        car.style.top = y + "px";
    }

    createCar() {
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
        let elem = document.createElement("img");
        elem.classList.add("car");
        elem.style.height = this.height + "px";
        elem.style.transform = `rotate(${this.rotation}deg)`;
        elem.src = "other/car.webp";
        document.body.appendChild(elem);
    }

    changeVelocity(value) {
        value *= 0.01 * world.areaSize * world.carSpeeds[sessionStorage.getItem("car")];
        console.log(value);
        let multiplicator = 1;
        if (this.velocity < 0 && value > 0 || this.velocity > 0 && value < 0) {
            multiplicator = 3;
        }
        if (value < 0) {
            if (this.velocity < world.areaSize * 1) {
                value *= 0.5;
            } else {
                value *= 3
                this.resumeAudio(this.brakingSound);
            }
        } else {
            this.resumeAudio(this.drivingSound);
        }
        if (this.velocity >= -world.areaSize * 0.5 && this.velocity < world.areaSize * 10 || this.velocity <= -world.areaSize * 0.5 && value > 0 || this.velocity >= world.areaSize * 10 && value < 0) {
            this.velocity += value * multiplicator;
        }
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 15);
            this.isDriving = true;
        }
    }

    changeRotation(value) {
        let multiplier = 1 + (world.carSpeeds[sessionStorage.getItem("car")] - 1) / 2
        if (multiplier > 2) multiplier = 2;
        value *= multiplier;
        if (this.velocity > world.areaSize * 0.03 || this.velocity < -world.areaSize * 0.03) {
            this.rotation += value;
            if (this.rotation >= 360 || this.rotation <= -360) {
                this.rotation = 0;
            }
        }
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 15);
            this.isDriving = true;
        }
    }

    slowDown() {
        let car = document.getElementsByClassName("car")[0];
        let road = document.getElementsByClassName("road");
        let onRoad = false;
        for (let i = 0; i < road.length; i++) {
            if (world.checkIfElementsOverlap(car, road[i])) {
                onRoad = true;
                world.drivenOn[i] = true;
                break;
            }
        }
        if (this.accelerating == false) {
            if (this.velocity < 10) {
                this.velocity *= 0.5;
            } else if (this.velocity < 3) {
                this.velocity = 0;
            } else
                this.velocity *= 0.98;
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

        world.centerElem(document.getElementsByClassName("car")[0]);
        if (this.velocity > areaSize / 10 || this.velocity < -areaSize / 10) this.resumeAudio(this.idleSound);
    }


}