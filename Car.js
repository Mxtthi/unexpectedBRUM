class Car extends World {
    constructor(areaSize, worldSize, startPosX, startPosY) {
        super(areaSize, worldSize);
        this.startPosX = startPosX;
        this.startPosY = startPosY;
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

    }

    spawnCar() {
        let elem = document.createElement("div");
        elem.classList.add("car");
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";
        document.body.appendChild(elem);
    }

    changeVelocity(value) {
        this.velocity += value;
        if (moveCarInterval == undefined) {
            moveCarInterval = setInterval(() => this.moveCar, 1000);
        }
    }

    moveCar() {
        console.log("test");
    }


}