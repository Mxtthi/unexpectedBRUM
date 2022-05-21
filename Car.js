class Car extends World {
    constructor(areaSize, worldSize) {
        super(areaSize, worldSize);
        this.height = Math.round(this.areaSize * 0.25);
        this.width = Math.round(this.height * 0.25 * 1.8);
        this.currentPosition = { x: 0, y: 0 };

        this.createCar();
        this.spawnCar();

    }

    getPos(elem) {
        let temp = {};
        let pos = elem.getBoundingClientRect();
        temp.left = pos.left + this.areaSize / 2;
        temp.top = pos.top + this.areaSize / 2;
        return temp;
    }

    getCarPos() {
        let elems = document.getElementsByClassName("areaDiv");
        let car = document.getElementsByClassName("car")[0];
        for (let i = 0; i < elems.length; i++) {
            const element = elems[i];
            if (checkIfElementsOverlap(car, element)) {
                this.currentPosition.x = element.classList[0].substring(1);
                this.currentPosition.y = element.classList[1].substring(1);
                console.log(this.currentPosition, "carPos");
            }
        }
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
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";
        elem.style.transform = `rotate(${this.rotation}deg)`;
        document.body.appendChild(elem);
    }

    scrollToCar() {
        this.getCarPos();
        let start = document.getElementsByClassName("start")[0];
        let startPos = this.getPos(start);
        console.log(start);
        start.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });

        let car = document.getElementsByClassName("car")[0]
        startPos = this.getPos(document.getElementsByClassName("start")[0]);
        car.style.left = startPos.left + "px";
        car.style.top = startPos.top + "px";
    }

    changeVelocity(value) {
        let multiplicator = 1;
        if (this.velocity < 0 && value > 0 || this.velocity > 0 && value < 0) {
            multiplicator = 3;
        }

        if (this.velocity >= -250 && this.velocity < 1000 || this.velocity <= -250 && value > 0 || this.velocity >= 1000 && value < 0) {
            this.velocity += value * multiplicator;
        }
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 10);
            this.isDriving = true;
        }
        console.log(this.velocity);
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

        car.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }


}