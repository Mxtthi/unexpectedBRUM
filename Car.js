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
        this.rotation = 0;
        this.isDriving = false;
    }

    spawnCar() {
        let elem = document.createElement("div");
        elem.classList.add("car");
        elem.style.left = this.startPosX + "px";
        elem.style.top = this.startPosY + "px";
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";
        document.body.appendChild(elem);
    }

    changeVelocity(value) {
        let multiplicator = 1;
        if (this.velocity < 0 && value > 0 || this.velocity > 0 && value < 0) {
            multiplicator = 5;
        }

        this.velocity += value * multiplicator;
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 50);
            this.isDriving = true;
        }
    }

    changeRotation(value) {
        this.rotation += value;
        if (this.rotation >= 360 || this.rotation <= -360) {
            this.rotation = 0;
        }
        if (this.isDriving == false) {
            let moveCarInterval = setInterval(() => this.moveCar(), 50);
            this.isDriving = true;
        }
    }

    moveCar() {
        let car = document.getElementsByClassName("car")[0];
        let posX = parseInt(car.style.left.substring(0, car.style.left.length - 2));
        let posY = parseInt(car.style.top.substring(0, car.style.top.length - 2))

        let sin = Math.sin(this.rotation * Math.PI / 180).toFixed(3);
        let cos = Math.cos(this.rotation * Math.PI / 180).toFixed(3);
        let movementX = (this.velocity / 20 * sin);
        let movementY = (this.velocity / 20 * cos) * -1;
        console.log(sin, "sin", cos, "cos");
        console.log(movementX, "x", movementY, "y", this.rotation, "rotation");
        // console.log(posX, posY, "x y", this.velocity, "velocity");
        car.style.top = (posY + movementY) + "px";
        car.style.left = (posX + movementX) + "px";
        car.style.transform = `rotate(${this.rotation}deg)`;
    }


}