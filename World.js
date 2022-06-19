class World {
    constructor(areaSize, worldSize, coins) {
        this.areaSize = areaSize;
        this.worldSize = worldSize;
        this.drivenOn = [];
        this.gameStatus = true;
        this.collectedCoins = coins;
        this.coinsArr = [];
        this.carObj = {
            "Default": "car.webp",
            "Wrom": "car1.webp",
            "Mercedes": "car2.webp"
        }
        this.carArr = ["owned", "a", "a"];
        this.carPrices = [0, 25, 50, 100, 250, 1000];

        this.coinSound = new Audio('./other/coin.mp3');
    }

    spawnCoinAt(posX, posY) {
        let coin = document.createElement("img");
        coin.src = "./other/coin.webp";
        coin.classList.add("coin");
        coin.style.left = posX + "px";
        coin.style.top = posY + "px";
        coin.style.height = world.areaSize / 10 + "px";
        document.body.appendChild(coin);
    }

    checkIfCollectedCoin() {
        for (let i = 0; i < document.getElementsByClassName("coin").length; i++) {
            const element = document.getElementsByClassName("coin")[i];
            if (world.checkIfElementsOverlap(document.getElementsByClassName("car")[0], element)) {
                element.remove();
                world.collectedCoins++;
                document.getElementById("coinCounter").innerHTML = world.collectedCoins;
                let clone = world.coinSound.cloneNode(true);
                clone.volume = 0.1;
                clone.play();
                world.coinsArr.splice(i, 1);
            }
        }
    }

    removeAllCoins() {
        for (let i = document.getElementsByClassName("coin").length - 1; i >= 0; i--) {
            document.getElementsByClassName("coin")[i].remove();
        }
    }

    loadCoins() {
        document.getElementById("coinCounter").innerHTML = world.collectedCoins;
        for (let i = 0; i < world.coinsArr.length; i++) {
            const elem = world.coinsArr[i];
            let pos = document.getElementsByClassName(`x${elem.x} y${elem.y}`)[0].getBoundingClientRect();
            world.spawnCoinAt(pos.left + (world.areaSize / elem.xOff), pos.top + (world.areaSize / elem.yOff));
        }
    }

    loadWorld() {
        world.hideAll();
        document.getElementsByClassName("worldDiv")[0].setAttribute("style", `grid-template-columns: repeat(${world.worldSize}, auto); `);

        for (let i = 0; i < world.track.trackCourse.length; i++) {
            let x = world.track.trackCourse[i].x;
            let y = world.track.trackCourse[i].y;
            let elem = document.getElementsByClassName(`x${x} y${y}`)[0];


            if (getRandomInt(0, 7) == 0 && world.track.trackCourse[i].turn != "start" && world.track.trackCourse[i].turn != "end") {
                let coin = {};
                coin.x = x, coin.y = y, coin.xOff = getRandomInt(2, 4), coin.yOff = getRandomInt(2, 4);
                world.coinsArr.push(coin);
            }
            elem.classList.add("road");
            switch (world.track.trackCourse[i].turn) {
                case "start":
                    elem.classList.add("start");
                    break;
                case "end":
                    elem.classList.remove("straight", "curve");
                    elem.classList.add("end");
                    break;
                case "straight":
                    elem.classList.add("straight");
                    break;
                case "curve":
                    elem.classList.add("curve");
                    break;
                case "crossing":
                    elem.classList.add("crossing");
                    break;
                case "tcrossing":
                    elem.classList.add("tcrossing");
                    break;
                default:
                    console.log("direction not found");
                    break;

            }
            elem.setAttribute("style", `transform: rotate(${world.track.trackCourse[i].rotation}deg); `);
        }
        world.loadCoins();
        world.loadShopItems();
    }

    loadShopItems() {
        let i = 0;
        for (const key in world.carObj) {
            let div = document.createElement("div"), status = document.createElement("input"), img = document.createElement("img"),
                button = document.createElement("input"), txt = document.createElement("span");

            div.classList.add("shopItemDiv");
            div.id = "item" + i;

            status.classList.add("status", "owned");
            status.type = "submit";
            status.id = "status" + i;
            status.disabled = true;

            img.src = "./other/" + world.carObj[key];
            img.classList.add("shopItem", "unselectable");

            button.type = "radio";
            button.classList.add("selectCar");
            button.name = "car";
            button.id = "button" + i;
            button.value = world.carObj[key];
            if (sessionStorage.getItem("car") == i) {
                button.checked = true;
            } else if (sessionStorage.getItem("car") == undefined && i == 0) {
                button.checked = true;
            }
            txt.innerHTML = "<br>" + key + "<br>";
            txt.classList.add("unselectable");

            document.getElementById("shop").appendChild(div);
            document.getElementById("item" + i).appendChild(img);
            document.getElementById("item" + i).appendChild(button);
            document.getElementById("item" + i).appendChild(txt);
            document.getElementById("shop").appendChild(status);

            world.setItemTo(document.getElementById("status" + i), world.carArr[i]);

            i++;
        }
    }

    setItemTo(elem, value) {
        let possibilities = ["owned", "affordable", "unaffordable"];
        let index = elem.id.charAt(elem.id.length - 1);
        possibilities.splice(possibilities.indexOf(value), 1)
        elem.classList.add(value);
        for (let i = 0; i < possibilities.length; i++) {
            elem.classList.remove(possibilities[i]);
        }

        switch (value) {
            case "owned":
                elem.value = "Owned";
                elem.disabled = true;
                elem.previousSibling.children[1].disabled = false;
                break;
            case "affordable":
                elem.value = "Buy - " + world.carPrices[index] + " coins";
                elem.disabled = false;
                elem.previousSibling.children[1].disabled = true;
                break;
            case "unaffordable":
                elem.value = "Too expensive";
                elem.disabled = true;
                elem.previousSibling.children[1].checked = false;
                elem.previousSibling.children[1].disabled = true;
                break;
            default:
                cowdole.log("invalid value");
                break;
        }
    }

    selectItem(elem) {
        for (let i = 0; i < document.getElementsByClassName("status").length; i++) {
            document.getElementsByClassName("status")[i].classList.remove("selected");
            world.setItemTo(document.getElementsByClassName("status")[i], world.carArr[i]);
        }
        elem.classList.add("selected");
        elem.value = "Selected";
    }

    checkPrices() {
        for (let i = 0; i < world.carArr.length; i++) {
            if (world.carArr[i] != "owned") {
                if (world.collectedCoins >= world.carPrices[i]) {
                    world.carArr[i] = "affordable";
                } else {
                    world.carArr[i] = "unaffordable";
                }
            }
            world.setItemTo(document.getElementById("status" + i), world.carArr[i]);
        }
    }

    sendButtonPressed() {
        let data = { "track": world.track.trackCourse };
        console.log(data.track.length);
        world.sendData(data);
    }

    loadButtonPressed() {
        let data = { "code": document.getElementById("codeInput").value };
        world.sendData(data);
    }

    sendData(dataToBeSent) {
        $("#result").innerHTML = "";
        $.post("db.php", dataToBeSent, function (data) {
            // Display the returned data in browser

            $("#result").html(data);
        });
        console.log("data sent");
    }

    getRoadsDrivenOn(arr) {
        let temp = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == true) temp++;
        }
        return temp / world.track.trackLength * 100;
    }


    updateWorld() {
        sessionStorage.setItem("carsrc", document.querySelector('input[name="car"]:checked').value);
        sessionStorage.setItem("car", document.querySelector('input[name="car"]:checked').id.charAt(document.querySelector('input[name="car"]:checked').id.length - 1));
        document.getElementsByClassName("car")[0].src = "./other/" + sessionStorage.getItem("carsrc");
        world.selectItem(document.getElementsByClassName("status")[sessionStorage.getItem("car")]);
        world.checkPrices();

        let currentX, currentY, renderPosX, renderPosY;
        if (world.checkIfElementsOverlap(document.getElementsByClassName("car")[0], document.getElementsByClassName("end")[0])) {
            world.drivenOn[world.track.trackLength - 1] = true;

            world.sendData({ coins: world.collectedCoins })

            world.car.idleSound.pause();
            world.car.drivingSound.pause();
            world.car.brakingSound.pause();

            alert("finished race");
            location.reload(true);
        }

        world.checkIfCollectedCoin();
        world.car.getCarPos();

        if (world.car !== undefined) {
            currentX = parseInt(world.car.currentPosition.x);
            currentY = parseInt(world.car.currentPosition.y);
        } else {
            currentX = world.track.trackCourse[0].x;
            currentY = world.track.trackCourse[0].y;
        }

        renderPosY = world.getRenderPosY(currentY, viewRadius)
        renderPosX = world.getRenderPosX(currentX, viewRadius)

        for (let y = renderPosY; y <= currentY + viewRadius; y++) {
            for (let x = renderPosX; x <= currentX + viewRadius; x++) {
                if (y < 0 || x < 0 || y >= world.worldSize || x >= world.worldSize) break;
                document.getElementsByClassName(`x${x} y${y} `)[0].classList.remove("invisible");
            }
        }
    }

    createWorld() {
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("worldDiv");
        parentDiv.setAttribute("style", `grid - template - columns: repeat(${this.worldSize}, auto); `);
        document.body.appendChild(parentDiv);

        for (let y = 0; y < this.worldSize; y++) {
            for (let x = 0; x < this.worldSize; x++) {
                let areaDiv = document.createElement("div");
                let rndm = getRandomInt(6, 50);
                if (rndm >= 20) rndm = getRandomInt(1, 50);
                areaDiv.classList.add("x" + x, "y" + y, "areaDiv", "var" + rndm);
                areaDiv.setAttribute("style", `width: ${this.areaSize}px; height: ${this.areaSize}px`);
                parentDiv.appendChild(areaDiv);
            }
        }
    }

    getRenderPosX(currentX, viewRadius) {
        for (let i = currentX - viewRadius; i <= currentX; i++) {
            if (i >= 0) return i;
        }
    }

    getRenderPosY(currentY, viewRadius) {
        for (let i = currentY - viewRadius; i <= currentY; i++) {
            if (i >= 0) return i;
        }
    }

    centerElem(elem) {
        elem.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
    }

    hideAll() {
        for (let y = 0; y < world.worldSize; y++) {
            for (let x = 0; x < world.worldSize; x++) {
                if (y < 0 || x < 0 || y >= world.worldSize || x >= world.worldSize) break;
                let elem = document.getElementsByClassName(`x${x} y${y}`)[0];
                elem.classList.add("invisible");
            }
        }
    }

    // input as percentage
    changeAreaSize(newSize) {
        newSize = newSize / 100 * window.innerWidth / 3;
        let currentTile = world.car.currentPosition;

        for (let y = 0; y < world.worldSize; y++) {
            for (let x = 0; x < world.worldSize; x++) {
                if (y < 0 || x < 0 || y >= world.worldSize || x >= world.worldSize) break;
                document.getElementsByClassName(`x${x} y${y}`)[0].style.height = newSize + "px";
                document.getElementsByClassName(`x${x} y${y}`)[0].style.width = newSize + "px";
            }
        }

        areaSize = newSize, world.areaSize = newSize, world.car.areaSize = newSize, world.track.areaSize = newSize;
        window.scrollTo(0, 0);
        world.removeAllCoins();
        world.loadCoins();

        world.car.moveCarToElem(document.getElementsByClassName(`x${currentTile.x} y${currentTile.y}`)[0]);
        document.getElementsByClassName("car")[0].style.height = Math.round(areaSize * 0.15) + "px";
    }

    collapsible() {
        let coll = document.getElementsByClassName("collapsible");
        let i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    }

    addListeners() {
        document.getElementById("getCode").addEventListener("click", world.sendButtonPressed);
        document.getElementById("setCode").addEventListener("click", world.loadButtonPressed);
        world.collapsible();

        document.getElementById("trackLengthOutput").innerHTML = document.getElementById("trackLengthSlider").value + " parts";
        document.getElementById("trackLengthSlider").oninput = function () {
            if (this.value > 1) {
                document.getElementById("trackLengthOutput").innerHTML = this.value + " parts";
            } else {
                document.getElementById("trackLengthOutput").innerHTML = this.value + " part";
            }
            sessionStorage.setItem("trackLength", this.value);
        };

        document.getElementById("worldSizeOutput").innerHTML = document.getElementById("worldSizeSlider").value + " parts";
        document.getElementById("worldSizeSlider").oninput = function () {
            document.getElementById("worldSizeOutput").innerHTML = this.value + " parts";
            sessionStorage.setItem("worldSize", this.value);
        };

        document.getElementById("ViewRadiusOutput").innerHTML = document.getElementById("ViewRadiusSlider").value + " parts";
        document.getElementById("ViewRadiusSlider").oninput = function () {
            if (this.value < viewRadius) world.hideAll();
            viewRadius = this.value;
            document.getElementById("ViewRadiusOutput").innerHTML = this.value + " parts";
            sessionStorage.setItem("ViewRadius", this.value);
        };

        document.getElementById("areaSizeOutput").innerHTML = document.getElementById("areaSizeSlider").value + "%";
        document.getElementById("areaSizeSlider").onchange = function () {
            if (this.value < 5) return;
            document.getElementById("areaSizeOutput").innerHTML = this.value + "%";
            world.changeAreaSize(this.value);
            sessionStorage.setItem("areaSize", this.value);
        };
    }

    getByChance(chance1, chance2) {
        let rndm = getRandomInt(1, 100);
        if (rndm <= chance1) {
            return 1;
        }
        else if (rndm <= chance2) {
            return 2;
        }
    }

    checkIfElementsOverlap(elem1, elem2) {
        let pos1 = elem1.getBoundingClientRect();
        let pos2 = elem2.getBoundingClientRect();

        return !(pos1.top > pos2.bottom || pos1.right < pos2.left || pos1.bottom < pos2.top || pos1.left > pos2.right);
    }
}
